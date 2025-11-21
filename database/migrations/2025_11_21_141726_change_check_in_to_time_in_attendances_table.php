<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, update existing records to extract time only
        DB::table('attendances')
            ->whereNotNull('check_in')
            ->get()
            ->each(function ($attendance) {
                try {
                    $checkIn = \Carbon\Carbon::parse($attendance->check_in)->format('H:i:s');
                    DB::table('attendances')
                        ->where('id', $attendance->id)
                        ->update(['check_in' => $checkIn]);
                } catch (\Exception $e) {
                    // Skip if already in correct format
                }
            });

        // Change column type to TIME
        Schema::table('attendances', function (Blueprint $table) {
            $table->time('check_in')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dateTime('check_in')->nullable()->change();
        });
    }
};
