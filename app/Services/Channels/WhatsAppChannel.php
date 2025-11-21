<?php declare(strict_types=1);

namespace App\Services\Channels;

use App\Contracts\Services\NotificationChannelInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class WhatsAppChannel implements NotificationChannelInterface
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

    public function send(string $message): bool
    {
        return $this->postMessage($this->group, $message);
    }

    public function name(): string
    {
        return 'whatsapp';
    }

    private function postMessage(?string $to, string $message): bool
    {
        if (app()->environment('testing')) {
            Log::info('[WhatsApp MOCK to '.$to.'] '.$message);
            return true;
        }

        if (!$this->instance || !$this->token || !$to) {
            Log::warning('WhatsAppChannel missing instance/token/group');
            return false;
        }

        $url = "https://api.ultramsg.com/{$this->instance}/messages/chat";
        try {
            $response = Http::asForm()->post($url, [
                'token' => $this->token,
                'to' => $to,
                'body' => $message,
            ]);
            if ($response->failed()) {
                Log::error('WhatsApp send failed', [
                    'to' => $to,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            Log::error('WhatsApp exception: '.$e->getMessage(), ['to' => $to]);
            return false;
        }
    }
}
