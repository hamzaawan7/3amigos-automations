<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceMilestone extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'target_value',
        'bonus_amount',
        'currency',
        'is_active',
        'icon',
    ];

    protected $casts = [
        'bonus_amount' => 'decimal:2',
        'target_value' => 'integer',
        'is_active' => 'boolean',
    ];

    public function employeeRewards(): HasMany
    {
        return $this->hasMany(EmployeeReward::class, 'milestone_id');
    }

    public function checkIfEmployeeEligible($employee, $currentValue): bool
    {
        // Check if employee has already earned this milestone
        $alreadyEarned = EmployeeReward::where('employee_id', $employee->id)
            ->where('milestone_id', $this->id)
            ->exists();

        if ($alreadyEarned) {
            return false;
        }

        // Check if they meet the target
        return $currentValue >= $this->target_value;
    }
}
