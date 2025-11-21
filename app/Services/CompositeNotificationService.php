<?php declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\NotificationServiceInterface;
use App\Contracts\Services\NotificationChannelInterface;

final class CompositeNotificationService implements NotificationServiceInterface
{
    /** @var NotificationChannelInterface[] */
    private array $channels;

    /** @param NotificationChannelInterface[] $channels */
    public function __construct(array $channels)
    {
        $this->channels = $channels;
    }

    public function sendMessage(string $message): bool
    {
        $anySuccess = false;
        foreach ($this->channels as $channel) {
            $sent = $channel->send($message);
            $anySuccess = $anySuccess || $sent;
        }
        return $anySuccess;
    }
}

