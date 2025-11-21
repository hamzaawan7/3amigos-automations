<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;

Artisan::command('inspire', function (): void {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('leave:reset-yearly', function (LeaveServiceInterface $leaveService, NotificationServiceInterface $notifier): int {
    $count = $leaveService->resetYearlyLeave();
    $notifier->sendMessage('Yearly leave reset completed for '.$count.' employees.');
    $this->info('Yearly leave reset for '.$count.' employees.');
    return 0;
})->purpose('Reset yearly leave balances on Sept 1.');

// Send daily check-in prompt at 11 AM
Schedule::command('attendance:send-prompt')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->dailyAt('11:00');

// Process replies and deduct leave at 11 PM
Schedule::command('attendance:process-replies')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->dailyAt('23:00');

// Send weekly leave summary on Monday at 9 AM
Schedule::command('attendance:weekly-summary')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->weeklyOn(1, '09:00');

// Yearly leave reset Sept 1 at 00:10
Schedule::command('leave:reset-yearly')
    ->timezone(config('attendance.timezone', 'Asia/Karachi'))
    ->cron('10 0 1 9 *');
