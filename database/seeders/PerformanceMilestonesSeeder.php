<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PerformanceMilestonesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $milestones = [
            [
                'name' => '60 Day Streak Champion',
                'description' => 'Achieve 60 consecutive working days without absence',
                'type' => 'streak',
                'target_value' => 60,
                'bonus_amount' => 50.00,
                'currency' => 'USD',
                'is_active' => true,
                'icon' => '🔥',
            ],
            [
                'name' => '30 Day Streak',
                'description' => 'Achieve 30 consecutive working days',
                'type' => 'streak',
                'target_value' => 30,
                'bonus_amount' => 25.00,
                'currency' => 'USD',
                'is_active' => true,
                'icon' => '⭐',
            ],
            [
                'name' => '100 Days Worked',
                'description' => 'Complete 100 total working days',
                'type' => 'total_days',
                'target_value' => 100,
                'bonus_amount' => 50.00,
                'currency' => 'USD',
                'is_active' => true,
                'icon' => '💯',
            ],
            [
                'name' => 'Perfect Month',
                'description' => 'Achieve 100% attendance for a full month (20+ days)',
                'type' => 'attendance_rate',
                'target_value' => 100,
                'bonus_amount' => 30.00,
                'currency' => 'USD',
                'is_active' => true,
                'icon' => '🎯',
            ],
        ];

        foreach ($milestones as $milestone) {
            \App\Models\PerformanceMilestone::create($milestone);
        }
    }
}
