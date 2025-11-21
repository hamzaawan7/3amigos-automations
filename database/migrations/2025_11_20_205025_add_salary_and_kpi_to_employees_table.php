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
            $table->decimal('salary', 10, 2)->nullable()->after('phone');
            $table->string('currency', 3)->default('USD')->after('salary');
            $table->string('salary_type')->default('Salary')->after('currency'); // Salary, Hourly, etc.
            $table->date('last_increment_date')->nullable()->after('salary_type');
            $table->decimal('kpi_score', 5, 2)->default(0)->after('last_increment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['salary', 'currency', 'salary_type', 'last_increment_date', 'kpi_score']);
        });
    }
};
