<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin user (required before questionnaire seeder)
        if (User::count() === 0) {
            User::factory()->create([
                'name'  => 'Administrator EHRA',
                'email' => 'admin@ehra.go.id',
                'role'  => 'admin',
            ]);
        }

        // 2. Full EHRA 2026 Questionnaire (sections, questions, options)
        $this->call(EhraQuestionnaireSeeder::class);
    }
}
