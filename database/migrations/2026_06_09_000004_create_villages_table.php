<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('villages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('district_id')->constrained('districts')->cascadeOnDelete();
            $table->char('kemendagri_code', 10)->unique();
            $table->string('name', 100);
            $table->enum('status', ['perdesaan', 'perkotaan']);
            $table->tinyInteger('strata')->default(5)->comment('0-5, default 5 = tidak menggunakan strata');
            $table->decimal('centroid_lat', 10, 7)->nullable();
            $table->decimal('centroid_lng', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('villages');
    }
};
