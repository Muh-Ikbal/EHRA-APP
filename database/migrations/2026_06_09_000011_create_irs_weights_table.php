<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('irs_weights', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->foreignUuid('irs_component_id')->constrained('irs_components')->cascadeOnDelete();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->string('risk_condition', 255);
            $table->decimal('weight', 5, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('irs_weights');
    }
};
