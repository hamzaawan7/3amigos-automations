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
        Schema::table('employees', function (Blueprint $table) {
            $table->time('start_time')->default('12:00:00')->after('phone');
        });

        // Set Ali Rehman's start time to 14:00 (2 PM)
        \DB::table('employees')
            ->where('name', 'Ali Rehman')
            ->update(['start_time' => '14:00:00']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('start_time');
        });
    }
};
