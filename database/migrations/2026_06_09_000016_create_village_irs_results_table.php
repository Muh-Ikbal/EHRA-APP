<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('village_irs_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('village_id')->constrained('villages')->cascadeOnDelete();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->smallInteger('total_respondents')->unsigned()->default(0);
            $table->json('component_scores');
            $table->json('components_snapshot');
            $table->decimal('irs_total', 6, 2);
            $table->enum('risk_category', [
                'tidak_berisiko',
                'kurang_berisiko',
                'sedang',
                'tinggi',
                'sangat_tinggi',
            ]);
            $table->string('risk_color', 7);
            $table->boolean('is_published')->default(false);
            $table->timestamp('calculated_at');
            $table->timestamps();

            $table->unique(['village_id', 'version_id']);
            $table->index(['village_id', 'version_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('village_irs_results');
    }
};
