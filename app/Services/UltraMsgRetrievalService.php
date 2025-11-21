<?php declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

final class UltraMsgRetrievalService
{
    private string $instance;
    private string $token;
    private string $group;

    public function __construct()
    {
        $this->instance = (string) config('whatsapp.instance');
        $this->token = (string) config('whatsapp.token');
        $this->group = (string) config('whatsapp.group');
    }

    /**
     * Get all messages from today in the group
     * @return array<int, array{from: string, body: string, time: string}>
     */
    public function getTodayMessages(): array
    {
        if (!$this->instance || !$this->token) {
            Log::warning('UltraMsg credentials missing');
            return [];
        }

        $url = "https://api.ultramsg.com/{$this->instance}/chats/messages";

        try {
            $response = Http::get($url, [
                'token' => $this->token,
                'chatId' => $this->group,
                'limit' => '50'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!isset($data) || !is_array($data)) {
                    Log::warning('No messages data in response');
                    return [];
                }

                $today = Carbon::now(config('attendance.timezone', 'Asia/Karachi'))->toDateString();
                $todayMessages = [];

                foreach ($data as $msg) {
                    if (!isset($msg['timestamp']) || !isset($msg['body'])) {
                        continue;
                    }

                    // Skip messages sent by the bot itself
                    if (isset($msg['fromMe']) && $msg['fromMe'] === true) {
                        continue;
                    }

                    $msgDate = Carbon::createFromTimestamp($msg['timestamp'])->toDateString();

                    if ($msgDate === $today && !empty($msg['body'])) {
                        $todayMessages[] = [
                            'from' => $msg['from'] ?? 'unknown',
                            'body' => trim($msg['body']),
                            'time' => Carbon::createFromTimestamp($msg['timestamp'])->toTimeString(),
                            'timestamp' => $msg['timestamp']
                        ];
                    }
                }

                // Return in reverse order (newest first)
                $todayMessages = array_reverse($todayMessages);

                Log::info('Retrieved messages', ['count' => count($todayMessages), 'date' => $today]);
                return $todayMessages;
            }

            Log::error('Failed to retrieve messages', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return [];
        } catch (\Throwable $e) {
            Log::error('Exception retrieving messages: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Extract employee names from messages
     * @param array<int, array{from: string, body: string, time: string}> $messages
     * @return array<int, string>
     */
    public function extractEmployeeNames(array $messages): array
    {
        $names = [];

        foreach ($messages as $msg) {
            // Clean and extract name from message body
            $body = trim($msg['body']);

            // Skip empty or very short messages
            if (strlen($body) < 3) {
                continue;
            }

            // If message looks like a name (not too long, alphabetic with spaces)
            if (strlen($body) < 50 && preg_match('/^[a-zA-Z\s]+$/', $body)) {
                $names[] = $body;
            }
        }

        return array_unique($names);
    }

    /**
     * Send check-in notification to WhatsApp group
     */
    public function sendCheckInNotification(string $name, string $time, string $type): bool
    {
        if (!$this->instance || !$this->token || !$this->group) {
            Log::warning('UltraMsg credentials missing for sending notification');
            return false;
        }

        // Determine icon and color based on type
        $icon = '🏢'; // Office building icon (default)
        $dot = '🟢';  // Green dot (default)

        // Check if it's Work From Home
        if (stripos($type, 'Work From Home') !== false || stripos($type, 'WFH') !== false) {
            $icon = '🏠'; // House icon for WFH
            $dot = '🟡';  // Yellow dot for WFH
        }

        // Format: 🟢 🏢 *John* - Office (✅ On Time)
        $message = "{$dot} {$icon} *{$name}*\n_{$type}_";

        $url = "https://api.ultramsg.com/{$this->instance}/messages/chat";

        try {
            $response = Http::asForm()->post($url, [
                'token' => $this->token,
                'to' => $this->group,
                'body' => $message,
            ]);

            if ($response->successful()) {
                Log::info('Check-in notification sent', [
                    'name' => $name,
                    'type' => $type
                ]);
                return true;
            }

            Log::error('Failed to send check-in notification', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return false;
        } catch (\Throwable $e) {
            Log::error('Exception sending check-in notification: ' . $e->getMessage());
            return false;
        }
    }
}

