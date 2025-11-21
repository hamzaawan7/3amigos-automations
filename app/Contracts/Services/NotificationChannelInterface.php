<?php declare(strict_types=1);

namespace App\Contracts\Services;

interface NotificationChannelInterface
{
    public function send(string $message): bool;
    public function name(): string;
}

