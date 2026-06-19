<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('villages', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        Schema::table('villages', function (Blueprint $table) {
            $table->enum('status', ['desa', 'kelurahan'])->default('kelurahan')->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('villages', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        Schema::table('villages', function (Blueprint $table) {
            $table->enum('status', ['perdesaan', 'perkotaan'])->default('perkotaan')->after('name');
        });
    }
};
