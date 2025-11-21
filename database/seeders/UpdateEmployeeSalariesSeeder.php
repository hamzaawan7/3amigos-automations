<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\User;

class UpdateEmployeeSalariesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeData = [
            'm.umairbhatti1999@gmail.com' => ['salary' => 1100, 'name' => 'Muhammad Umair'],
            'hassans.official1@gmail.com' => ['salary' => 750, 'name' => 'Syed Hassan Fida'],
            'muhammadzohaib533@gmail.com' => ['salary' => 750, 'name' => 'Muhammad Zohaib'],
            'umarfarooqshafi2101@gmail.com' => ['salary' => 750, 'name' => 'Muhammad Umar'],
            'ahmadsherri659@gmail.com' => ['salary' => 330, 'name' => 'Afaq Ahmad'],
            'alirehmanarshad@gmail.com' => ['salary' => 500, 'name' => 'Ali Rehman'],
            'talha195javed@gmail.com' => ['salary' => 273, 'name' => 'Talha Javed'],
            'mlkabawan336@gmail.com' => ['salary' => 537, 'name' => 'Hamza Awan'],
        ];

        $lastIncrementDate = '2025-10-01';

        foreach ($employeeData as $email => $data) {
            // Find employee by name
            $employee = Employee::where('name', 'like', '%' . explode(' ', $data['name'])[0] . '%')->first();

            if ($employee) {
                // Update employee
                $employee->update([
                    'salary' => $data['salary'],
                    'currency' => 'USD',
                    'salary_type' => 'Salary',
                    'last_increment_date' => $lastIncrementDate,
                ]);

                // Update user email if exists
                if ($employee->user) {
                    $employee->user->update(['email' => $email]);
                    $this->command->info("Updated: {$employee->name} - Email: {$email}, Salary: \${$data['salary']}");
                }
            } else {
                $this->command->warn("Employee not found for: {$data['name']}");
            }
        }

        $this->command->info('Employee salaries and emails updated successfully!');
    }
}
