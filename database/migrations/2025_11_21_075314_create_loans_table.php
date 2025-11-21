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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->decimal('total_amount', 12, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('monthly_deduction', 12, 2);
            $table->decimal('remaining_amount', 12, 2);
            $table->date('loan_date'); // Date when loan was taken
            $table->date('next_deduction_date'); // Next scheduled deduction date
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Create loan_deductions table to track each deduction
        Schema::create('loan_deductions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3);
            $table->date('deduction_date');
            $table->decimal('remaining_after', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_deductions');
        Schema::dropIfExists('loans');
    }
};
