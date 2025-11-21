<?php

namespace App\Http\Controllers;

use App\Models\WorkException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkExceptionController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return redirect()->route('dashboard')
                ->with('error', 'No employee record found.');
        }

        $employee = $user->employee;

        // Get employee's work exceptions
        $exceptions = WorkException::where('employee_id', $employee->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'missed_date' => $e->missed_date->format('Y-m-d'),
                'compensate_date' => $e->compensate_date->format('Y-m-d'),
                'status' => $e->status,
                'reason' => $e->reason,
                'work_description' => $e->work_description,
                'created_at' => $e->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('WorkException/Index', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
            ],
            'exceptions' => $exceptions,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user()->load('employee');

        if (!$user->employee) {
            return back()->with('error', 'No employee record found.');
        }

        $validated = $request->validate([
            'missed_date' => 'required|date|before_or_equal:today',
            'compensate_date' => 'required|date',
            'reason' => 'required|string|min:20',
            'work_description' => 'required|string|min:50',
        ]);

        $employee = $user->employee;

        // Check if exception already exists for this missed date
        $existing = WorkException::where('employee_id', $employee->id)
            ->where('missed_date', $validated['missed_date'])
            ->exists();

        if ($existing) {
            return back()->with('error', 'Work exception already exists for this date.');
        }

        // Check if compensate date has attendance
        $compensateAttendance = \App\Models\Attendance::where('employee_id', $employee->id)
            ->where('date', $validated['compensate_date'])
            ->whereNotNull('check_in')
            ->exists();

        if (!$compensateAttendance) {
            return back()->with('error', 'You must have marked attendance on the compensation date.');
        }

        WorkException::create([
            'employee_id' => $employee->id,
            'missed_date' => $validated['missed_date'],
            'compensate_date' => $validated['compensate_date'],
            'reason' => $validated['reason'],
            'work_description' => $validated['work_description'],
            'status' => 'pending',
        ]);

        return redirect()->route('work-exception.index')
            ->with('success', 'Work exception request submitted successfully!');
    }

    // Admin methods
    public function adminIndex()
    {
        $user = Auth::user();

        if (!$user->is_admin) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied.');
        }

        $exceptions = WorkException::with(['employee', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'employee_name' => $e->employee->name,
                'missed_date' => $e->missed_date->format('Y-m-d'),
                'compensate_date' => $e->compensate_date->format('Y-m-d'),
                'status' => $e->status,
                'reason' => $e->reason,
                'work_description' => $e->work_description,
                'approver_name' => $e->approver?->name,
                'approved_at' => $e->approved_at?->format('Y-m-d H:i'),
                'created_at' => $e->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Admin/WorkExceptions/Index', [
            'exceptions' => $exceptions,
        ]);
    }

    public function approve(WorkException $workException)
    {
        $user = Auth::user();

        if (!$user->is_admin) {
            return back()->with('error', 'Access denied.');
        }

        $workException->approve($user);

        return back()->with('success', 'Work exception approved successfully!');
    }

    public function reject(WorkException $workException)
    {
        $user = Auth::user();

        if (!$user->is_admin) {
            return back()->with('error', 'Access denied.');
        }

        $workException->reject($user);

        return back()->with('success', 'Work exception rejected.');
    }
}

