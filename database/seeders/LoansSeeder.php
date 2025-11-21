<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Loan;
use App\Models\Employee;
use Carbon\Carbon;

class LoansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $loans = [
            [
                'employee_name' => 'Afaq Ahmad',
                'total_amount' => 378500,
                'currency' => 'PKR',
                'monthly_deduction' => 40000,
                'loan_date' => '2025-08-01',
            ],
            [
                'employee_name' => 'Syed Hassan Fida',
                'total_amount' => 2100,
                'currency' => 'USD',
                'monthly_deduction' => 350,
                'loan_date' => '2025-08-01',
            ],
            [
                'employee_name' => 'Sheheryar Ahmad',
                'total_amount' => 1480,
                'currency' => 'USD',
                'monthly_deduction' => 370,
                'loan_date' => '2025-09-01',
            ],
        ];

        foreach ($loans as $loanData) {
            // Find employee by name
            $employee = Employee::where('name', 'like', '%' . explode(' ', $loanData['employee_name'])[0] . '%')
                ->first();

            if (!$employee) {
                $this->command->warn("Employee not found: {$loanData['employee_name']}");
                continue;
            }

            // Calculate how many months have passed since loan date
            $loanDate = Carbon::parse($loanData['loan_date']);
            $currentDate = Carbon::now();

            // Calculate next deduction date (25th of current month or next month)
            $nextDeductionDate = Carbon::now()->day(25);
            if ($currentDate->day > 25) {
                $nextDeductionDate->addMonth();
            }

            // Calculate remaining amount based on deductions already made
            // Skip the month loan was taken
            $monthsSinceLoan = $loanDate->diffInMonths($currentDate);
            $deductionsMade = max(0, $monthsSinceLoan); // Don't count the month it was taken

            $totalDeducted = $loanData['monthly_deduction'] * $deductionsMade;
            $remainingAmount = max(0, $loanData['total_amount'] - $totalDeducted);

            Loan::create([
                'employee_id' => $employee->id,
                'total_amount' => $loanData['total_amount'],
                'currency' => $loanData['currency'],
                'monthly_deduction' => $loanData['monthly_deduction'],
                'remaining_amount' => $remainingAmount,
                'loan_date' => $loanData['loan_date'],
                'next_deduction_date' => $nextDeductionDate,
                'is_active' => $remainingAmount > 0,
                'notes' => "Initial loan - Backdated to {$loanData['loan_date']}",
            ]);

            $this->command->info("✓ Created loan for {$employee->name}: {$loanData['currency']} {$loanData['total_amount']} (Remaining: {$remainingAmount})");
        }
    }
}
