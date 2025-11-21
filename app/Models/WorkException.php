<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkException extends Model
{
    protected $fillable = [
        'employee_id',
        'missed_date',
        'compensate_date',
        'status',
        'reason',
        'work_description',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'missed_date' => 'date',
        'compensate_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Check if this exception is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Approve the work exception
     */
    public function approve(User $approver): bool
    {
        $this->status = 'approved';
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        return $this->save();
    }

    /**
     * Reject the work exception
     */
    public function reject(User $approver): bool
    {
        $this->status = 'rejected';
        $this->approved_by = $approver->id;
        $this->approved_at = now();
        return $this->save();
    }

    /**
     * Scope to get approved exceptions
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get pending exceptions
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}

