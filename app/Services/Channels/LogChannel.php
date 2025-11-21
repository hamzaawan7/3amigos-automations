<?php declare(strict_types=1);

namespace App\Services\Channels;

use App\Contracts\Services\NotificationChannelInterface;
use Illuminate\Support\Facades\Log;

final class LogChannel implements NotificationChannelInterface
{
    public function send(string $message): bool
    {
        Log::info('[LOG CHANNEL] '.$message);
        return true;
    }

    public function name(): string
    {
        return 'log';
    }
}

