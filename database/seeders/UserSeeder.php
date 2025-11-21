<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@3amigos.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        $this->command->info('Admin user ready: admin@3amigos.com');

        // Create users for all employees without users
        $employees = Employee::whereNull('user_id')->get();

        foreach ($employees as $employee) {
            // Generate email from name
            $email = strtolower(str_replace(' ', '.', $employee->name)) . '@3amigos.com';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $employee->name,
                    'password' => Hash::make('password'), // Default password
                ]
            );

            $employee->update(['user_id' => $user->id]);

            $this->command->info("User ready for: {$employee->name} ({$email})");
        }

        $this->command->info('Users created successfully!');
        $this->command->info('Default password for all users: password');
    }
}

