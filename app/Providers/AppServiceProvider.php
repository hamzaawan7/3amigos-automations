<?php declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\Repositories\EmployeeRepositoryInterface;
use App\Contracts\Repositories\AttendanceRepositoryInterface;
use App\Repositories\EloquentEmployeeRepository;
use App\Repositories\EloquentAttendanceRepository;
use App\Contracts\Services\AttendanceServiceInterface;
use App\Contracts\Services\LeaveServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\Services\AttendanceService;
use App\Services\LeaveService;
use App\Services\CompositeNotificationService;
use App\Services\Channels\LogChannel;
use App\Services\Channels\WhatsAppChannel;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(EmployeeRepositoryInterface::class, EloquentEmployeeRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, EloquentAttendanceRepository::class);
        $this->app->bind(LeaveServiceInterface::class, LeaveService::class);
        $this->app->bind(AttendanceServiceInterface::class, AttendanceService::class);

        // Composite notification service binding
        $this->app->singleton(NotificationServiceInterface::class, function ($app) {
            $channels = [ $app->make(LogChannel::class) ]; // always include log
            if (config('whatsapp.enabled')) {
                $channels[] = $app->make(WhatsAppChannel::class);
            }
            return new CompositeNotificationService($channels);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
