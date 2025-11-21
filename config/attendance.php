<?php

return [
    'timezone' => env('ATTENDANCE_TIMEZONE', 'Asia/Karachi'),
    'office_start_time' => env('OFFICE_START_TIME', '11:00'),
    'late_threshold_minutes' => env('LATE_THRESHOLD_MINUTES', 0), // Any check-in after start time is late
];

