<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Loan;
use Carbon\Carbon;

class ProcessMonthlyLoanDeductions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-monthly-loan-deductions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process monthly loan deductions on the 25th of every month';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        // Get all active loans that are due for deduction today
        $loans = Loan::where('is_active', true)
            ->where('remaining_amount', '>', 0)
            ->whereDate('next_deduction_date', '<=', $today)
            ->with('employee')
            ->get();

        if ($loans->isEmpty()) {
            $this->info('No loans due for deduction today.');
            return 0;
        }

        $this->info("Processing {$loans->count()} loan deduction(s)...\n");

        $successCount = 0;
        $totalDeducted = [];

        foreach ($loans as $loan) {
            $employee = $loan->employee;
            $amountBefore = $loan->remaining_amount;

            if ($loan->processMonthlyDeduction()) {
                $deductedAmount = min($loan->monthly_deduction, $amountBefore);

                // Track total by currency
                if (!isset($totalDeducted[$loan->currency])) {
                    $totalDeducted[$loan->currency] = 0;
                }
                $totalDeducted[$loan->currency] += $deductedAmount;

                $this->info(sprintf(
                    "✓ %s: %s %s deducted (Remaining: %s %s)",
                    $employee->name,
                    $loan->currency,
                    number_format($deductedAmount, 2),
                    $loan->currency,
                    number_format($loan->remaining_amount, 2)
                ));

                if (!$loan->is_active) {
                    $this->comment("  → Loan fully paid!");
                }

                $successCount++;
            } else {
                $this->error("✗ Failed to process loan for {$employee->name}");
            }
        }

        $this->info("\n📊 Summary:");
        $this->info("✓ Processed: {$successCount} deductions");

        foreach ($totalDeducted as $currency => $amount) {
            $this->info("💰 Total deducted: {$currency} " . number_format($amount, 2));
        }

        return 0;
    }
}
