<?php declare(strict_types=1);

namespace App\Contracts\Repositories;

use App\Models\Attendance;

interface AttendanceRepositoryInterface
{
    public function findForEmployeeOnDate(int $employeeId, string $date): ?Attendance;
    public function createOrGetForEmployeeOnDate(int $employeeId, string $date): Attendance;
    public function save(Attendance $attendance): bool;
}
