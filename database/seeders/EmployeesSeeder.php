<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            ['name' => 'Ali Rehman', 'annual_leave_quota' => 14, 'leave_balance' => 10, 'phone' => '+92 309 7331148', 'whatsapp_id' => '923093331148@c.us'],
            ['name' => 'Sheheryar Ahmad', 'annual_leave_quota' => 14, 'leave_balance' => 13, 'phone' => '+92 308 2152654', 'whatsapp_id' => '923082152654@c.us'],
            ['name' => 'Talha Javed', 'annual_leave_quota' => 14, 'leave_balance' => 12, 'phone' => '+92 323 4657858', 'whatsapp_id' => '923234657858@c.us'],
            ['name' => 'Muhammad Umair', 'annual_leave_quota' => 14, 'leave_balance' => 13, 'phone' => '+92 321 4328875', 'whatsapp_id' => '923214328875@c.us'],
            ['name' => 'Muhammad Zohaib', 'annual_leave_quota' => 14, 'leave_balance' => 10, 'phone' => '+92 308 2152654', 'whatsapp_id' => '923082152654@c.us'],
            ['name' => 'Afaq Ahmad', 'annual_leave_quota' => 14, 'leave_balance' => 11, 'phone' => '+92 305 9903120', 'whatsapp_id' => '923059903120@c.us'],
            ['name' => 'Syed Hassan Fida', 'annual_leave_quota' => 14, 'leave_balance' => 9, 'phone' => '+92 310 2519758', 'whatsapp_id' => '923102519758@c.us'],
            ['name' => 'Muhammad Umar', 'annual_leave_quota' => 14, 'leave_balance' => 13, 'phone' => '+92 322 7176969', 'whatsapp_id' => '923227176969@c.us'],
            ['name' => 'Muhammad Hasnain', 'annual_leave_quota' => 14, 'leave_balance' => 12, 'phone' => '+92 309 5207990', 'whatsapp_id' => '923095207990@c.us'],
            ['name' => 'Hamza Awan', 'annual_leave_quota' => 14, 'leave_balance' => 12, 'phone' => '+92 324 1494612', 'whatsapp_id' => '923241494612@c.us']
        ]
        ;

        foreach ($employees as $emp) {
            Employee::create($emp);
        }
    }
}
