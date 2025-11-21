<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        $quota = 14;
        return [
            'name' => $this->faker->name(),
            'annual_leave_quota' => $quota,
            'leave_balance' => $quota,
        ];
    }
}

