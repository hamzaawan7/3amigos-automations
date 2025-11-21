<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Contracts\Services\NotificationServiceInterface;
use Illuminate\Support\Carbon;

final class SendDailyCheckInPrompt extends Command
{
    protected $signature = 'attendance:send-prompt';
    protected $description = 'Send daily check-in prompt to WhatsApp group';

    public function __construct(private readonly NotificationServiceInterface $notifier)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $date = Carbon::now(config('attendance.timezone', 'Asia/Karachi'))->toDateString();

        $message = "📋 *Daily Attendance - {$date}*\n\n"
            . "Have you checked in today?\n\n"
            . "Please reply with *Y* to confirm your attendance.\n\n"
            . "⏰ Replies will be processed at 11:00 PM";

        $this->notifier->sendMessage($message);
        $this->info('Daily check-in prompt sent to WhatsApp group.');

        return Command::SUCCESS;
    }
}
