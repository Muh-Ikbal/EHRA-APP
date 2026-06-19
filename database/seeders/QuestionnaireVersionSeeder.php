<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionnaireVersionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::first();
        $adminId = $admin ? $admin->id : 1;

        $version = \App\Models\QuestionnaireVersion::create([
            'version_code' => 'EHRA-2026',
            'title' => 'Kuesioner EHRA 2026',
            'description' => 'Templat Standar Kuesioner EHRA 2026',
            'valid_from' => '2026-01-01',
            'is_active' => true,
            'created_by' => $adminId,
        ]);

        // IRS Components
        $irsAir = \App\Models\IrsComponent::create(['version_id' => $version->id, 'key' => 'sumber_air', 'label' => 'Sumber Air', 'sort_order' => 1]);
        $irsLimbah = \App\Models\IrsComponent::create(['version_id' => $version->id, 'key' => 'air_limbah', 'label' => 'Air Limbah Domestik', 'sort_order' => 2]);
        $irsSampah = \App\Models\IrsComponent::create(['version_id' => $version->id, 'key' => 'persampahan', 'label' => 'Persampahan', 'sort_order' => 3]);
        $irsGenangan = \App\Models\IrsComponent::create(['version_id' => $version->id, 'key' => 'genangan_air', 'label' => 'Genangan Air', 'sort_order' => 4]);
        $irsPerilaku = \App\Models\IrsComponent::create(['version_id' => $version->id, 'key' => 'phbs', 'label' => 'Perilaku Hidup Bersih dan Sehat', 'sort_order' => 5]);

        // Sections
        $secIdentitas = \App\Models\Section::create(['version_id' => $version->id, 'code' => 'A', 'title' => 'Informasi Umum', 'sort_order' => 1]);
        $secAir = \App\Models\Section::create(['version_id' => $version->id, 'code' => 'B', 'title' => 'Sumber Air Minum', 'is_irs_component' => true, 'irs_component_id' => $irsAir->id, 'sort_order' => 2]);
        
        // Questions
        // Identitas
        \App\Models\Question::create([
            'section_id' => $secIdentitas->id, 'code' => 'A1', 'question_text' => 'Nama Responden', 'question_type' => 'text', 'sort_order' => 1
        ]);
        
        // Sumber Air
        $qAir1 = \App\Models\Question::create([
            'section_id' => $secAir->id, 'code' => 'B1', 'question_text' => 'Apa sumber air utama untuk minum?', 'question_type' => 'single_choice', 'sort_order' => 1
        ]);
        
        \App\Models\QuestionOption::create(['question_id' => $qAir1->id, 'option_value' => '1', 'option_label' => 'Air Kemasan/Isi Ulang', 'sort_order' => 1, 'is_risk_flag' => false]);
        \App\Models\QuestionOption::create(['question_id' => $qAir1->id, 'option_value' => '2', 'option_label' => 'Sumur Gali Terlindung', 'sort_order' => 2, 'is_risk_flag' => false]);
        \App\Models\QuestionOption::create(['question_id' => $qAir1->id, 'option_value' => '3', 'option_label' => 'Sumur Gali Tidak Terlindung', 'sort_order' => 3, 'is_risk_flag' => true, 'risk_weight' => 5]);
        
        $qAir2 = \App\Models\Question::create([
            'section_id' => $secAir->id, 'code' => 'B2', 'question_text' => 'Apakah air minum direbus sebelum dikonsumsi?', 'question_type' => 'single_choice', 'sort_order' => 2
        ]);
        \App\Models\QuestionOption::create(['question_id' => $qAir2->id, 'option_value' => '1', 'option_label' => 'Ya', 'sort_order' => 1]);
        \App\Models\QuestionOption::create(['question_id' => $qAir2->id, 'option_value' => '2', 'option_label' => 'Tidak', 'sort_order' => 2, 'is_risk_flag' => true, 'risk_weight' => 10]);
    }
}
