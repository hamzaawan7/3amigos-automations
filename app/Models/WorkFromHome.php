<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkFromHome extends Model
{
    protected $table = 'work_from_home';

    protected $fillable = [
        'employee_id',
        'date',
        'check_in_time',
        'daily_tasks',
        'task_submitted_at',
        'task_submitted',
        'is_late',
        'late_by_minutes',
    ];

    protected $casts = [
        'date' => 'date',
        'task_submitted_at' => 'datetime:H:i:s',
        'task_submitted' => 'boolean',
        'is_late' => 'boolean',
        'late_by_minutes' => 'integer',
    ];

    /**
     * Get the check_in_time attribute as time string only (H:i:s)
     */
    public function getCheckInTimeAttribute($value)
    {
        if (!$value) {
            return null;
        }

        try {
            // If it contains 'T' it's a datetime string, extract time
            if (strpos($value, 'T') !== false) {
                return \Carbon\Carbon::parse($value)->format('H:i:s');
            }

            // If it's already in H:i:s format, return as is
            if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $value)) {
                return $value;
            }

            // Try to parse as Carbon and return time
            return \Carbon\Carbon::parse($value)->format('H:i:s');
        } catch (\Exception $e) {
            // Fallback: try to extract time from string
            if (strlen($value) > 8) {
                return substr($value, 11, 8); // Extract HH:MM:SS from datetime
            }
            return $value;
        }
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function isTaskOverdue(): bool
    {
        if ($this->task_submitted) {
            return false;
        }

        // Task is overdue if it's after 11 PM on the WFH date
        $deadline = $this->date->copy()->setTime(23, 0, 0);
        return now()->greaterThan($deadline);
    }
}
