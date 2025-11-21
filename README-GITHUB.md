# 3Amigos Attendance System 🚀

A comprehensive **Laravel + React + Inertia.js** attendance management system with WhatsApp integration, built for modern workplace attendance tracking.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-purple.svg)](https://inertiajs.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 🎯 Core Functionality
- ✅ **Unified Attendance System**: Single system for both Office & Work From Home
- ✅ **Check-In Window**: 11:00 AM - 11:00 PM daily
- ✅ **Late Arrival Tracking**: Automatic detection with minute-level precision
- ✅ **Individual Start Times**: Custom office start time per employee
- ✅ **Leave Management**: Automatic leave deduction & rollover system
- ✅ **WhatsApp Integration**: Real-time notifications via UltraMsg API

### 🏆 Gamification & Rewards
- 🔥 **Attendance Streaks**: Track consecutive on-time days
- 🎖️ **Performance Milestones**: 7, 14, 30-day achievements
- 💰 **Automatic Rewards**: Bonus calculation for milestone completion
- 📊 **Real-time Stats**: Dashboard with comprehensive metrics

### 🏠 Work From Home
- 📝 **Daily Task Submission**: Mandatory 200+ character reports
- ⏰ **Time-gated Submission**: Opens after 6:00 PM
- ✅ **Completion Tracking**: Task submitted vs pending status
- 🚨 **Automatic Enforcement**: Leave deducted if tasks not submitted

### 👨‍💼 Admin Features
- 📊 **Complete Dashboard**: Overview of all employees
- 👥 **Employee Management**: CRUD operations with detailed profiles
- ⚠️ **Manual Adjustments**: Mark employees late or on-time
- 🎯 **Milestone Configuration**: Create custom achievement goals
- 💳 **Reward Management**: Track and mark bonuses as paid

---

## 📥 Installation

### Prerequisites
- PHP 8.2+
- Composer 2.x
- Node.js 18+ & NPM
- MySQL 8.0+

### Quick Start
```bash
# Clone repository
git clone https://github.com/hamzaawan7/3amigos-automations.git
cd 3amigos-automations

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed

# Build frontend
npm run build

# Start server
php artisan serve
```

Visit: `http://localhost:8000`

---

## ⚙️ Configuration

### WhatsApp (UltraMsg)
```env
ULTRAMSG_INSTANCE_ID=your_instance
ULTRAMSG_TOKEN=your_token
WHATSAPP_ATTENDANCE_GROUP=group_id@g.us
```

### Scheduler
Add to crontab:
```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🎮 Default Login

**Admin:**
- Email: `admin@3amigos.com`
- Password: `password`

---

## 📚 Documentation

- **[Employee SOP](SOP-EMPLOYEE-ATTENDANCE-SYSTEM.md)** - Complete guide
- **[Admin SOP](SOP-ADMIN-ATTENDANCE-SYSTEM.md)** - Admin procedures
- **[Quick Reference](QUICK-REFERENCE-ATTENDANCE.md)** - Printable guide
- **[Leave Rollover](LEAVE-ROLLOVER-IMPLEMENTATION.md)** - Rollover details

In-app help: `/help`

---

## 🤖 Key Commands

```bash
# Daily processing (11 PM)
php artisan attendance:process-daily

# Yearly reset (Sept 1)
php artisan leave:reset-yearly

# Weekly summary
php artisan leave:send-weekly-summary
```

---

## 🛠️ Tech Stack

- Laravel 12.x
- React 18.x
- Inertia.js 2.x
- Tailwind CSS 3.x
- MySQL 8.0+
- UltraMsg API

---

## 📞 Support

- Email: support@3amigos.com
- Issues: [GitHub Issues](https://github.com/hamzaawan7/3amigos-automations/issues)

---

**Made with ❤️ by 3Amigos**

