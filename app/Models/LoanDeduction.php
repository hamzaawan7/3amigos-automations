<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanDeduction extends Model
{
    protected $fillable = [
        'loan_id',
        'amount',
        'currency',
        'deduction_date',
        'remaining_after',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'remaining_after' => 'decimal:2',
        'deduction_date' => 'date',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
