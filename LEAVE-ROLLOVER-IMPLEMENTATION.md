# Leave Rollover System - Implementation Summary

**Date:** November 21, 2025  
**Feature:** Yearly Leave Rollover + New Allocation  
**Effective:** September 1st Annually  

---

## Overview

The leave reset system has been updated to **rollover unused leaves** to the next year instead of resetting to a fixed amount.

---

## Previous System (Before Update)

**Reset Logic:**
```php
// Old: Reset to quota (lose unused leaves)
$employee->leave_balance = $employee->annual_leave_quota; // Always 14
```

**Example:**
```
Year 1 (Sept 1, 2024):
- Allocation: 14 days
- Used: 5 days
- Remaining: 9 days

Year 2 (Sept 1, 2025):
- ❌ Lost 9 unused days
- Reset to: 14 days
- Total: 14 days
```

**Problem:** Employees lost unused leave days every year, discouraging leave conservation.

---

## New System (After Update)

**Reset Logic:**
```php
// New: Rollover + New allocation
$currentBalance = $employee->leave_balance;
$newAllocation = $employee->annual_leave_quota; // 14 days
$employee->leave_balance = $currentBalance + $newAllocation;
```

**Example:**
```
Year 1 (Sept 1, 2024):
- Allocation: 14 days
- Used: 5 days
- Remaining: 9 days

Year 2 (Sept 1, 2025):
- ✅ Rollover: 9 days (kept)
- New allocation: 14 days
- Total: 23 days (9 + 14)
```

**Benefit:** Employees can accumulate leave for future use (vacations, emergencies).

---

## Implementation Details

### 1. Code Changes

**File:** `app/Services/LeaveService.php`

**Method:** `resetYearlyLeave()`

```php
public function resetYearlyLeave(): int
{
    $count = 0;
    foreach ($this->employees->all() as $employee) {
        // Rollover: Keep existing unused leave balance and add new annual quota
        $currentBalance = $employee->leave_balance;
        $newAllocation = $employee->annual_leave_quota; // Default: 14 days
        
        // New balance = rollover + new allocation
        $employee->leave_balance = $currentBalance + $newAllocation;
        
        $this->employees->save($employee);
        $count++;
    }
    return $count;
}
```

### 2. Command Update

**File:** `app/Console/Commands/LeaveResetYearly.php`

**Description Updated:**
```php
protected $description = 'Rollover unused leaves and add new annual allocation (14 days) on Sept 1.';
```

### 3. Scheduled Execution

**File:** `app/Console/Kernel.php`

**Schedule:**
```php
$schedule->command('leave:reset-yearly')
    ->timezone('Asia/Karachi')
    ->cron('10 0 1 9 *'); // Sept 1 at 00:10 AM
```

**Cron Expression:** `10 0 1 9 *`
- Minute: 10
- Hour: 0 (midnight)
- Day: 1
- Month: 9 (September)
- Weekday: * (any)

**Next Run:** September 1, 2026 at 00:10 AM (Pakistan Time)

---

## Examples & Scenarios

### Scenario 1: Employee Uses All Leaves

```
Year 1:
- Allocation: 14 days
- Used: 14 days
- Remaining: 0 days

Year 2 (Sept 1):
- Rollover: 0 days
- New allocation: 14 days
- Total: 14 days
```

### Scenario 2: Employee Uses No Leaves

```
Year 1:
- Allocation: 14 days
- Used: 0 days
- Remaining: 14 days

Year 2 (Sept 1):
- Rollover: 14 days
- New allocation: 14 days
- Total: 28 days
```

### Scenario 3: Employee Uses Partial Leaves

```
Year 1:
- Allocation: 14 days
- Used: 8 days
- Remaining: 6 days

Year 2 (Sept 1):
- Rollover: 6 days
- New allocation: 14 days
- Total: 20 days
```

### Scenario 4: Multi-Year Accumulation

```
Year 1:
- Start: 14 days
- Used: 2 days
- End: 12 days

Year 2 (Sept 1):
- Rollover: 12 days
- New: 14 days
- Total: 26 days
- Used: 5 days
- End: 21 days

Year 3 (Sept 1):
- Rollover: 21 days
- New: 14 days
- Total: 35 days
```

---

## Employee Benefits

### Advantages:

1. **Accumulation:** Unused leaves don't expire
2. **Flexibility:** Save for long vacations or emergencies
3. **Motivation:** Encourages good attendance
4. **Planning:** Employees can plan extended breaks
5. **Security:** Leave buffer for unexpected situations

### Use Cases:

- 🏖️ **Vacation:** Save for 2-week international trip
- 🏥 **Medical:** Reserve for potential health issues
- 👨‍👩‍👧 **Family:** Keep for family emergencies
- 🎓 **Education:** Save for exam preparation
- 🏠 **Personal:** Accumulate for life events (wedding, etc.)

