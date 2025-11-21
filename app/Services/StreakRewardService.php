<?php declare(strict_types=1);

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeReward;
use App\Models\PerformanceMilestone;
use Illuminate\Support\Facades\Log;

final class StreakRewardService
{
    /**
     * Check if employee's current streak qualifies for any milestone rewards
     */
    public function checkAndAwardStreakMilestones(Employee $employee): void
    {
        // Only check for eligible employees
        if (!$employee->isEligibleForRewards()) {
            return;
        }

        // Get all active attendance_streak milestones
        $streakMilestones = PerformanceMilestone::where('type', 'attendance_streak')
            ->where('is_active', true)
            ->orderBy('target_value', 'asc')
            ->get();

        foreach ($streakMilestones as $milestone) {
            // Check if already earned
            $alreadyEarned = EmployeeReward::where('employee_id', $employee->id)
                ->where('milestone_id', $milestone->id)
                ->exists();

            if ($alreadyEarned) {
                continue;
            }

            // Check if current streak meets or exceeds target
            if ($employee->current_streak >= $milestone->target_value) {
                $this->awardMilestone($employee, $milestone);
            }
        }
    }

    /**
     * Award a milestone to an employee
     */
    private function awardMilestone(Employee $employee, PerformanceMilestone $milestone): void
    {
        EmployeeReward::create([
            'employee_id' => $employee->id,
            'milestone_id' => $milestone->id,
            'bonus_amount' => $milestone->bonus_amount,
            'currency' => $milestone->currency,
            'achieved_value' => $employee->current_streak,
            'achieved_date' => now(),
            'is_paid' => false,
        ]);

        Log::info('Streak milestone awarded', [
            'employee' => $employee->name,
            'milestone' => $milestone->name,
            'streak' => $employee->current_streak,
            'bonus' => $milestone->bonus_amount,
        ]);

        // Send notification (optional - can implement later)
        // $this->notifyEmployee($employee, $milestone);
    }

    /**
     * Check all eligible employees for streak milestones (can be run via scheduled command)
     */
    public function checkAllEmployees(): void
    {
        $employees = Employee::where('employment_type', 'full_time')
            ->where('employment_status', 'permanent')
            ->where('current_streak', '>', 0)
            ->get();

        foreach ($employees as $employee) {
            $this->checkAndAwardStreakMilestones($employee);
        }
    }
}

