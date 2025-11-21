<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Contracts\Repositories\EmployeeRepositoryInterface;
use App\Contracts\Repositories\AttendanceRepositoryInterface;
use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\Services\UltraMsgRetrievalService;
use Illuminate\Support\Carbon;

final class ProcessDailyReplies extends Command
{
    protected $signature = 'attendance:process-replies';
    protected $description = 'Process WhatsApp replies and deduct leave for non-responders';

    public function __construct(
        private readonly EmployeeRepositoryInterface $employees,
        private readonly AttendanceRepositoryInterface $attendances,
        private readonly LeaveServiceInterface $leaveService,
        private readonly NotificationServiceInterface $notifier,
        private readonly UltraMsgRetrievalService $msgRetrieval
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $date = Carbon::now(config('attendance.timezone', 'Asia/Karachi'))->toDateString();
        $this->info("Processing replies for {$date}...");

        // Get all messages from today
        $messages = $this->msgRetrieval->getTodayMessages();

        $this->line('Found ' . count($messages) . ' messages from today');

        // Extract phone numbers of people who replied with "Y"
        $repliedWhatsAppIds = [];
        foreach ($messages as $msg) {
            $body = strtoupper(trim($msg['body']));
            // Check if message is just "Y" or starts with "Y"
            if ($body === 'Y' || preg_match('/^Y\s*$/i', $msg['body'])) {
                $repliedWhatsAppIds[] = $msg['from'];
                $this->line("Y reply from: {$msg['from']}");
            }
        }

        $this->line('Found ' . count($repliedWhatsAppIds) . ' people who replied with Y');

        $present = [];
        $absent = [];
        $deducted = [];

        foreach ($this->employees->all() as $employee) {
            // Check if employee's WhatsApp ID is in the replied list
            $replied = false;

            if ($employee->whatsapp_id && in_array($employee->whatsapp_id, $repliedWhatsAppIds)) {
                $replied = true;
            }
            // Fallback: try phone number matching if whatsapp_id not set
            elseif ($employee->phone && !$employee->whatsapp_id) {
                // Normalize employee phone (remove + and whitespace)
                $normalizedEmployeePhone = preg_replace('/[^\d]/', '', $employee->phone);

                // Check if this employee's phone replied with Y
                foreach ($repliedWhatsAppIds as $repliedId) {
                    // Extract phone from WhatsApp ID (e.g., "923241494612@c.us")
                    $repliedPhone = preg_replace('/[^\d]/', '', $repliedId);

                    // Match if phones end with the same digits (last 10 digits)
                    if (strlen($normalizedEmployeePhone) >= 10 && strlen($repliedPhone) >= 10) {
                        $empLast10 = substr($normalizedEmployeePhone, -10);
                        $repliedLast10 = substr($repliedPhone, -10);
                        if ($empLast10 === $repliedLast10) {
                            $replied = true;
                            break;
                        }
                    } elseif ($normalizedEmployeePhone === $repliedPhone) {
                        $replied = true;
                        break;
                    }
                }
            }

            if ($replied) {
                // Mark attendance
                $attendance = $this->attendances->findForEmployeeOnDate($employee->id, $date);
                if (!$attendance) {
                    $attendance = $this->attendances->createOrGetForEmployeeOnDate($employee->id, $date);
                }
                if (!$attendance->check_in) {
                    $attendance->check_in = Carbon::now(config('attendance.timezone', 'Asia/Karachi'))->toTimeString();
                    $this->attendances->save($attendance);
                }
                $present[] = $employee->name;
                $this->info("✓ {$employee->name} ({$employee->phone}) - Present");
            } else {
                // Deduct leave - no Y reply found for this employee
                $absent[] = $employee->name;
                if ($this->leaveService->deductOneDay($employee)) {
                    $deducted[] = $employee->name;
                    $this->warn("✗ {$employee->name} ({$employee->phone}) - Absent, leave deducted. Remaining: {$employee->leave_balance}");
                } else {
                    $this->error("✗ {$employee->name} ({$employee->phone}) - Absent, no leave balance");
                }
            }
        }

        // Send summary
        $summary = "📊 *Daily Attendance Summary - {$date}*\n\n"
            . "✅ Present (" . count($present) . "): " . (count($present) ? implode(', ', $present) : '-') . "\n"
            . "❌ Absent (" . count($absent) . "): " . (count($absent) ? implode(', ', $absent) : '-') . "\n"
            . "➖ Leave Deducted (" . count($deducted) . "): " . (count($deducted) ? implode(', ', $deducted) : '-');

        $this->notifier->sendMessage($summary);
        $this->newLine();
        $this->info('Summary sent to WhatsApp group.');

        return Command::SUCCESS;
    }
}
