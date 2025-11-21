<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\WorkExceptionController;
use Inertia\Inertia;

Route::get('/test', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'Laravel is working!',
        'vite_dev_server' => app()->environment('local') ? 'Should be running on port 5173' : 'Not in dev mode'
    ]);
});

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', LogoutController::class)->name('logout');

    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Attendance Marking (unified: office + WFH)
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/mark', [AttendanceController::class, 'mark'])->name('attendance.mark');
    Route::post('/attendance/submit-tasks', [AttendanceController::class, 'submitTasks'])->name('attendance.submit-tasks');

    // Help & Documentation
    Route::get('/help', function () {
        return Inertia::render('Help/Index');
    })->name('help.index');

    // Work Exceptions (Employee)
    Route::get('/work-exceptions', [WorkExceptionController::class, 'index'])->name('work-exception.index');
    Route::post('/work-exceptions', [WorkExceptionController::class, 'store'])->name('work-exception.store');

    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/work-exceptions', [WorkExceptionController::class, 'adminIndex'])->name('admin.work-exceptions.index');
        Route::post('/admin/work-exceptions/{workException}/approve', [WorkExceptionController::class, 'approve'])->name('admin.work-exceptions.approve');
        Route::post('/admin/work-exceptions/{workException}/reject', [WorkExceptionController::class, 'reject'])->name('admin.work-exceptions.reject');

        // Performance Milestones & Rewards
        Route::get('/admin/milestones', [\App\Http\Controllers\Admin\MilestoneController::class, 'index'])->name('admin.milestones.index');
        Route::get('/admin/milestones/create', [\App\Http\Controllers\Admin\MilestoneController::class, 'create'])->name('admin.milestones.create');
        Route::post('/admin/milestones', [\App\Http\Controllers\Admin\MilestoneController::class, 'store'])->name('admin.milestones.store');
        Route::get('/admin/milestones/{milestone}/edit', [\App\Http\Controllers\Admin\MilestoneController::class, 'edit'])->name('admin.milestones.edit');
        Route::put('/admin/milestones/{milestone}', [\App\Http\Controllers\Admin\MilestoneController::class, 'update'])->name('admin.milestones.update');
        Route::delete('/admin/milestones/{milestone}', [\App\Http\Controllers\Admin\MilestoneController::class, 'destroy'])->name('admin.milestones.destroy');
        Route::post('/admin/milestones/{milestone}/toggle', [\App\Http\Controllers\Admin\MilestoneController::class, 'toggle'])->name('admin.milestones.toggle');

        Route::get('/admin/rewards', [\App\Http\Controllers\Admin\MilestoneController::class, 'rewards'])->name('admin.rewards.index');
        Route::post('/admin/rewards/{reward}/mark-paid', [\App\Http\Controllers\Admin\MilestoneController::class, 'markPaid'])->name('admin.rewards.mark-paid');

        // Attendance Management
        Route::post('/admin/attendance/mark-late', [\App\Http\Controllers\Admin\AttendanceManagementController::class, 'markAsLate'])->name('admin.attendance.mark-late');
        Route::post('/admin/attendance/mark-on-time', [\App\Http\Controllers\Admin\AttendanceManagementController::class, 'markAsOnTime'])->name('admin.attendance.mark-on-time');
    });

    // Admin routes (for now, all authenticated users can access)
    Route::resource('employees', EmployeeController::class);
});
