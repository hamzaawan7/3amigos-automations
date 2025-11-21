<?php declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\WorkFromHome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

final class AttendanceManagementController extends Controller
{
    /**
     * Mark an employee as late for a specific date
     */
    public function markAsLate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'late_by_minutes' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $employee = Employee::findOrFail($request->employee_id);
        $date = Carbon::parse($request->date)->toDateString();

        // Find attendance record
        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $date)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'No attendance record found for this date.');
        }

        $wasOnTime = !$attendance->is_late;

        $attendance->update([
            'is_late' => true,
            'late_by_minutes' => $request->late_by_minutes,
        ]);

        // Break streak if employee was previously on time
        if ($wasOnTime) {
            $employee->breakStreak();
        }

        return back()->with('success', "Employee marked as late ({$request->late_by_minutes} minutes) for {$date}.");
    }

    /**
     * Correct a late marking (mark as on-time)
     */
    public function markAsOnTime(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $employee = Employee::findOrFail($request->employee_id);
        $date = Carbon::parse($request->date)->toDateString();

        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $date)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'No attendance record found for this date.');
        }

        $attendance->update([
            'is_late' => false,
            'late_by_minutes' => 0,
        ]);

        return back()->with('success', "Employee marked as on-time for {$date}.");
    }
}

