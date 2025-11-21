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
            $table->enum('employment_type', ['full_time', 'part_time', 'contract'])->default('full_time')->after('kpi_score');
            $table->enum('employment_status', ['permanent', 'probation', 'intern'])->default('permanent')->after('employment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['employment_type', 'employment_status']);
        });
    }
};

