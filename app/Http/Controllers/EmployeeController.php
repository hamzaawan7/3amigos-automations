<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // If not admin, redirect to their own dashboard
        if (!$user->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view all employees.');
        }

        $employees = Employee::with('user', 'attendances')
            ->get()
            ->map(function($employee) {
                $todayAttendance = $employee->attendances()
                    ->where('date', now()->toDateString())
                    ->first();

                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->user?->email,
                    'phone' => $employee->phone,
                    'leave_balance' => $employee->leave_balance,
                    'annual_leave_quota' => $employee->annual_leave_quota,
                    'salary' => $employee->salary,
                    'currency' => $employee->currency,
                    'kpi_score' => $employee->kpi_score,
                    'today_status' => $todayAttendance?->check_in ? 'Present' : 'Absent',
                    'today_check_in' => $todayAttendance?->check_in,
                ];
            });

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
        ]);
    }

    public function create(): Response
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to create employees.');
        }

        return Inertia::render('Admin/Employees/Create');
    }

    public function store(Request $request)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to create employees.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:20',
            'start_time' => 'nullable|date_format:H:i:s,H:i',
            'annual_leave_quota' => 'required|integer|min:0',
        ]);

        // Ensure start_time has seconds format for database
        $startTime = $validated['start_time'] ?? '12:00:00';
        if (strlen($startTime) === 5) {
            $startTime = $startTime . ':00';
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Employee::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'start_time' => $startTime,
            'annual_leave_quota' => $validated['annual_leave_quota'],
            'leave_balance' => $validated['annual_leave_quota'],
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee): Response
    {
        $user = Auth::user();

        // If not admin, can only view their own record
        if (!$user->is_admin && $user->employee?->id !== $employee->id) {
            return redirect()->route('dashboard')
                ->with('error', 'You can only view your own information.');
        }

        $attendances = $employee->attendances()
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'date' => $a->date,
                'check_in' => $a->check_in,
                'is_late' => $a->is_late,
                'late_by_minutes' => $a->late_by_minutes,
                'is_wfh' => $a->is_wfh,
                'task_submitted' => $a->task_submitted,
                'daily_tasks' => $a->daily_tasks,
                'status' => $a->status,
                'type' => $a->type,
            ]);

        return Inertia::render('Admin/Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->user?->email,
                'phone' => $employee->phone,
                'whatsapp_id' => $employee->whatsapp_id,
                'start_time' => $employee->start_time,
                'leave_balance' => $employee->leave_balance,
                'annual_leave_quota' => $employee->annual_leave_quota,
                'current_streak' => $employee->current_streak,
                'longest_streak' => $employee->longest_streak,
            ],
            'attendances' => $attendances,
            'canManageAttendance' => $user->is_admin,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to edit employees.');
        }

        $activeLoan = $employee->activeLoan;

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'phone' => $employee->phone,
                'start_time' => $employee->start_time,
                'annual_leave_quota' => $employee->annual_leave_quota,
                'leave_balance' => $employee->leave_balance,
                'salary' => $employee->salary,
                'currency' => $employee->currency,
                'salary_type' => $employee->salary_type,
                'last_increment_date' => $employee->last_increment_date?->format('Y-m-d'),
                'kpi_score' => $employee->kpi_score,
            ],
            'activeLoan' => $activeLoan ? [
                'id' => $activeLoan->id,
                'total_amount' => $activeLoan->total_amount,
                'currency' => $activeLoan->currency,
                'monthly_deduction' => $activeLoan->monthly_deduction,
                'remaining_amount' => $activeLoan->remaining_amount,
                'loan_date' => $activeLoan->loan_date->format('Y-m-d'),
                'next_deduction_date' => $activeLoan->next_deduction_date->format('Y-m-d'),
                'progress_percentage' => $activeLoan->progress_percentage,
                'amount_paid' => $activeLoan->amount_paid,
            ] : null,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to edit employees.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'start_time' => 'required|date_format:H:i:s,H:i',
            'annual_leave_quota' => 'required|integer|min:0',
            'leave_balance' => 'required|numeric|min:0',
            'salary' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'salary_type' => 'nullable|string|max:50',
            'last_increment_date' => 'nullable|date',
            'kpi_score' => 'nullable|numeric|min:0|max:100',
        ]);

        // Ensure start_time has seconds format for database
        if (isset($validated['start_time']) && strlen($validated['start_time']) === 5) {
            $validated['start_time'] = $validated['start_time'] . ':00';
        }

        $employee->update($validated);

        if ($employee->user) {
            $employee->user->update(['name' => $validated['name']]);
        }

        return redirect()->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        if (!Auth::user()->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to delete employees.');
        }

        if ($employee->user) {
            $employee->user->delete(); // Cascade will delete employee
        } else {
            $employee->delete();
        }

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}

