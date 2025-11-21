<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user()->load('employee');

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'employee' => $user->employee ? [
                'id' => $user->employee->id,
                'name' => $user->employee->name,
                'phone' => $user->employee->phone,
                'salary' => $user->employee->salary,
                'currency' => $user->employee->currency,
                'salary_type' => $user->employee->salary_type,
                'last_increment_date' => $user->employee->last_increment_date?->format('Y-m-d'),
                'kpi_score' => $user->employee->kpi_score,
                'annual_leave_quota' => $user->employee->annual_leave_quota,
                'leave_balance' => $user->employee->leave_balance,
                'active_loan' => $user->employee->activeLoan ? [
                    'total_amount' => $user->employee->activeLoan->total_amount,
                    'currency' => $user->employee->activeLoan->currency,
                    'monthly_deduction' => $user->employee->activeLoan->monthly_deduction,
                    'remaining_amount' => $user->employee->activeLoan->remaining_amount,
                    'loan_date' => $user->employee->activeLoan->loan_date->format('Y-m-d'),
                    'next_deduction_date' => $user->employee->activeLoan->next_deduction_date->format('Y-m-d'),
                    'progress_percentage' => $user->employee->activeLoan->progress_percentage,
                    'amount_paid' => $user->employee->activeLoan->amount_paid,
                ] : null,
            ] : null,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'current_password' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update user
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Update password if provided
        if ($request->filled('password')) {
            if (!$request->filled('current_password') || !Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update employee if exists
        if ($user->employee) {
            $user->employee->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'] ?? $user->employee->phone,
            ]);
        }

        return redirect()->route('profile.edit')->with('success', 'Profile updated successfully!');
    }
}
