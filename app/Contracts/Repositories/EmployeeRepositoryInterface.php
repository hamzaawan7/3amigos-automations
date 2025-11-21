<?php declare(strict_types=1);

namespace App\Contracts\Repositories;

use App\Models\Employee;
use Illuminate\Support\Collection;

interface EmployeeRepositoryInterface
{
    public function find(int $id): ?Employee;
    public function findByName(string $name): ?Employee;
    /** @return Collection<int,Employee> */
    public function all(): Collection;
    public function save(Employee $employee): bool;
}
