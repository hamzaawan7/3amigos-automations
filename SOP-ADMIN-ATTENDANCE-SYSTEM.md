# 3Amigos Attendance System - Admin Standard Operating Procedures

**Version:** 1.0  
**Effective Date:** November 21, 2025  
**Audience:** Administrators, HR, Management  

---

## Table of Contents

1. [Admin Dashboard Access](#1-admin-dashboard-access)
2. [Employee Management](#2-employee-management)
3. [Attendance Management](#3-attendance-management)
4. [Work Exception Approvals](#4-work-exception-approvals)
5. [Performance Milestones & Rewards](#5-performance-milestones--rewards)
6. [Reports & Analytics](#6-reports--analytics)
7. [System Maintenance](#7-system-maintenance)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Admin Dashboard Access

### 1.1 Login Credentials
- **URL:** `http://your-domain.com/login`
- **Admin Email:** `admin@3amigos.com`
- **Password:** [Secure password set by IT]

### 1.2 Admin Privileges
✅ View all employee records  
✅ Manage employee profiles  
✅ Approve/reject work exceptions  
✅ Manually adjust attendance  
✅ Configure milestones & rewards  
✅ Generate reports  
✅ System configuration access  

---

## 2. Employee Management

### 2.1 View All Employees
**Path:** Dashboard → Employees

**View:**
- Total employees
- Today's attendance status
- Leave balances
- Performance metrics

### 2.2 Create New Employee

**Path:** Employees → Create

**Required Information:**
- Full Name
- Email (unique)
- Password
- Phone Number
- Start Time (e.g., 12:00, 14:00)
- Annual Leave Quota (default: 14 days)

**Process:**
1. Fill in all required fields
2. Click "Create Employee"
3. System creates user account + employee profile
4. Send credentials to employee via email
5. Employee can log in immediately

### 2.3 Edit Employee

**Path:** Employees → [Select Employee] → Edit

**Editable Fields:**
- Name
- Phone
- **Start Time** (important for late calculation)
- Annual Leave Quota
- Leave Balance (manual adjustment)
- Salary details
- KPI Score

**Use Cases:**
- Adjust start time for special arrangements
- Manually correct leave balance
- Update salary information

### 2.4 View Employee Details

**Path:** Employees → [Select Employee] → View

**Information Displayed:**
- Personal information
- Current leave balance
- Attendance streak
- Recent attendance history (30 days)
- All check-ins (Office & WFH)
- Late arrivals marked

---

## 3. Attendance Management

### 3.1 Daily Attendance Overview

**Path:** Dashboard (Admin View)

**Today's Summary:**
- Total employees
- Present today (Office)
- Present today (WFH)
- Absent today
- Late arrivals
- Pending WFH tasks

### 3.2 Manually Mark Employee as Late

**Path:** Employees → [Select Employee] → Attendance Actions

**Use Case:** Employee arrived late but system didn't catch it

**Process:**
1. Select employee
2. Click "Mark as Late"
3. Enter:
   - Date
   - Late by minutes (e.g., 15, 90, 135)
4. Submit
5. System updates:
   - `is_late = true`
   - `late_by_minutes = [value]`
   - Breaks employee streak
   - Updates attendance history

**API Endpoint:**
```
POST /admin/attendance/mark-late
Body: {
    employee_id: 4,
    date: "2025-11-21",
    late_by_minutes: 15
}
```

### 3.3 Manually Mark Employee as On-Time

**Use Case:** Employee was incorrectly marked as late

**Process:**
1. Select employee
2. Click "Mark as On-Time"
3. Enter date
4. Submit
5. System updates:
   - `is_late = false`
   - `late_by_minutes = 0`
   - Does NOT restore streak (admin decision)

**API Endpoint:**
```
POST /admin/attendance/mark-on-time
Body: {
    employee_id: 4,
    date: "2025-11-21"
}
```

### 3.4 Manual Attendance Adjustment

**Use Cases:**
- System was down
- Employee had technical issues
- Retrospective correction needed

**Process:**
1. Access database directly (if needed)
2. Or use admin panel to create attendance record
3. Notify employee of manual adjustment
4. Document the reason for audit trail

---

## 4. Work Exception Approvals

### 4.1 View Pending Exceptions

**Path:** Dashboard → Work Exceptions

**Status Types:**
- 🟡 **Pending:** Awaiting admin review
- ✅ **Approved:** Leave not deducted, streak protected
- ❌ **Rejected:** Normal penalties apply

### 4.2 Review Work Exception

**Information Displayed:**
- Employee name
- Missed date (when they were absent)
- Worked date (when they worked instead)
- Reason provided
- Submission date

**Evaluation Criteria:**

✅ **Approve If:**
- Valid reason (weekend work, emergency)
- Worked date is verifiable
- Employee has good track record
- Manager approved

❌ **Reject If:**
- Frivolous reason
- No proof of work
- Pattern of abuse
- Manager did not approve

### 4.3 Approve Exception

**Process:**
1. Review request details
2. Verify worked date (check logs, ask manager)
3. Click "Approve"
4. System automatically:
   - Does NOT deduct leave for missed day
   - Does NOT break streak
   - Sends approval notification to employee

### 4.4 Reject Exception

**Process:**
1. Review request
2. Click "Reject"
3. Optionally add rejection reason
4. System:
   - Deducts leave normally
   - Breaks streak if applicable
   - Sends rejection notification

---

## 5. Performance Milestones & Rewards

### 5.1 View Milestones

**Path:** Dashboard → Admin → Milestones

**Milestone Types:**
- `attendance_streak` - Consecutive on-time days
- `kpi_achievement` - Performance targets
- `custom` - Other achievements

### 5.2 Create Milestone

**Path:** Milestones → Create

**Required Fields:**
- Name (e.g., "7-Day Attendance Streak")
- Description
- Type (attendance_streak, kpi_achievement)
- Target Value (e.g., 7 for 7-day streak)
- Bonus Amount
- Currency (USD, PKR, etc.)
- Icon (emoji or icon code)
- Is Active (toggle)

**Example Attendance Streak Milestone:**
```
Name: 30-Day Attendance Streak
Type: attendance_streak
Target Value: 30
Bonus Amount: 5000
Currency: PKR
Is Active: Yes
```

### 5.3 View Rewards

**Path:** Dashboard → Admin → Rewards

**Reward Status:**
- 🟡 **Pending:** Earned but not paid
- ✅ **Paid:** Bonus disbursed

**Information Shown:**
- Employee name
- Milestone achieved
- Achieved value (e.g., 30-day streak)
- Bonus amount
- Achievement date
- Payment status

### 5.4 Mark Reward as Paid

**Process:**
1. View earned rewards
2. Verify bonus amount
3. Process payment through payroll
4. Click "Mark as Paid"
5. Record payment date
6. Employee notified

---

## 6. Reports & Analytics

### 6.1 Attendance Reports

**Available Reports:**
- Daily attendance summary
- Weekly attendance trends
- Monthly attendance statistics
- Late arrival report
- Leave utilization report
- WFH vs Office ratio

### 6.2 Employee Performance

**Metrics:**
- Attendance percentage
- On-time percentage
- Current streak
- Longest streak
- Total present days
- Late days count

### 6.3 Export Data

**Formats Available:**
- CSV (Excel compatible)
- PDF (print-ready)
- JSON (API integration)

**Export Options:**
- Date range selection
- Employee selection
- Custom filters

---

## 7. System Maintenance

### 7.1 Database Management

**Location:** MySQL Database
**Tables:**
- `users` - User accounts
- `employees` - Employee records
- `attendances` - All attendance (Office + WFH)
- `performance_milestones` - Reward definitions
- `employee_rewards` - Earned rewards
- `work_exceptions` - Exception requests

### 7.2 Configuration

**Environment Variables (.env):**
```
# WhatsApp Integration
ULTRAMSG_INSTANCE_ID=instance123456
ULTRAMSG_TOKEN=your_token_here
WHATSAPP_ATTENDANCE_GROUP=120363422528155893@g.us

# Attendance Settings
ATTENDANCE_TIMEZONE=Asia/Karachi
ATTENDANCE_OFFICE_START_TIME=11:00
```

### 7.3 Scheduled Tasks

**Daily Tasks (via Laravel Scheduler):**
- `attendance:process-daily` - At 11:00 PM
  - Checks unmarked attendance
  - Deducts leave for missed days
  - Sends notifications
  
- `attendance:process-replies` - At 11:30 PM
  - Processes WhatsApp replies (if used)
  - Updates attendance records

**Weekly Tasks:**
- Send attendance summary - Monday 9:00 AM
- Leave balance reports - Friday 5:00 PM

**Annual Tasks:**
- Reset leave balance - September 1st

### 7.4 Backup Procedures

**Daily Backups:**
- Database: `mysqldump` at 2:00 AM
- Files: `/storage` folder backup
- Logs: Archive logs older than 30 days

**Restore Procedure:**
1. Access backup files
2. Restore database: `mysql < backup.sql`
3. Restore files to `/storage`
4. Verify system functionality

---

## 8. Troubleshooting

### 8.1 Common Employee Issues

#### Issue: "I can't check in"
**Admin Action:**
1. Verify current time (after 11 AM?)
2. Check if already checked in today
3. Check employee record exists
4. Manually create attendance if needed

#### Issue: "Leave was deducted incorrectly"
**Admin Action:**
1. Check attendance records for that date
2. Verify if WFH tasks were submitted
3. Check for approved work exceptions
4. Manually adjust leave if valid complaint
5. Document the correction

#### Issue: "My streak didn't increase"
**Admin Action:**
1. Verify check-in was on time
2. Check if late even by 1 minute
3. Explain streak rules to employee
4. No manual streak adjustment (system-driven)

### 8.2 System Issues

#### Issue: WhatsApp notifications not sending
**Admin Action:**
1. Check `.env` credentials
2. Verify ULTRAMSG_TOKEN is valid
3. Check WHATSAPP_ATTENDANCE_GROUP ID
4. Test with manual send
5. Contact UltraMsg support if needed

#### Issue: Scheduled tasks not running
**Admin Action:**
1. Check Laravel scheduler: `php artisan schedule:list`
2. Verify cron job: `* * * * * cd /path && php artisan schedule:run`
3. Check logs: `storage/logs/laravel.log`
4. Run manually: `php artisan attendance:process-daily`

#### Issue: Database errors
**Admin Action:**
1. Check database connection: `.env` credentials
2. Run migrations: `php artisan migrate`
3. Check disk space
4. Review error logs
5. Restore from backup if corrupted

---

## 9. Security & Access Control

### 9.1 Admin Access Logs

**Monitor:**
- Who accessed admin panel
- What changes were made
- When changes occurred

### 9.2 Password Management

**Admin Password Reset:**
```bash
php artisan tinker
>>> $user = User::where('email', 'admin@3amigos.com')->first();
>>> $user->password = Hash::make('new_password');
>>> $user->save();
```

### 9.3 Employee Password Reset

**Process:**
1. Employee → Edit
2. Generate new temporary password
3. Send to employee via secure channel
4. Force password change on next login (if configured)

---

## 10. Best Practices for Admins

### 10.1 Daily Routine

**Morning (9:00 AM):**
- Review yesterday's attendance
- Check pending work exceptions
- Process any manual adjustments

**Afternoon (2:00 PM):**
- Monitor today's check-ins
- Respond to employee queries
- Approve urgent work exceptions

**Evening (6:00 PM):**
- Verify WFH task submissions
- Address system issues
- Prepare for next day

### 10.2 Weekly Routine

**Monday:**
- Send weekly attendance summary
- Review last week's metrics
- Set weekly monitoring goals

**Friday:**
- Process rewards marked for payment
- Generate weekly reports
- Plan next week's maintenance

### 10.3 Monthly Routine

**End of Month:**
- Generate monthly attendance report
- Calculate leave utilization
- Review milestone achievements
- Process reward payments
- Backup all data

---

## 11. Emergency Procedures

### 11.1 System Down

**Immediate Actions:**
1. Announce downtime to employees
2. Note all affected employees
3. Manually track attendance (spreadsheet)
4. Fix system issue
5. Bulk import attendance data
6. Notify employees of resolution

### 11.2 Data Loss

**Recovery Steps:**
1. Stop all system access
2. Restore from latest backup
3. Verify data integrity
4. Manually reconcile any gaps
5. Notify affected employees
6. Document incident

---

## 12. Contact & Support

### 12.1 Technical Support
- **Laravel Developer:** [contact]
- **Database Admin:** [contact]
- **UltraMsg Support:** https://ultramsg.com

### 12.2 Escalation Path
1. Level 1: IT Support
2. Level 2: System Administrator
3. Level 3: Development Team
4. Level 4: External Vendor

---

**End of Admin SOP**

**3Amigos © 2025 - Confidential**

