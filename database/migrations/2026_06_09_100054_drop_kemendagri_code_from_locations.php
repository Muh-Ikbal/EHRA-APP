<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn('kemendagri_code');
        });
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn('kemendagri_code');
        });
        Schema::table('districts', function (Blueprint $table) {
            $table->dropColumn('kemendagri_code');
        });
        Schema::table('villages', function (Blueprint $table) {
            $table->dropColumn('kemendagri_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('provinces', function (Blueprint $table) {
            $table->char('kemendagri_code', 2)->nullable();
        });
        Schema::table('cities', function (Blueprint $table) {
            $table->char('kemendagri_code', 4)->nullable();
        });
        Schema::table('districts', function (Blueprint $table) {
            $table->char('kemendagri_code', 7)->nullable();
        });
        Schema::table('villages', function (Blueprint $table) {
            $table->char('kemendagri_code', 10)->nullable();
        });
    }
};
