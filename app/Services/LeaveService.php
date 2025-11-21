<?php declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Repositories\EmployeeRepositoryInterface;
use App\Models\Employee;

final class LeaveService implements LeaveServiceInterface
{
    public function __construct(private readonly EmployeeRepositoryInterface $employees) {}

    public function deductOneDay(Employee $employee): bool
    {
        if ($employee->leave_balance <= 0) {
            return false;
        }
        $employee->leave_balance = max(0, $employee->leave_balance - 1);
        $this->employees->save($employee);
        return true;
    }

    public function resetYearlyLeave(): int
    {
        $count = 0;
        foreach ($this->employees->all() as $employee) {
            // Rollover: Keep existing unused leave balance and add new annual quota (14 days)
            $currentBalance = $employee->leave_balance;
            $newAllocation = $employee->annual_leave_quota; // Default: 14 days

            // New balance = rollover + new allocation
            $employee->leave_balance = $currentBalance + $newAllocation;

            $this->employees->save($employee);
            $count++;
        }
        return $count;
    }
}