---

## Database Impact

### Before Reset (Aug 31):

| Employee | Leave Balance |
|----------|---------------|
| Ali Rehman | 9 days |
| Sara Khan | 12 days |
| Ahmed Ali | 3 days |

### After Reset (Sept 1):

| Employee | Previous | New Allocation | Total |
|----------|----------|----------------|-------|
| Ali Rehman | 9 days | 14 days | 23 days |
| Sara Khan | 12 days | 14 days | 26 days |
| Ahmed Ali | 3 days | 14 days | 17 days |

---

## Testing

### Manual Test:

Run the command manually:
```bash
php artisan leave:reset-yearly
```

### Check Results:

**Before:**
```sql
SELECT name, leave_balance, annual_leave_quota 
FROM employees;
```

**Run Command:**
```bash
php artisan leave:reset-yearly
```

**After:**
```sql
SELECT name, leave_balance, annual_leave_quota 
FROM employees;
```

**Expected:**
- Each employee's `leave_balance` should increase by 14
- `annual_leave_quota` remains 14

### Example Test:

```
Employee: John Doe
Before: leave_balance = 7 days
After:  leave_balance = 21 days (7 + 14)
```

---

## Considerations

### Maximum Accumulation:

**Current:** No limit
- Employees can accumulate indefinitely
- Example: 50+ days possible after several years

**Future Consideration:**
- May want to add maximum cap (e.g., 60 days)
- Prevents excessive accumulation
- Encourages regular leave usage

### Policy Recommendations:

1. **Cap Accumulation:** Limit to 2x annual (28 days max rollover)
2. **Forced Usage:** Require minimum annual usage
3. **Expiry:** Oldest leaves expire first (FIFO)
4. **Encashment:** Allow buying back unused leaves

### Code for Cap (Optional):

```php
// Add maximum cap of 60 days
$maxBalance = 60;
$employee->leave_balance = min($maxBalance, $currentBalance + $newAllocation);
```

---

## Communication to Employees

### Email Template:

**Subject:** New Leave Rollover Policy - Good News! 🎉

**Body:**
```
Dear Team,

Great news! We've updated our leave policy to benefit everyone.

🎉 What's Changed?
Starting September 1, 2025, unused leave days will ROLL OVER to the next year!

📊 How It Works:
- You still get 14 new days every September 1st
- PLUS you keep any unused days from previous year
- Example: 5 days left + 14 new = 19 total days

✅ Benefits:
- Save for longer vacations
- Build a leave buffer
- No more "use it or lose it"

📅 Next Reset: September 1, 2026

Questions? Contact HR.

Best regards,
3Amigos HR Team
```

---

## Monitoring & Reporting

### Admin Dashboard Metrics:

Track these new metrics:
- Average leave balance per employee
- Employees with high accumulation (>30 days)
- Year-over-year rollover trends
- Leave utilization rate

### SQL Queries:

**Average Balance:**
```sql
SELECT AVG(leave_balance) as avg_balance 
FROM employees;
```

**High Accumulators:**
```sql
SELECT name, leave_balance 
FROM employees 
WHERE leave_balance > 30 
ORDER BY leave_balance DESC;
```

**Rollover Impact:**
```sql
SELECT 
    name,
    leave_balance as current,
    leave_balance + 14 as after_reset
FROM employees;
```

---

## Rollback Procedure

If needed, revert to old system:

**File:** `app/Services/LeaveService.php`

```php
public function resetYearlyLeave(): int
{
    $count = 0;
    foreach ($this->employees->all() as $employee) {
        // Old logic: Reset to quota
        $employee->leave_balance = $employee->annual_leave_quota;
        $this->employees->save($employee);
        $count++;
    }
    return $count;
}
```

---

## Documentation Updates

### Updated Files:

1. ✅ `SOP-EMPLOYEE-ATTENDANCE-SYSTEM.md`
   - Section 4.1: Leave Balance
   - Added rollover example
   - Updated FAQ

2. ✅ `app/Services/LeaveService.php`
   - Updated resetYearlyLeave() method
   - Added comments

3. ✅ `app/Console/Commands/LeaveResetYearly.php`
   - Updated description

### To Update:

- Employee handbook
- HR documentation
- Onboarding materials
- Leave policy document

---

## Summary

✅ **Implemented:** Leave rollover system  
✅ **Schedule:** September 1st annually  
✅ **Logic:** Current balance + 14 new days  
✅ **Benefit:** Employees keep unused leaves  
✅ **Testing:** Manual command available  
✅ **Documentation:** SOPs updated  

**Next Action:** Communicate policy to employees before next reset (Sept 1, 2026)

---

**End of Document**

**3Amigos © 2025**

