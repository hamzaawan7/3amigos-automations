#!/bin/bash

# Laravel Scheduler Setup Script
# This script sets up the cron job for Laravel's task scheduler

echo "Setting up Laravel Scheduler on production server..."

# Add Laravel scheduler to crontab
(crontab -l 2>/dev/null; echo "* * * * * cd /home/g0mbqxoz5uaj/public_html/portal && /usr/bin/php artisan schedule:run >> /dev/null 2>&1") | crontab -

echo "Cron job added successfully!"
echo ""
echo "The following cron job has been configured:"
echo "* * * * * cd /home/g0mbqxoz5uaj/public_html/portal && /usr/bin/php artisan schedule:run >> /dev/null 2>&1"
echo ""
echo "This will run every minute and Laravel will handle the scheduling internally."
echo ""
echo "To verify, run: crontab -l"

