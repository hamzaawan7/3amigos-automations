<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'whatsapp_id',
        'start_time',
        'annual_leave_quota',
        'leave_balance',
        'salary',
        'currency',
        'salary_type',
        'last_increment_date',
        'kpi_score',
        'employment_type',
        'employment_status',
        'current_streak',
        'longest_streak',
        'last_on_time_date',
    ];

    protected $casts = [
        'annual_leave_quota' => 'integer',
        'leave_balance' => 'decimal:2',
        'salary' => 'decimal:2',
        'kpi_score' => 'decimal:2',
        'last_increment_date' => 'date',
        'current_streak' => 'integer',
        'longest_streak' => 'integer',
        'last_on_time_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function activeLoan()
    {
        return $this->hasOne(Loan::class)->where('is_active', true)->latest();
    }

    public function workFromHome(): HasMany
    {
        return $this->hasMany(WorkFromHome::class);
    }

    public function rewards(): HasMany
    {
        return $this->hasMany(EmployeeReward::class);
    }

    public function isEligibleForRewards(): bool
    {
        // Only full-time permanent employees are eligible for rewards
        return $this->employment_type === 'full_time' && $this->employment_status === 'permanent';
    }

    public function workExceptions(): HasMany
    {
        return $this->hasMany(WorkException::class);
    }

    public function deductLeave(float $days = 1.0): bool
    {
        if ($this->leave_balance <= 0) {
            return false;
        }
        $this->leave_balance = max(0, $this->leave_balance - $days);
        return $this->save();
    }

    /**
     * Increment the employee's on-time attendance streak
     */
    public function incrementStreak(): void
    {
        $this->current_streak++;

        if ($this->current_streak > $this->longest_streak) {
            $this->longest_streak = $this->current_streak;
        }

        $this->last_on_time_date = now()->toDateString();
        $this->save();
    }

    /**
     * Break the employee's attendance streak due to late arrival
     */
    public function breakStreak(): void
    {
        $this->current_streak = 0;
        $this->last_on_time_date = null;
        $this->save();
    }

    /**
     * Get attendance statistics including streak and late arrivals
     */
    public function getAttendanceStats(): array
    {
        // Count total present days (office or WFH with submitted tasks)
        $totalDays = $this->attendances()
            ->where(function($query) {
                $query->where('is_wfh', false)
                      ->whereNotNull('check_in');
            })
            ->orWhere(function($query) {
                $query->where('is_wfh', true)
                      ->where('task_submitted', true);
            })
            ->count();

        // Count late days
        $lateDays = $this->attendances()
            ->where('is_late', true)
            ->where(function($query) {
                $query->where('is_wfh', false)
                      ->whereNotNull('check_in')
                      ->orWhere(function($q) {
                          $q->where('is_wfh', true)
                            ->where('task_submitted', true);
                      });
            })
            ->count();

        $onTimeDays = $totalDays - $lateDays;
        $onTimePercentage = $totalDays > 0 ? round(($onTimeDays / $totalDays) * 100, 1) : 0;

        return [
            'total_days' => $totalDays,
            'on_time_days' => $onTimeDays,
            'late_days' => $lateDays,
            'on_time_percentage' => $onTimePercentage,
            'current_streak' => $this->current_streak,
            'longest_streak' => $this->longest_streak,
        ];
    }
}
