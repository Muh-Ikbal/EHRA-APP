<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('village_survey_quota', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('village_id')->constrained('villages')->cascadeOnDelete();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->tinyInteger('max_respondents')->unsigned()->default(40);
            $table->smallInteger('current_count')->unsigned()->default(0);
            $table->boolean('is_locked')->default(false);
            $table->timestamp('locked_at')->nullable();
            $table->timestamps();

            $table->unique(['village_id', 'version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('village_survey_quota');
    }
};
