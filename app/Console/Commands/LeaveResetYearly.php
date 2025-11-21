<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;

/**
 * Command: leave:reset-yearly
 * Resets yearly leave balances to their quotas.
 */
final class LeaveResetYearly extends Command
{
    protected $signature = 'leave:reset-yearly';
    protected $description = 'Rollover unused leaves and add new annual allocation (14 days) on Sept 1.';

    public function __construct(
        private readonly LeaveServiceInterface $leaveService,
        private readonly NotificationServiceInterface $notifier,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $count = $this->leaveService->resetYearlyLeave();
        $this->notifier->sendMessage('Yearly leave reset completed for '.$count.' employees.');
        $this->info('Yearly leave reset for '.$count.' employees.');
        return Command::SUCCESS;
    }
}
