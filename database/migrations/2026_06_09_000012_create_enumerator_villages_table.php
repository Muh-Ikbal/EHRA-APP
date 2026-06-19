<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enumerator_villages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('village_id')->constrained('villages')->cascadeOnDelete();
            $table->foreignUuid('version_id')->constrained('questionnaire_versions')->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();

            $table->unique(['user_id', 'village_id', 'version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enumerator_villages');
    }
};
