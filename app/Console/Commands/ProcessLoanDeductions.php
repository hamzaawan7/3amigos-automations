<?php

namespace App\Console\Commands;

use App\Models\Loan;
use App\Models\LoanDeduction;
use Illuminate\Console\Command;
use Carbon\Carbon;

class ProcessLoanDeductions extends Command
{
    protected $signature = 'loans:process-deductions';
    protected $description = 'Process monthly loan deductions on the 25th of each month';

    public function handle(): int
    {
        $this->info('Processing loan deductions for ' . now()->format('Y-m-d'));

        $activeLoans = Loan::where('status', 'active')
            ->where('remaining_amount', '>', 0)
            ->get();

        if ($activeLoans->isEmpty()) {
            $this->info('No active loans to process.');
            return Command::SUCCESS;
        }

        $processedCount = 0;
        $completedCount = 0;

        foreach ($activeLoans as $loan) {
            // Check if already deducted this month
            $alreadyDeducted = LoanDeduction::where('loan_id', $loan->id)
                ->whereYear('deduction_date', now()->year)
                ->whereMonth('deduction_date', now()->month)
                ->exists();

            if ($alreadyDeducted) {
                $this->warn("Loan #{$loan->id} already processed this month. Skipping.");
                continue;
            }

            // Calculate deduction amount (minimum of monthly deduction or remaining amount)
            $deductionAmount = min($loan->monthly_deduction, $loan->remaining_amount);

            // Create deduction record
            LoanDeduction::create([
                'loan_id' => $loan->id,
                'employee_id' => $loan->employee_id,
                'amount' => $deductionAmount,
                'deduction_date' => now(),
                'remaining_balance' => $loan->remaining_amount - $deductionAmount,
            ]);

            // Update loan
            $newAmountPaid = $loan->amount_paid + $deductionAmount;
            $newRemainingAmount = $loan->remaining_amount - $deductionAmount;

            $loan->update([
                'amount_paid' => $newAmountPaid,
                'remaining_amount' => $newRemainingAmount,
                'status' => $newRemainingAmount <= 0 ? 'completed' : 'active',
            ]);

            $processedCount++;

            if ($newRemainingAmount <= 0) {
                $completedCount++;
                $this->info("✓ Loan #{$loan->id} for {$loan->employee->name} - COMPLETED!");
            } else {
                $this->info("✓ Loan #{$loan->id} for {$loan->employee->name} - Deducted {$loan->currency} {$deductionAmount}");
            }
        }

        $this->info("---");
        $this->info("Processed {$processedCount} loan(s).");
        $this->info("Completed {$completedCount} loan(s).");

        return Command::SUCCESS;
    }
}

