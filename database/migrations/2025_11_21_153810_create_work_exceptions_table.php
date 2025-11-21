<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('missed_date'); // The workday they missed
            $table->date('compensate_date'); // The alternate day they worked
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('reason')->nullable();
            $table->text('work_description')->nullable(); // What they worked on
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['employee_id', 'missed_date']);
            $table->index(['employee_id', 'compensate_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_exceptions');
    }
};

