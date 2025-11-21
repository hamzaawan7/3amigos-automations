<?php declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Contracts\Repositories\EmployeeRepositoryInterface;

final class SyncWhatsAppContacts extends Command
{
    protected $signature = 'whatsapp:sync-contacts {--dry-run : Preview without saving}';
    protected $description = 'Sync WhatsApp contact IDs with employees based on phone numbers';

    public function __construct(private readonly EmployeeRepositoryInterface $employees)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $instance = config('whatsapp.instance');
        $token = config('whatsapp.token');
        $group = config('whatsapp.group');

        if (!$instance || !$token || !$group) {
            $this->error('WhatsApp credentials missing');
            return Command::FAILURE;
        }

        $this->info('Fetching group participants...');

        // Get group metadata to fetch participants
        $url = "https://api.ultramsg.com/{$instance}/chats";

        try {
            $response = Http::get($url, [
                'token' => $token,
            ]);

            if (!$response->successful()) {
                $this->error('Failed to fetch chats');
                Log::error('Failed to fetch chats', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return Command::FAILURE;
            }

            $chats = $response->json();
            $targetGroup = null;

            // Find our group
            foreach ($chats as $chat) {
                if (isset($chat['id']) && $chat['id'] === $group) {
                    $targetGroup = $chat;
                    break;
                }
            }

            if (!$targetGroup) {
                $this->error('Target group not found');
                return Command::FAILURE;
            }

            if (!isset($targetGroup['groupMetadata']['participants'])) {
                $this->warn('No participants found in group metadata');
                return Command::SUCCESS;
            }

            $participants = $targetGroup['groupMetadata']['participants'];
            $this->line('Found ' . count($participants) . ' participants in group');

            $matched = 0;
            $notMatched = 0;
            $updated = 0;

            foreach ($this->employees->all() as $employee) {
                if (!$employee->phone) {
                    $this->warn("⚠ {$employee->name}: No phone number");
                    $notMatched++;
                    continue;
                }

                // Normalize employee phone
                $normalizedPhone = preg_replace('/[^\d]/', '', $employee->phone);

                $whatsappId = null;

                // Try to find matching participant
                foreach ($participants as $participant) {
                    if (!isset($participant['id'])) {
                        continue;
                    }

                    // Extract phone from WhatsApp ID (e.g., "923241494612@c.us")
                    $participantPhone = preg_replace('/[^\d]/', '', $participant['id']);

                    // Match last 10 digits
                    if (strlen($normalizedPhone) >= 10 && strlen($participantPhone) >= 10) {
                        $empLast10 = substr($normalizedPhone, -10);
                        $partLast10 = substr($participantPhone, -10);

                        if ($empLast10 === $partLast10) {
                            $whatsappId = $participant['id'];
                            break;
                        }
                    }
                }

                if ($whatsappId) {
                    if ($this->option('dry-run')) {
                        $this->info("✓ {$employee->name} ({$employee->phone}) → {$whatsappId}");
                    } else {
                        $employee->whatsapp_id = $whatsappId;
                        $employee->save();
                        $this->info("✓ {$employee->name}: Synced → {$whatsappId}");
                        $updated++;
                    }
                    $matched++;
                } else {
                    $this->warn("✗ {$employee->name} ({$employee->phone}): Not found in group");
                    $notMatched++;
                }
            }

            $this->newLine();
            $this->info("Summary:");
            $this->line("Matched: {$matched}");
            $this->line("Not Matched: {$notMatched}");

            if (!$this->option('dry-run')) {
                $this->line("Updated: {$updated}");
            } else {
                $this->warn("DRY RUN - No changes saved");
            }

            return Command::SUCCESS;

        } catch (\Throwable $e) {
            $this->error('Exception: ' . $e->getMessage());
            Log::error('Exception in sync contacts: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

