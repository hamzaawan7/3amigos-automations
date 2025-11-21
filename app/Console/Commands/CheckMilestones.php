<?php

namespace App\Console\Commands;

use App\Models\Employee;
use Illuminate\Console\Command;

class CheckMilestones extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'milestones:check';

    /**
     * The console command description.
     */
    protected $description = 'Check all employees for milestone achievements and award bonuses';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking employee milestones...');

        // Only check full-time permanent employees
        $employees = Employee::where('employment_type', 'full_time')
            ->where('employment_status', 'permanent')
            ->get();

        $milestones = \App\Models\PerformanceMilestone::where('is_active', true)->get();

        $rewardsAwarded = 0;
        $skippedCount = Employee::where('employment_type', '!=', 'full_time')
            ->orWhere('employment_status', '!=', 'permanent')
            ->count();

        if ($skippedCount > 0) {
            $this->info("Skipping {$skippedCount} employees (part-time/probation/intern/contract)");
        }

        foreach ($employees as $employee) {
            foreach ($milestones as $milestone) {
                $currentValue = $this->calculateEmployeeValue($employee, $milestone->type);

                if ($milestone->checkIfEmployeeEligible($employee, $currentValue)) {
                    // Award the milestone
                    \App\Models\EmployeeReward::create([
                        'employee_id' => $employee->id,
                        'milestone_id' => $milestone->id,
                        'bonus_amount' => $milestone->bonus_amount,
                        'currency' => $milestone->currency,
                        'achieved_value' => $currentValue,
                        'achieved_date' => now(),
                        'is_paid' => false,
                    ]);

                    $rewardsAwarded++;
                    $this->info("🎉 {$employee->name} earned: {$milestone->name} (\${$milestone->bonus_amount})");
                }
            }
        }

        $this->info("Total rewards awarded: {$rewardsAwarded}");
        return 0;
    }

    private function calculateEmployeeValue($employee, $type)
    {
        switch ($type) {
            case 'streak':
                return $this->calculateStreak($employee);

            case 'total_days':
                return $this->calculateTotalDays($employee);

            case 'attendance_rate':
                return $this->calculateAttendanceRate($employee);

            case 'on_time_rate':
                return $this->calculateOnTimeRate($employee);

            default:
                return 0;
        }
    }

    private function calculateStreak($employee)
    {
        $recentAttendances = $employee->attendances()
            ->where('date', '<=', now())
            ->orderBy('date', 'desc')
            ->limit(100)
            ->get();

        $streak = 0;
        $checkDate = now()->copy();

        while ($checkDate->isWeekday() && $streak < 100) {
            $dateStr = $checkDate->toDateString();
            $attendance = $recentAttendances->firstWhere('date', $dateStr);
            $wfhRecord = \App\Models\WorkFromHome::where('employee_id', $employee->id)
                ->where('date', $dateStr)
                ->where('task_submitted', true)
                ->first();

            if (($attendance && $attendance->check_in) || $wfhRecord) {
                $streak++;
                $checkDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    private function calculateTotalDays($employee)
    {
        $totalOffice = $employee->attendances()->whereNotNull('check_in')->count();
        $totalWFH = \App\Models\WorkFromHome::where('employee_id', $employee->id)
            ->where('task_submitted', true)
            ->count();

        return $totalOffice + $totalWFH;
    }

    private function calculateAttendanceRate($employee)
    {
        // Last 30 days attendance rate
        $thirtyDaysAgo = now()->subDays(30);
        $attendances = $employee->attendances()
            ->where('date', '>=', $thirtyDaysAgo)
            ->count();

        if ($attendances === 0) {
            return 0;
        }

        $present = $employee->attendances()
            ->where('date', '>=', $thirtyDaysAgo)
            ->whereNotNull('check_in')
            ->count();

        $wfh = \App\Models\WorkFromHome::where('employee_id', $employee->id)
            ->where('date', '>=', $thirtyDaysAgo)
            ->where('task_submitted', true)
            ->count();

        return round((($present + $wfh) / $attendances) * 100);
    }

    private function calculateOnTimeRate($employee)
    {
        $totalAttendances = $employee->attendances()
            ->whereNotNull('check_in')
            ->count();

        if ($totalAttendances === 0) {
            return 0;
        }

        $onTime = $employee->attendances()
            ->whereNotNull('check_in')
            ->get()
            ->filter(function($a) {
                try {
                    $time = \Carbon\Carbon::parse($a->check_in);
                    return $time->hour < 12;
                } catch (\Exception $e) {
                    return false;
                }
            })->count();

        return round(($onTime / $totalAttendances) * 100);
    }
}

