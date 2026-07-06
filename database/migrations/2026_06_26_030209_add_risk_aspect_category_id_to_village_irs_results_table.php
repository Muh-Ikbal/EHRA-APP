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
            $table->foreignId('risk_aspect_category_id')->nullable()->constrained('risk_aspect_categories')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('village_irs_results', function (Blueprint $table) {
            $table->dropForeign(['risk_aspect_category_id']);
            $table->dropColumn('risk_aspect_category_id');
        });
    }
};
