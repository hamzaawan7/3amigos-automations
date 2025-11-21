<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;

// Check unmarked attendance at 11 PM (weekdays only)
Schedule::command('attendance:check-unmarked')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->dailyAt('23:00')
    ->weekdays();

// Check milestones at 11:59 PM (weekdays only)
Schedule::command('milestones:check')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->dailyAt('23:59')
    ->weekdays();

// Yearly leave reset Sept 1 at 00:10
Schedule::command('leave:reset-yearly')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->cron('10 0 1 9 *');
