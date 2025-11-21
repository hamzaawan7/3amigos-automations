<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Loan extends Model
{
    protected $fillable = [
        'employee_id',
        'total_amount',
        'currency',
        'monthly_deduction',
        'remaining_amount',
        'loan_date',
        'next_deduction_date',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'monthly_deduction' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'loan_date' => 'date',
        'next_deduction_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function deductions(): HasMany
    {
        return $this->hasMany(LoanDeduction::class);
    }

    public function processMonthlyDeduction(): bool
    {
        if (!$this->is_active || $this->remaining_amount <= 0) {
            return false;
        }

        // Calculate deduction amount (not more than remaining)
        $deductionAmount = min($this->monthly_deduction, $this->remaining_amount);

        // Update remaining amount
        $this->remaining_amount -= $deductionAmount;

        // If loan is paid off, mark as inactive
        if ($this->remaining_amount <= 0) {
            $this->is_active = false;
            $this->remaining_amount = 0;
        }

        // Calculate next deduction date (25th of next month)
        $this->next_deduction_date = Carbon::parse($this->next_deduction_date)
            ->addMonth()
            ->day(25);

        $this->save();

        // Record the deduction
        LoanDeduction::create([
            'loan_id' => $this->id,
            'amount' => $deductionAmount,
            'currency' => $this->currency,
            'deduction_date' => now()->toDateString(),
            'remaining_after' => $this->remaining_amount,
        ]);

        return true;
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->total_amount <= 0) {
            return 0;
        }

        $paid = $this->total_amount - $this->remaining_amount;
        return round(($paid / $this->total_amount) * 100, 2);
    }

    public function getAmountPaidAttribute(): float
    {
        return $this->total_amount - $this->remaining_amount;
    }
}
