<?php declare(strict_types=1);

namespace App\Contracts\Services;

use App\Models\Employee;

interface LeaveServiceInterface
{
    public function deductOneDay(Employee $employee): bool;
    public function resetYearlyLeave(): int;
}
