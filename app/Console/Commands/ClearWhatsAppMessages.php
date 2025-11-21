<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class ClearWhatsAppMessages extends Command
{
    protected $signature = 'whatsapp:clear-messages {--dry-run : Preview messages without deleting}';
    protected $description = 'Delete all messages from the WhatsApp group chat';

    public function handle(): int
    {
        $instance = config('whatsapp.instance');
        $token = config('whatsapp.token');
        $group = config('whatsapp.group');

        if (!$instance || !$token || !$group) {
            $this->error('WhatsApp credentials missing in config');
            return Command::FAILURE;
        }

        if ($this->option('dry-run')) {
            $this->warn('DRY RUN - Chat messages will NOT be deleted');
            $this->line("Would delete all messages from chat: {$group}");
            return Command::SUCCESS;
        }

        if (!$this->confirm('Are you sure you want to delete all messages from this chat?')) {
            $this->info('Cancelled.');
            return Command::SUCCESS;
        }

        $this->info('Clearing chat messages...');

        // Use the correct UltraMsg endpoint for clearing chat messages
        $url = "https://api.ultramsg.com/{$instance}/chats/clearMessages";

        try {
            $response = Http::asForm()->post($url, [
                'token' => $token,
                'chatId' => $group,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $this->info('Chat messages deleted successfully!');
                Log::info('Chat cleared', ['response' => $data]);
                return Command::SUCCESS;
            }

            $this->error('Failed to delete chat messages');
            Log::error('Failed to delete chat', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return Command::FAILURE;

        } catch (\Throwable $e) {
            $this->error('Exception: ' . $e->getMessage());
            Log::error('Exception in clear messages: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

