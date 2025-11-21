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
        Schema::create('performance_milestones', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "60 Day Streak"
            $table->string('description'); // Description of the milestone
            $table->enum('type', ['streak', 'total_days', 'attendance_rate', 'on_time_rate']); // Type of milestone
            $table->integer('target_value'); // e.g., 60 for 60 days streak
            $table->decimal('bonus_amount', 10, 2); // Bonus in USD
            $table->string('currency', 10)->default('USD'); // Currency
            $table->boolean('is_active')->default(true); // Can be disabled
            $table->string('icon')->nullable(); // Emoji or icon identifier
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_milestones');
    }
};
