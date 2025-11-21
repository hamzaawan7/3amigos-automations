<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\WorkFromHome;
use App\Models\WorkException;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class CheckUnmarkedAttendance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:check-unmarked';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for unmarked attendance, WFH tasks and process leave deductions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now()->toDateString();
        $currentHour = now()->hour;

        // Only run after 6 PM (18:00)
        if ($currentHour < 18) {
            $this->info('⏰ Too early - checks start after 6 PM');
            return 0;
        }

        $employees = Employee::whereNotNull('whatsapp_id')->get();
        $processedCount = 0;

        foreach ($employees as $employee) {
            // Check if attendance was marked today (office)
            $attendance = Attendance::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();

            // Check if WFH was marked today
            $wfh = WorkFromHome::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();

            // Determine if employee is present
            $isPresent = false;
            $attendanceType = '';

            if ($attendance && $attendance->check_in) {
                $isPresent = true;
                $attendanceType = 'Office';
            } elseif ($wfh && $wfh->task_submitted) {
                $isPresent = true;
                $attendanceType = 'WFH (tasks submitted)';
            } elseif ($wfh && !$wfh->task_submitted) {
                // WFH checked in but tasks not submitted - treat as not present
                $isPresent = false;
                $attendanceType = 'WFH (tasks NOT submitted)';
            }

            // If not marked present (office OR WFH with tasks)
            if (!$isPresent) {
                // At 11 PM, create absent record and deduct leave
                if ($currentHour >= 23) {
                    // Check if there's an approved work exception for today
                    $workException = WorkException::where('employee_id', $employee->id)
                        ->where('missed_date', $today)
                        ->where('status', 'approved')
                        ->first();

                    if ($workException) {
                        // Employee has approved exception - no leave deduction
                        $this->info("✓ {$employee->name} - Approved work exception (worked on {$workException->compensate_date->format('Y-m-d')}). No leave deducted.");

                        // Still create absent record for tracking
                        if (!$attendance) {
                            Attendance::create([
                                'employee_id' => $employee->id,
                                'date' => $today,
                                'check_in' => null,
                            ]);
                        }
                        continue; // Skip leave deduction
                    }

                    // If WFH was checked in but tasks not submitted, delete the WFH record
                    if ($wfh && !$wfh->task_submitted) {
                        $wfh->delete();
                        $this->info("  → Deleted incomplete WFH record for {$employee->name}");
                    }

                    // Create absent attendance record if doesn't exist
                    if (!$attendance) {
                        Attendance::create([
                            'employee_id' => $employee->id,
                            'date' => $today,
                            'check_in' => null,
                        ]);
                    }

                    // Deduct leave
                    if ($employee->deductLeave(1)) {
                        $reason = $attendanceType === 'WFH (tasks NOT submitted)'
                            ? "WFH tasks not submitted"
                            : "Absent";
                        $this->warn("✗ {$employee->name} - {$reason}. Leave deducted. Balance: {$employee->leave_balance}");
                        $this->sendLeaveDeductionNotification($employee, $attendanceType === 'WFH (tasks NOT submitted)');
                        $processedCount++;
                    }
                } else {
                    // Before 11 PM, send reminder (only once at 9 PM)
                    if ($currentHour == 21) {
                        $this->sendReminderNotification($employee, $wfh && !$wfh->task_submitted);
                        $this->info("📱 Reminder sent to {$employee->name}");
                    }
                }
            }
        }

        if ($processedCount > 0) {
            $this->info("\n📊 Processed {$processedCount} absent employees");
        }

        return 0;
    }

    private function sendReminderNotification($employee, $isWFHPending = false)
    {
        $instanceId = config('services.ultramsg.instance_id');
        $token = config('services.ultramsg.token');

        if (!$instanceId || !$token) {
            return;
        }

        try {
            $attendanceUrl = config('app.url') . '/attendance';
            $wfhUrl = config('app.url') . '/work-from-home';

            $message = "⏰ *Attendance Reminder*\n\n";
            $message .= "Hi {$employee->name},\n\n";

            if ($isWFHPending) {
                $message .= "You checked in for WFH but haven't submitted your daily tasks yet.\n\n";
                $message .= "⚠️ Please submit your tasks before 11:00 PM to avoid leave deduction.\n\n";
                $message .= "Submit tasks here: {$wfhUrl}\n\n";
            } else {
                $message .= "You haven't marked your attendance yet today.\n\n";
                $message .= "⚠️ Please mark before 11:00 PM to avoid leave deduction.\n\n";
                $message .= "Office: {$attendanceUrl}\n";
                $message .= "WFH: {$wfhUrl}\n\n";
            }

            $message .= "Only 2 hours left! ⏳";

            Http::get("https://api.ultramsg.com/{$instanceId}/messages/chat", [
                'token' => $token,
                'to' => $employee->whatsapp_id,
                'body' => $message,
            ]);
        } catch (\Exception $e) {
            \Log::error("Failed to send reminder: " . $e->getMessage());
        }
    }

    private function sendLeaveDeductionNotification($employee, $isWFHMissed = false)
    {
        $instanceId = config('services.ultramsg.instance_id');
        $token = config('services.ultramsg.token');

        if (!$instanceId || !$token) {
            return;
        }

        try {
            $message = "⚠️ *Leave Deducted*\n\n";
            $message .= "Hi {$employee->name},\n\n";

            if ($isWFHMissed) {
                $message .= "You checked in for Work From Home but did not submit your daily tasks.\n";
            } else {
                $message .= "You did not mark your attendance today.\n";
            }

            $message .= "1 day has been deducted from your leave balance.\n\n";
            $message .= "📊 *Current Leave Balance:* {$employee->leave_balance} days\n";
            $message .= "📅 *Annual Quota:* {$employee->annual_leave_quota} days\n\n";

            if ($isWFHMissed) {
                $message .= "Remember: WFH requires daily task submission before 11 PM.";
            } else {
                $message .= "Please remember to mark your attendance daily.";
            }

            Http::get("https://api.ultramsg.com/{$instanceId}/messages/chat", [
                'token' => $token,
                'to' => $employee->whatsapp_id,
                'body' => $message,
            ]);
        } catch (\Exception $e) {
            \Log::error("Failed to send leave deduction notification: " . $e->getMessage());
        }
    }
}
