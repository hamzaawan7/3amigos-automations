# 3Amigos Attendance System - Quick Start

## 🚀 Quick Start

### Option 1: Development Mode (Recommended)
```bash
npm start
```
This starts both Vite dev server and Laravel server with hot-reload.

### Option 2: Build and Run (Production-like)
```bash
# Build assets once
npm run build

# Then start Laravel server in a separate terminal
php artisan serve
```

Access: **http://localhost:8000**

⚠️ **Note:** After any code changes, run `npm run build` to rebuild assets.

## 🎨 CSS Fixed!

I've fixed the Tailwind CSS configuration:
- ✅ Corrected `app.css` syntax
- ✅ Added `postcss.config.js`
- ✅ Tailwind now compiling properly

## 🌐 Access the Application

Open your browser: **http://localhost:8000**

## 🔐 Login Credentials

### Admin Account
```
Email: admin@3amigos.com
Password: password
```

### Employee Accounts
```
Format: firstname.lastname@3amigos.com
Password: password

Examples:
- ali.rehman@3amigos.com
- muhammad.umair@3amigos.com
- talha.javed@3amigos.com
```

## 📋 Available NPM Scripts

- `npm start` - Start both Vite and Laravel servers simultaneously
- `npm run dev` - Start only Vite dev server
- `npm run build` - Build production assets
- `npm run serve` - Start only Laravel server

## 🛑 Stop Servers

Press `Ctrl+C` in the terminal where `npm start` is running.

## ✨ Features

- Employee Dashboard with attendance stats
- Admin Panel for employee management
- Create/Edit/View employees
- Attendance tracking
- Leave balance management
- WhatsApp automation (Y-reply system)

## 📱 WhatsApp Commands (Still Active)

```bash
# Send daily attendance prompt
php artisan attendance:send-prompt

# Process replies and deduct leave
php artisan attendance:process-replies

# Send weekly leave summary
php artisan attendance:weekly-summary

# Sync WhatsApp contact IDs
php artisan whatsapp:sync-contacts
```

## 🎉 System is Ready!

Both servers are running. Just open http://localhost:8000 and login!

