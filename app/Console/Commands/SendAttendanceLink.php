<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use Illuminate\Support\Facades\Http;

class SendAttendanceLink extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:send-link';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send attendance link to all employees via WhatsApp';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $instanceId = config('services.ultramsg.instance_id');
        $token = config('services.ultramsg.token');
        $attendanceUrl = config('app.url') . '/attendance';

        if (!$instanceId || !$token) {
            $this->error('UltraMsg credentials not configured');
            return 1;
        }

        $employees = Employee::whereNotNull('whatsapp_id')->get();

        if ($employees->isEmpty()) {
            $this->warn('No employees with WhatsApp ID found');
            return 0;
        }

        $message = "🕐 *Time to Mark Your Attendance!*\n\n";
        $message .= "Good morning! Please mark your attendance for today.\n\n";
        $message .= "Click the link below to mark yourself present:\n";
        $message .= "👉 {$attendanceUrl}\n\n";
        $message .= "⚠️ *Important:* Please mark before 11:00 PM to avoid leave deduction.\n\n";
        $message .= "Thank you! 🙏";

        $successCount = 0;
        $failCount = 0;

        foreach ($employees as $employee) {
            try {
                $response = Http::get("https://api.ultramsg.com/{$instanceId}/messages/chat", [
                    'token' => $token,
                    'to' => $employee->whatsapp_id,
                    'body' => $message,
                ]);

                if ($response->successful()) {
                    $successCount++;
                    $this->info("✓ Sent to {$employee->name} ({$employee->whatsapp_id})");
                } else {
                    $failCount++;
                    $this->error("✗ Failed to send to {$employee->name}: " . $response->body());
                }
            } catch (\Exception $e) {
                $failCount++;
                $this->error("✗ Error sending to {$employee->name}: " . $e->getMessage());
            }

            sleep(1); // Rate limiting
        }

        $this->info("\n📊 Summary:");
        $this->info("✓ Successfully sent: {$successCount}");
        if ($failCount > 0) {
            $this->warn("✗ Failed: {$failCount}");
        }

        return 0;
    }
}
