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
        // 1. Admin user (menggunakan UserSeeder lokal yang di-exclude dari git, atau via konfigurasi .env)
        if (class_exists(UserSeeder::class)) {
            $this->call(UserSeeder::class);
        } elseif (env('ADMIN_EMAIL') && User::where('email', env('ADMIN_EMAIL'))->doesntExist()) {
            User::factory()->create([
                'name'     => env('ADMIN_NAME', 'Administrator EHRA'),
                'email'    => env('ADMIN_EMAIL'),
                'password' => bcrypt(env('ADMIN_PASSWORD', 'password')),
                'role'     => 'admin',
            ]);
        } elseif (User::where('role', 'admin')->doesntExist() && app()->environment('local')) {
            User::factory()->create([
                'name'  => 'Administrator EHRA',
                'email' => 'admin@ehra.local',
                'role'  => 'admin',
            ]);
        }

        // 2. Full EHRA 2026 Questionnaire (sections, questions, options)
        $this->call(EhraQuestionnaireSeeder::class);

        // 3. Location Seeder (Provinces, Cities, Districts, Villages & Dummy IRS Results)
        $this->call(LocationSeeder::class);
    }
}
