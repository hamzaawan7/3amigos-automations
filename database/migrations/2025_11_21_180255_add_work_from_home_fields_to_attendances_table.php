<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->boolean('is_wfh')->default(false)->after('late_by_minutes');
            $table->text('daily_tasks')->nullable()->after('is_wfh');
            $table->boolean('task_submitted')->default(false)->after('daily_tasks');
            $table->time('task_submitted_at')->nullable()->after('task_submitted');
        });

        // Migrate existing work_from_home data to attendances table
        $wfhRecords = \DB::table('work_from_home')->get();

        foreach ($wfhRecords as $wfh) {
            // Check if attendance record already exists for this employee/date
            $existing = \DB::table('attendances')
                ->where('employee_id', $wfh->employee_id)
                ->where('date', $wfh->date)
                ->first();

            if ($existing) {
                // Update existing record to include WFH data
                \DB::table('attendances')
                    ->where('id', $existing->id)
                    ->update([
                        'is_wfh' => true,
                        'check_in' => $wfh->check_in_time,
                        'is_late' => $wfh->is_late ?? false,
                        'late_by_minutes' => $wfh->late_by_minutes ?? 0,
                        'daily_tasks' => $wfh->daily_tasks,
                        'task_submitted' => $wfh->task_submitted ?? false,
                        'task_submitted_at' => $wfh->task_submitted_at,
                    ]);
            } else {
                // Create new attendance record for WFH
                \DB::table('attendances')->insert([
                    'employee_id' => $wfh->employee_id,
                    'date' => $wfh->date,
                    'check_in' => $wfh->check_in_time,
                    'is_late' => $wfh->is_late ?? false,
                    'late_by_minutes' => $wfh->late_by_minutes ?? 0,
                    'is_wfh' => true,
                    'daily_tasks' => $wfh->daily_tasks,
                    'task_submitted' => $wfh->task_submitted ?? false,
                    'task_submitted_at' => $wfh->task_submitted_at,
                    'created_at' => $wfh->created_at,
                    'updated_at' => $wfh->updated_at,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['is_wfh', 'daily_tasks', 'task_submitted', 'task_submitted_at']);
        });
    }
};
