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
        Schema::table('work_from_home', function (Blueprint $table) {
            $table->boolean('is_late')->default(false)->after('check_in_time');
            $table->integer('late_by_minutes')->nullable()->after('is_late');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_from_home', function (Blueprint $table) {
            $table->dropColumn(['is_late', 'late_by_minutes']);
        });
    }
};
