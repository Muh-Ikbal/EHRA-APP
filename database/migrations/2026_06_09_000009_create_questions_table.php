<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('section_id')->constrained('sections')->cascadeOnDelete();
            $table->string('code', 10);
            $table->text('question_text');
            $table->enum('question_type', [
                'single_choice',
                'multi_choice',
                'text',
                'number',
                'date',
                'matrix',
            ]);
            $table->boolean('is_required')->default(true);
            $table->boolean('is_observation')->default(false);
            $table->smallInteger('sort_order')->default(0);
            $table->json('skip_logic')->nullable();
            $table->uuid('parent_question_id')->nullable();
            $table->timestamps();

            $table->foreign('parent_question_id')
                  ->references('id')
                  ->on('questions')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
