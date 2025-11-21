<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Daily processing at 7 PM Pakistan time
        $schedule->command('attendance:process-daily')
            ->timezone('Asia/Karachi')
            ->dailyAt('19:00');

        // Yearly leave reset Sept 1 at 00:10 Pakistan time
        $schedule->command('leave:reset-yearly')
            ->timezone('Asia/Karachi')
            ->cron('10 0 1 9 *');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
    }
}
