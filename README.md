# 3Amigos Automations

Modern SOLID architecture with strict typing, DTOs, and enums.

## Domain Features
- Check-in (no check-out) by name or ID
- Daily absence leave deduction (19:00 configured timezone)
- Yearly leave reset (Sept 1)
- WhatsApp notifications (UltraMsg)

## Technical Architecture
- Strict types: all core PHP files use `declare(strict_types=1);`
- DTOs: `CheckInResult` (with `CheckInStatus` enum) and `DailyAttendanceSummary` replace ad-hoc arrays.
- Repositories: Abstract persistence behind interfaces (`EmployeeRepositoryInterface`, `AttendanceRepositoryInterface`).
- Services: `AttendanceService`, `LeaveService`, `CompositeNotificationService` (multi-channel strategy).
- Dependency Injection: Interface bindings in `AppServiceProvider`.
- Enums: `CheckInStatus` for robust status handling.
- Immutability: DTO properties are readonly; services are final.

## Notification Architecture
- Multi-channel strategy via `CompositeNotificationService`.
- Channels implement `NotificationChannelInterface` (`LogChannel`, `WhatsAppChannel`).
- Add new channel: create class implementing interface, register in provider conditionally.

## Commands
- `attendance:checkin {name}` — name-based check-in.
- `attendance:checkin-id {employee_id}` — ID-based check-in.
- `attendance:process-daily` — process & summarize.
- `leave:reset-yearly` — yearly reset.

## Extendability
Add new notification channel by implementing `NotificationChannelInterface` and including it in composite binding.
Add late arrival policy by introducing a `LatePolicyService` without changing existing services.
Swap persistence (e.g., API / external source) by implementing repository interfaces.

## Configuration
Timezone: `ATTENDANCE_TIMEZONE` (default Asia/Karachi).
WhatsApp: `ULTRAMSG_INSTANCE`, `ULTRAMSG_TOKEN`, `WHATSAPP_GROUP`, `WHATSAPP_ENABLED`.

## Scheduler (cron)
```
* * * * * php /path/to/project/artisan schedule:run >> /dev/null 2>&1
```

## Notes
Tests removed per request; recommended to reintroduce contract tests for future stability.

Legacy commands removed: `leave:autodeduct`, `leave:reset` (replaced by `leave:reset-yearly`).
