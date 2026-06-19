<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->foreignUuid('enumerator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('village_id')->constrained('villages')->cascadeOnDelete();
            $table->string('respondent_code', 13)->unique();
            $table->tinyInteger('respondent_seq')->unsigned();
            $table->enum('status', ['draft', 'submitted', 'reviewed', 'approved'])->default('draft');
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            // Recommended index
            $table->index(['village_id', 'version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};
