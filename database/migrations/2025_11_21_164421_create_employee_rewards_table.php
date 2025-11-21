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
        Schema::create('employee_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('milestone_id')->constrained('performance_milestones')->onDelete('cascade');
            $table->decimal('bonus_amount', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->integer('achieved_value'); // The value they achieved (e.g., 60 for 60 day streak)
            $table->date('achieved_date'); // When they earned it
            $table->boolean('is_paid')->default(false); // Track if bonus was paid
            $table->date('paid_date')->nullable(); // When bonus was paid
            $table->text('notes')->nullable(); // Any additional notes
            $table->timestamps();

            // Prevent duplicate rewards for same milestone
            $table->unique(['employee_id', 'milestone_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_rewards');
    }
};
