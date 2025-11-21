<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Services\UltraMsgRetrievalService;
use App\Services\StreakRewardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    private UltraMsgRetrievalService $ultraMsgService;
    private StreakRewardService $streakRewardService;

    public function __construct(
        UltraMsgRetrievalService $ultraMsgService,
        StreakRewardService $streakRewardService
    ) {
        $this->ultraMsgService = $ultraMsgService;
        $this->streakRewardService = $streakRewardService;
    }
    public function index()
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return redirect()->route('dashboard')
                ->with('error', 'No employee record found.');
        }

        $employee = $user->employee;
        $today = now()->toDateString();

        // Check if already marked attendance today (office or WFH)
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        // Get recent attendance records (last 7 days)
        $recentAttendances = Attendance::where('employee_id', $employee->id)
            ->where('date', '>=', now()->subDays(7))
            ->orderBy('date', 'desc')
            ->get()
            ->map(function($a) {
                $checkInTime = null;
                if ($a->check_in) {
                    try {
                        $checkInTime = \Carbon\Carbon::parse($a->check_in)->format('H:i:s');
                    } catch (\Exception $e) {
                        $checkInTime = substr($a->check_in, 11, 8);
                    }
                }

                return [
                    'date' => $a->date,
                    'check_in' => $checkInTime,
                    'daily_report' => $a->daily_report,
                    'status' => $a->check_in ? ($a->is_late ? 'Late' : 'On Time') : 'Absent',
                    'is_late' => $a->is_late,
                    'late_by_minutes' => $a->late_by_minutes,
                ];
            });

        // Determine if checked in
        $isCheckedIn = $todayAttendance && $todayAttendance->check_in;
        $checkInInfo = ['marked' => false];

        if ($todayAttendance && $todayAttendance->check_in) {
            $checkInInfo = [
                'date' => $todayAttendance->date,
                'check_in' => $todayAttendance->check_in,
                'type' => $todayAttendance->type,
                'marked' => true,
                'is_late' => $todayAttendance->is_late,
                'late_by_minutes' => $todayAttendance->late_by_minutes,
                'is_wfh' => $todayAttendance->is_wfh,
                'task_submitted' => $todayAttendance->task_submitted,
                'daily_tasks' => $todayAttendance->daily_tasks,
                'task_submitted_at' => $todayAttendance->task_submitted_at,
            ];
        }

        // Check if employee has approved work exception for today (for weekend work)
        $hasWorkException = \App\Models\WorkException::where('employee_id', $employee->id)
            ->where('compensate_date', $today)
            ->where('status', 'approved')
            ->exists();

        return Inertia::render('Attendance/Index', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'leave_balance' => $employee->leave_balance,
                'annual_leave_quota' => $employee->annual_leave_quota,
                'current_streak' => $employee->current_streak,
                'longest_streak' => $employee->longest_streak,
            ],
            'todayAttendance' => $checkInInfo,
            'recentAttendances' => $recentAttendances,
            'attendanceStats' => $employee->getAttendanceStats(),
            'hasWorkException' => $hasWorkException,
        ]);
    }

    public function mark(Request $request)
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return back()->with('error', 'No employee record found.');
        }

        // Check if it's weekend (Saturday or Sunday)
        $dayOfWeek = now()->dayOfWeek;
        $today = now()->toDateString();

        if ($dayOfWeek === Carbon::SATURDAY || $dayOfWeek === Carbon::SUNDAY) {
            // Check if employee has approved work exception for today
            $hasWorkException = \App\Models\WorkException::where('employee_id', $user->employee->id)
                ->where('compensate_date', $today)
                ->where('status', 'approved')
                ->exists();

            if (!$hasWorkException) {
                return back()->with('error', 'Attendance cannot be marked on weekends. Please request a work exception if you need to work on weekends.');
            }
        }

        // Check if it's after 11 AM
        $currentHour = now()->hour;
        if ($currentHour < 11) {
            return back()->with('error', 'Attendance can only be marked after 11:00 AM.');
        }

        $employee = $user->employee;
        $today = now()->toDateString();

        // Get is_wfh from request and convert to boolean
        $isWFH = filter_var($request->input('is_wfh', false), FILTER_VALIDATE_BOOLEAN);

        // Log for debugging
        Log::info('Attendance mark request', [
            'employee' => $employee->name,
            'is_wfh_raw' => $request->input('is_wfh'),
            'is_wfh_bool' => $isWFH,
            'all_input' => $request->all()
        ]);

        // Check if already marked attendance
        $existing = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already marked your attendance today.');
        }

        // Check for any missed days (weekdays only) and deduct leave
        $this->processUnmarkedDays($employee, $today);

        $checkInTime = now()->format('h:i A');
        $checkInDateTime = now();

        // Calculate if late using employee's individual start time
        $employeeStartTime = $employee->start_time ?? '12:00:00';
        $startDateTime = Carbon::parse($today . ' ' . $employeeStartTime);

        $isLate = $checkInDateTime->greaterThan($startDateTime);
        $lateByMinutes = $isLate ? (int) abs($checkInDateTime->diffInMinutes($startDateTime, false)) : 0;

        // Create unified attendance record
        Attendance::create([
            'employee_id' => $employee->id,
            'date' => $today,
            'check_in' => now()->format('H:i:s'),
            'is_late' => $isLate,
            'late_by_minutes' => $lateByMinutes,
            'is_wfh' => $isWFH,
            'task_submitted' => false,
        ]);

        // Update streak
        if ($isLate) {
            $employee->breakStreak();
            $typeMsg = $isWFH ? 'WFH' : 'Office';

            // Format late time for message
            if ($lateByMinutes >= 60) {
                $hours = floor($lateByMinutes / 60);
                $mins = $lateByMinutes % 60;
                $lateTimeStr = $mins > 0 ? "{$hours} hour(s) and {$mins} minute(s)" : "{$hours} hour(s)";
            } else {
                $lateTimeStr = "{$lateByMinutes} minute(s)";
            }

            $message = "{$typeMsg} attendance marked. ⚠️ You checked in {$lateTimeStr} late. Your attendance streak has been reset.";
        } else {
            $employee->incrementStreak();

            // Check for streak-based milestone rewards
            $this->streakRewardService->checkAndAwardStreakMilestones($employee);

            $typeMsg = $isWFH ? 'WFH' : 'Office';
            $message = "{$typeMsg} attendance marked successfully! 🎉 Current streak: {$employee->current_streak} day(s)";
        }

        if ($isWFH) {
            $message .= " Remember to submit your daily tasks before 11 PM.";
        }

        // Send WhatsApp notification to group
        if ($isLate) {
            // Format late time as hours and minutes
            if ($lateByMinutes >= 60) {
                $hours = floor($lateByMinutes / 60);
                $mins = $lateByMinutes % 60;
                $lateStatus = $mins > 0
                    ? " (⚠️ Late by {$hours}h {$mins}m)"
                    : " (⚠️ Late by {$hours}h)";
            } else {
                $lateStatus = " (⚠️ Late by {$lateByMinutes}m)";
            }
        } else {
            $lateStatus = " (✅ On Time)";
        }

        $typeLabel = $isWFH ? 'Work From Home' : 'Office';
        $this->ultraMsgService->sendCheckInNotification(
            $employee->name,
            $checkInTime,
            $typeLabel . $lateStatus
        );

        return redirect()->route('attendance.index')
            ->with($isLate ? 'warning' : 'success', $message);
    }

    public function submitTasks(Request $request)
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return back()->with('error', 'No employee record found.');
        }

        // Check if it's after 6 PM for task submission
        $currentHour = now()->hour;
        if ($currentHour < 18) {
            return back()->with('error', 'WFH tasks can only be submitted after 6:00 PM.');
        }

        $validated = $request->validate([
            'daily_tasks' => 'required|string|min:200',
        ]);

        $employee = $user->employee;
        $today = now()->toDateString();

        // Find today's attendance record
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->where('is_wfh', true)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'You must check in for WFH first.');
        }

        if ($attendance->task_submitted) {
            return back()->with('error', 'Tasks already submitted for today.');
        }

        // Update with tasks
        $attendance->update([
            'daily_tasks' => $validated['daily_tasks'],
            'task_submitted' => true,
            'task_submitted_at' => now()->format('H:i:s'),
        ]);

        return redirect()->route('attendance.index')
            ->with('success', 'Daily tasks submitted successfully!');
    }

    private function processUnmarkedDays($employee, $today)
    {
        // Get the last attendance record
        $lastAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', '<', $today)
            ->orderBy('date', 'desc')
            ->first();

        if (!$lastAttendance) {
            return; // First time marking, no previous days to check
        }

        $startDate = Carbon::parse($lastAttendance->date)->addDay();
        $endDate = Carbon::parse($today)->subDay();

        // If there are days between last attendance and today
        if ($startDate <= $endDate) {
            $missedDays = 0;

            while ($startDate <= $endDate) {
                // Only count weekdays (Monday to Friday)
                if ($startDate->isWeekday()) {
                    // Check if valid attendance exists (office or WFH with submitted tasks)
                    $validAttendance = Attendance::where('employee_id', $employee->id)
                        ->where('date', $startDate->toDateString())
                        ->where(function($query) {
                            $query->where('is_wfh', false)
                                  ->whereNotNull('check_in')
                                  ->orWhere(function($q) {
                                      $q->where('is_wfh', true)
                                        ->where('task_submitted', true);
                                  });
                        })
                        ->exists();

                    // Check if there's an approved work exception for this date
                    $hasWorkException = \App\Models\WorkException::where('employee_id', $employee->id)
                        ->where('missed_date', $startDate->toDateString())
                        ->where('status', 'approved')
                        ->exists();

                    // Only mark as absent if no valid attendance AND no approved exception
                    if (!$validAttendance && !$hasWorkException) {
                        // Create absent record
                        Attendance::create([
                            'employee_id' => $employee->id,
                            'date' => $startDate->toDateString(),
                            'check_in' => null,
                        ]);

                        $missedDays++;
                    }
                }

                $startDate->addDay();
            }

            // Deduct leave for all missed days
            if ($missedDays > 0) {
                $employee->deductLeave($missedDays);

                // Send WhatsApp notification
                $this->sendLeaveDeductionNotification($employee, $missedDays);
            }
        }
    }

    private function sendLeaveDeductionNotification($employee, $days)
    {
        if (!$employee->whatsapp_id) {
            return;
        }

        $instanceId = config('services.ultramsg.instance_id');
        $token = config('services.ultramsg.token');

        if (!$instanceId || !$token) {
            return;
        }

        try {
            $daysText = $days === 1 ? '1 day' : "{$days} days";

            $message = "⚠️ *Leave Deducted*\n\n";
            $message .= "Hi {$employee->name},\n\n";
            $message .= "You missed marking attendance for {$daysText}.\n";
            $message .= "{$daysText} has been deducted from your leave balance.\n\n";
            $message .= "📊 *Current Leave Balance:* {$employee->leave_balance} days\n";
            $message .= "📅 *Annual Quota:* {$employee->annual_leave_quota} days\n\n";
            $message .= "Please remember to mark your attendance daily.";

            Http::get("https://api.ultramsg.com/{$instanceId}/messages/chat", [
                'token' => $token,
                'to' => $employee->whatsapp_id,
                'body' => $message,
            ]);
        } catch (\Exception $e) {
            \Log::error("Failed to send leave deduction notification: " . $e->getMessage());
        }
    }
}
