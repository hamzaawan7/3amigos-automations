<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeReward extends Model
{
    protected $fillable = [
        'employee_id',
        'milestone_id',
        'bonus_amount',
        'currency',
        'achieved_value',
        'achieved_date',
        'is_paid',
        'paid_date',
        'notes',
    ];

    protected $casts = [
        'bonus_amount' => 'decimal:2',
        'achieved_value' => 'integer',
        'achieved_date' => 'date',
        'paid_date' => 'date',
        'is_paid' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(PerformanceMilestone::class, 'milestone_id');
    }
}
