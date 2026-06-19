<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('map_popup_cache', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('village_id')->constrained('villages')->cascadeOnDelete();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->json('popup_data');
            $table->timestamp('cached_at');

            $table->unique(['village_id', 'version_id']);
            $table->index(['village_id', 'version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_popup_cache');
    }
};
