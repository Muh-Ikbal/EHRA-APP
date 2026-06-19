<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('response_id')->constrained('survey_responses')->cascadeOnDelete();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->text('answer_value')->nullable();
            $table->string('answer_code', 10)->nullable();
            $table->json('answer_codes')->nullable();
            $table->boolean('is_flagged_risk')->default(false);
            $table->timestamps();

            $table->unique(['response_id', 'question_id']);
            $table->index('response_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
