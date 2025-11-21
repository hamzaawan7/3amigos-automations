<?php

namespace App\Http\Controllers;

use App\Models\WorkFromHome;
use App\Services\UltraMsgRetrievalService;
use App\Services\StreakRewardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class WorkFromHomeController extends Controller
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

        // Check if already checked in WFH today
        $todayWFH = WorkFromHome::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        // Check if already marked office attendance
        $officeAttendance = \App\Models\Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->where('check_in', '!=', null)
            ->first();

        // Get recent WFH records (last 7 days)
        $recentWFH = WorkFromHome::where('employee_id', $employee->id)
            ->where('date', '>=', now()->subDays(7))
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn($w) => [
                'date' => $w->date->format('Y-m-d'),
                'check_in_time' => $w->check_in_time,
                'task_submitted' => $w->task_submitted,
                'task_submitted_at' => $w->task_submitted_at,
                'daily_tasks' => $w->daily_tasks,
                'is_overdue' => $w->isTaskOverdue(),
            ]);

        // Determine status - office attendance takes precedence
        $todayStatus = ['checked_in' => false];
        if ($officeAttendance) {
            $todayStatus = [
                'checked_in' => true,
                'type' => 'office',
                'check_in_time' => $officeAttendance->check_in,
                'message' => 'You have already marked your office attendance today.',
            ];
        } elseif ($todayWFH) {
            $todayStatus = [
                'checked_in' => true,
                'type' => 'wfh',
                'date' => $todayWFH->date->format('Y-m-d'),
                'check_in_time' => $todayWFH->check_in_time,
                'task_submitted' => $todayWFH->task_submitted,
                'task_submitted_at' => $todayWFH->task_submitted_at,
                'daily_tasks' => $todayWFH->daily_tasks,
            ];
        }

        // Check if it's after 6 PM for task submission
        $currentHour = now()->hour;
        $isBeforeSixPM = $currentHour < 18;

        return Inertia::render('WorkFromHome/Index', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
            ],
            'todayWFH' => $todayStatus,
            'recentWFH' => $recentWFH,
            'isBeforeSixPM' => $isBeforeSixPM,
            'currentHour' => $currentHour,
        ]);
    }

    public function checkIn(Request $request)
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return back()->with('error', 'No employee record found.');
        }

        // Check if it's after 11 AM
        $currentHour = now()->hour;
        if ($currentHour < 11) {
            return back()->with('error', 'WFH check-in can only be done after 11:00 AM.');
        }

        $employee = $user->employee;
        $today = now()->toDateString();

        // Check if already checked in WFH today
        $existing = WorkFromHome::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already checked in for WFH today.');
        }

        // Check if already marked office attendance
        $officeAttendance = \App\Models\Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->where('check_in', '!=', null)
            ->exists();

        if ($officeAttendance) {
            return back()->with('error', 'You have already marked your office attendance today.');
        }

        $checkInTime = now()->format('h:i A');
        $checkInDateTime = now();

        // Calculate if late using employee's individual start time
        $employeeStartTime = $employee->start_time ?? '12:00:00';
        $startDateTime = Carbon::parse($today . ' ' . $employeeStartTime);

        $isLate = $checkInDateTime->greaterThan($startDateTime);
        $lateByMinutes = $isLate ? $checkInDateTime->diffInMinutes($startDateTime) : 0;

        // Create WFH record with late tracking
        WorkFromHome::create([
            'employee_id' => $employee->id,
            'date' => $today,
            'check_in_time' => now()->format('H:i:s'),
            'task_submitted' => false,
            'is_late' => $isLate,
            'late_by_minutes' => $lateByMinutes,
        ]);

        // Update streak
        if ($isLate) {
            $employee->breakStreak();
            $message = "WFH check-in recorded. ⚠️ You checked in {$lateByMinutes} minute(s) late. Your attendance streak has been reset. Remember to submit your daily tasks before 11 PM.";
        } else {
            $employee->incrementStreak();

            // Check for streak-based milestone rewards
            $this->streakRewardService->checkAndAwardStreakMilestones($employee);

            $message = "WFH check-in recorded! 🎉 Current streak: {$employee->current_streak} day(s). Remember to submit your daily tasks before 11 PM.";
        }

        // Send WhatsApp notification to group
        $lateStatus = $isLate ? " (⚠️ Late by {$lateByMinutes}m)" : " (✅ On Time)";
        $this->ultraMsgService->sendCheckInNotification(
            $employee->name,
            $checkInTime,
            'Work From Home' . $lateStatus
        );

        return redirect()->route('wfh.index')
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

        // Find today's WFH record
        $wfh = WorkFromHome::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if (!$wfh) {
            return back()->with('error', 'You must check in for WFH first.');
        }

        if ($wfh->task_submitted) {
            return back()->with('error', 'Tasks already submitted for today.');
        }

        // Update with tasks
        $wfh->update([
            'daily_tasks' => $validated['daily_tasks'],
            'task_submitted' => true,
            'task_submitted_at' => now()->format('H:i:s'),
        ]);

        return redirect()->route('wfh.index')
            ->with('success', 'Daily tasks submitted successfully!');
    }
}
