<?php declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\Repositories\EmployeeRepositoryInterface;
use App\Models\Employee;
use Illuminate\Support\Collection;

final class EloquentEmployeeRepository implements EmployeeRepositoryInterface
{
    public function find(int $id): ?Employee
    {
        return Employee::find($id);
    }

    public function findByName(string $name): ?Employee
    {
        return Employee::where('name', $name)->first();
    }

    /** @return Collection<int,Employee> */
    public function all(): Collection
    {
        return Employee::all();
    }

    public function save(Employee $employee): bool
    {
        return $employee->save();
    }
}
