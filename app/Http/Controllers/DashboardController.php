<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('employee.attendances');

        // If user is admin, show admin dashboard
        if ($user->is_admin) {
            return $this->adminDashboard();
        }

        $employee = $user->employee;

        // If user doesn't have an employee record, redirect to employees list
        if (!$employee) {
            return redirect()->route('employees.index')
                ->with('error', 'No employee record found. Please contact administrator.');
        }

        // This week stats (Monday to today)
        $weekStart = now()->startOfWeek();
        $weekPresentDays = $employee->attendances()
            ->where('date', '>=', $weekStart)
            ->where('date', '<=', now())
            ->where(function($query) {
                $query->where('is_wfh', false)
                      ->whereNotNull('check_in')
                      ->orWhere(function($q) {
                          $q->where('is_wfh', true)
                            ->where('task_submitted', true);
                      });
            })
            ->count();

        // Count weekdays from Monday to today
        $weekTotalDays = 0;
        $currentDate = $weekStart->copy();
        while ($currentDate->lte(now())) {
            if ($currentDate->isWeekday()) {
                $weekTotalDays++;
            }
            $currentDate->addDay();
        }

        // Leave balance stats
        $leavePercentage = $employee->annual_leave_quota > 0
            ? round(($employee->leave_balance / $employee->annual_leave_quota) * 100, 1)
            : 0;

        // Get attendance stats (includes streak and late arrivals)
        $attendanceStats = $employee->getAttendanceStats();
        $currentStreak = $employee->current_streak;

        // Total days worked (all time)
        $totalPresent = $employee->attendances()
            ->where(function($query) {
                $query->where('is_wfh', false)
                      ->whereNotNull('check_in')
                      ->orWhere(function($q) {
                          $q->where('is_wfh', true)
                            ->where('task_submitted', true);
                      });
            })
            ->count();

        // Get on-time and late counts from stats
        $onTimeCount = $attendanceStats['on_time_days'];
        $lateCount = $attendanceStats['late_days'];

        // Today's attendance
        $todayAttendance = $employee->attendances()
            ->where('date', now()->toDateString())
            ->first();

        // Determine check-in status
        $checkedInToday = $todayAttendance && $todayAttendance->check_in &&
                         (!$todayAttendance->is_wfh || $todayAttendance->task_submitted);
        $wfhPendingTasks = $todayAttendance && $todayAttendance->is_wfh && !$todayAttendance->task_submitted;

        $checkInTime = null;
        $checkInType = null;

        if ($todayAttendance && $todayAttendance->check_in) {
            $checkInTime = $todayAttendance->check_in;
            if ($todayAttendance->is_wfh) {
                $checkInType = $todayAttendance->task_submitted ? 'wfh_complete' : 'wfh_pending';
            } else {
                $checkInType = 'office';
            }
        }

        // Get employee rewards - show to all employees
        $rewards = $employee->rewards()->with('milestone')->latest()->get()->map(fn($r) => [
            'id' => $r->id,
            'milestone_name' => $r->milestone->name,
            'milestone_icon' => $r->milestone->icon,
            'bonus_amount' => $r->bonus_amount,
            'currency' => $r->currency,
            'achieved_date' => $r->achieved_date->format('d M, Y'),
            'is_paid' => $r->is_paid,
        ]);

        // Calculate progress towards active milestones - show to all employees for motivation
        $activeMilestones = \App\Models\PerformanceMilestone::where('is_active', true)
                ->whereNotIn('id', $rewards->pluck('milestone_id'))
                ->get()
                ->map(function($m) use ($currentStreak, $totalPresent, $onTimeCount) {
                    $currentValue = 0;
                    $percentage = 0;

                    switch($m->type) {
                        case 'streak':
                            $currentValue = $currentStreak;
                            break;
                        case 'total_days':
                            $currentValue = $totalPresent;
                            break;
                        case 'on_time_rate':
                            $currentValue = $onTimeCount;
                            break;
                    }

                    $percentage = min(100, round(($currentValue / $m->target_value) * 100));

                    return [
                        'id' => $m->id,
                        'name' => $m->name,
                        'description' => $m->description,
                        'type' => $m->type,
                        'target_value' => $m->target_value,
                        'current_value' => $currentValue,
                        'percentage' => $percentage,
                        'bonus_amount' => $m->bonus_amount,
                        'currency' => $m->currency,
                        'icon' => $m->icon,
                    ];
                });

        return Inertia::render('Dashboard', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'phone' => $employee->phone,
                'leave_balance' => $employee->leave_balance,
                'annual_leave_quota' => $employee->annual_leave_quota,
                'employment_type' => $employee->employment_type,
                'employment_status' => $employee->employment_status,
            ],
            'stats' => [
                // This week stats
                'week_present_days' => $weekPresentDays,
                'week_total_days' => $weekTotalDays,

                // Leave balance
                'leave_percentage' => $leavePercentage,


                // Total days worked
                'total_present' => $totalPresent,

                // On-time and late stats
                'on_time_count' => $onTimeCount,
                'late_count' => $lateCount,
                'on_time_percentage' => $attendanceStats['on_time_percentage'],

                // Streak stats
                'current_streak' => $employee->current_streak,
                'longest_streak' => $employee->longest_streak,

                // Today status
                'checked_in_today' => $checkedInToday,
                'today_check_in_time' => $checkInTime,
                'check_in_type' => $checkInType,
                'wfh_pending_tasks' => $wfhPendingTasks,
            ],
            'recent_attendances' => $employee->attendances()
                ->where('date', '<=', now())
                ->orderBy('date', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($a) => [
                    'date' => $a->date,
                    'check_in' => $a->check_in,
                    'status' => $a->check_in ? ($a->is_late ? 'Late' : 'On Time') : 'Absent',
                    'is_late' => $a->is_late,
                    'late_by_minutes' => $a->late_by_minutes,
                ]),
            'rewards' => $rewards,
            'milestone_progress' => $activeMilestones,
        ]);
    }

    private function adminDashboard()
    {
        $today = now()->toDateString();

        // Total employees
        $totalEmployees = \App\Models\Employee::count();

        // Today's attendance
        $todayAttendances = \App\Models\Attendance::where('date', $today)
            ->whereNotNull('check_in')
            ->count();

        // Today's WFH (count from unified attendance table)
        $todayWFH = \App\Models\Attendance::where('date', $today)
            ->where('is_wfh', true)
            ->whereNotNull('check_in')
            ->count();

        // Present today
        $presentToday = $todayAttendances;
        $absentToday = $totalEmployees - $presentToday;

        // This week stats
        $weekStart = now()->startOfWeek();
        $weekAttendances = \App\Models\Attendance::where('date', '>=', $weekStart)
            ->whereNotNull('check_in')
            ->count();

        // Pending work exceptions
        $pendingExceptions = \App\Models\WorkException::where('status', 'pending')->count();

        // Recent attendance activity
        $recentActivity = \App\Models\Attendance::with('employee')
            ->whereNotNull('check_in')
            ->orderBy('date', 'desc')
            ->orderBy('check_in', 'desc')
            ->take(10)
            ->get()
            ->map(fn($a) => [
                'employee_name' => $a->employee->name,
                'date' => $a->date->format('Y-m-d'),
                'check_in' => $a->check_in,
            ]);

        // Employees with low leave balance (< 3 days)
        $lowLeaveBalance = \App\Models\Employee::where('leave_balance', '<', 3)
            ->orderBy('leave_balance', 'asc')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'leave_balance' => $e->leave_balance,
            ]);

        // This month stats
        $monthStart = now()->startOfMonth();
        $monthAttendances = \App\Models\Attendance::where('date', '>=', $monthStart)
            ->whereNotNull('check_in')
            ->count();

        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'present_today' => $presentToday,
                'absent_today' => $absentToday,
                'today_wfh' => $todayWFH,
                'week_attendances' => $weekAttendances,
                'month_attendances' => $monthAttendances,
                'pending_exceptions' => $pendingExceptions,
                'attendance_rate_today' => $totalEmployees > 0 ? round(($presentToday / $totalEmployees) * 100, 1) : 0,
            ],
            'recent_activity' => $recentActivity,
            'low_leave_balance' => $lowLeaveBalance,
        ]);
    }
}
