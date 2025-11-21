<?php declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\Repositories\AttendanceRepositoryInterface;
use App\Models\Attendance;

final class EloquentAttendanceRepository implements AttendanceRepositoryInterface
{
    public function findForEmployeeOnDate(int $employeeId, string $date): ?Attendance
    {
        return Attendance::where('employee_id', $employeeId)->where('date', $date)->first();
    }

    public function createOrGetForEmployeeOnDate(int $employeeId, string $date): Attendance
    {
        return Attendance::firstOrCreate(['employee_id' => $employeeId, 'date' => $date]);
    }

    public function save(Attendance $attendance): bool
    {
        return $attendance->save();
    }
}
