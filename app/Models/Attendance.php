<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Builder;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'daily_report',
        'is_late',
        'late_by_minutes',
        'is_wfh',
        'daily_tasks',
        'task_submitted',
        'task_submitted_at',
    ];

    protected $casts = [
        'date' => 'date',
        'is_late' => 'boolean',
        'late_by_minutes' => 'integer',
        'is_wfh' => 'boolean',
        'task_submitted' => 'boolean',
    ];

    /**
     * Get the check_in attribute as time string only (H:i:s)
     */
    public function getCheckInAttribute($value)
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

    public function scopeToday(Builder $query, string $timezone = 'Asia/Karachi'): Builder
    {
        $today = Carbon::now($timezone)->toDateString();
        return $query->where('date', $today);
    }

    /**
     * Check if WFH task submission is overdue
     */
    public function isTaskOverdue(): bool
    {
        if (!$this->is_wfh || $this->task_submitted) {
            return false;
        }

        $deadline = Carbon::parse($this->date)->setTime(23, 0, 0);
        return Carbon::now()->greaterThan($deadline);
    }

    /**
     * Get attendance type display name
     */
    public function getTypeAttribute(): string
    {
        if ($this->is_wfh) {
            return $this->task_submitted ? 'WFH (Tasks Submitted)' : 'WFH (Tasks Pending)';
        }
        return 'Office';
    }

    /**
     * Get attendance status
     */
    public function getStatusAttribute(): string
    {
        if (!$this->check_in) {
            return 'Absent';
        }

        if ($this->is_late) {
            return 'Late';
        }

        return 'On Time';
    }
}
