<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class LoanController extends Controller
{
    public function store(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric|min:1',
            'monthly_deduction' => 'required|numeric|min:1',
            'loan_date' => 'required|date',
            'currency' => 'required|string|in:PKR,USD,EUR,GBP',
        ]);

        // Check if employee already has an active loan
        $activeLoan = Loan::where('employee_id', $employee->id)
            ->where('status', 'active')
            ->first();

        if ($activeLoan) {
            return back()->with('error', 'Employee already has an active loan. Please clear the existing loan first.');
        }

        Loan::create([
            'employee_id' => $employee->id,
            'total_amount' => $validated['total_amount'],
            'monthly_deduction' => $validated['monthly_deduction'],
            'amount_paid' => 0,
            'remaining_amount' => $validated['total_amount'],
            'loan_date' => $validated['loan_date'],
            'currency' => $validated['currency'],
            'status' => 'active',
        ]);

        return back()->with('success', 'Loan created successfully.');
    }

    public function destroy(Loan $loan): RedirectResponse
    {
        $loan->update(['status' => 'completed']);

        return back()->with('success', 'Loan marked as completed.');
    }
}

