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
        Schema::table('village_irs_results', function (Blueprint $table) {
            $table->dropColumn('risk_category');
            $table->dropColumn('risk_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('table_village_irs_results', function (Blueprint $table) {
            $table->enum('risk_category', [
                'tidak_berisiko',
                'kurang_berisiko',
                'sedang',
                'tinggi',
                'sangat_tinggi',
            ]);
            $table->string('risk_color', 7);
        });
    }
};
