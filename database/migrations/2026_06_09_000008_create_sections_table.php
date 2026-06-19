<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->string('code', 10);
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->tinyInteger('sort_order')->default(0);
            $table->boolean('is_irs_component')->default(false);
            $table->foreignUuid('irs_component_id')->nullable()->constrained('irs_components')->nullOnDelete();
            $table->timestamps();

            $table->unique(['version_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
