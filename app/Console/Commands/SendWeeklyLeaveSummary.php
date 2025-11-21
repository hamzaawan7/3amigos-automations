<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Contracts\Repositories\EmployeeRepositoryInterface;
use App\Contracts\Services\NotificationServiceInterface;

final class SendWeeklyLeaveSummary extends Command
{
    protected $signature = 'attendance:weekly-summary';
    protected $description = 'Send weekly leave balance summary';

    public function __construct(
        private readonly EmployeeRepositoryInterface $employees,
        private readonly NotificationServiceInterface $notifier
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Generating weekly leave summary...');

        $message = "📋 *Weekly Leave Balance Summary*\n\n";

        foreach ($this->employees->all() as $employee) {
            $emoji = $employee->leave_balance > 5 ? '🟢' : ($employee->leave_balance > 2 ? '🟡' : '🔴');
            $message .= "{$emoji} {$employee->name}: {$employee->leave_balance} days\n";
        }

        $message .= "\n_Updated: " . now()->format('Y-m-d H:i') . "_";

        $this->notifier->sendMessage($message);
        $this->info('Weekly summary sent to WhatsApp group.');

        return Command::SUCCESS;
    }
}

