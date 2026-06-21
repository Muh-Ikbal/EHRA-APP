<?php

namespace Database\Seeders;

use App\Models\IrsComponent;
use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\QuestionOption;
use App\Models\Section;
use App\Models\User;
use Database\Seeders\Data\EhraQuestionsAirData;
use Database\Seeders\Data\EhraQuestionsDrainaseData;
use Database\Seeders\Data\EhraQuestionsGHIJData;
use Database\Seeders\Data\EhraQuestionsIdentitasData;
use Database\Seeders\Data\EhraQuestionsInfoData;
use Database\Seeders\Data\EhraQuestionsSampahData;
use Database\Seeders\Data\EhraQuestionsTinjaData;
use Database\Seeders\Data\EhraSectionsData;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Seeder utama Kuesioner EHRA 2026.
 *
 * Membuat seluruh struktur kuesioner:
 * 1. QuestionnaireVersion  — versi EHRA-2026
 * 2. IrsComponent          — 5 komponen IRS
 * 3. Section (11 section)  — ID, A, B, C, D, E, F, G, H, I, J
 * 4. Question              — seluruh pertanyaan per section
 * 5. QuestionOption         — seluruh pilihan jawaban per pertanyaan
 *
 * Section "ID" (Identitas Wilayah) di-mark auto_fill sehingga
 * di frontend data terisi otomatis dari relasi:
 *   User → enumerator_villages → village → district → city → province
 *
 * Catatan:
 * - Seeder idempotent: cek versi kuesioner sebelum insert.
 * - Menggunakan DB transaction untuk atomicity.
 * - Data dipisah ke file Data/ agar maintainable.
 */
class EhraQuestionnaireSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Mapping section code → data source method.
     */
    private const SECTION_QUESTION_MAP = [
        'ID' => [EhraQuestionsIdentitasData::class, 'questions'],
        'A'  => [EhraQuestionsInfoData::class, 'sectionA'],
        'B'  => [EhraQuestionsInfoData::class, 'sectionB'],
        'C'  => [EhraQuestionsSampahData::class, 'questions'],
        'D'  => [EhraQuestionsTinjaData::class, 'questions'],
        'E'  => [EhraQuestionsDrainaseData::class, 'questions'],
        'F'  => [EhraQuestionsAirData::class, 'questions'],
        'G'  => [EhraQuestionsGHIJData::class, 'sectionG'],
        'H'  => [EhraQuestionsGHIJData::class, 'sectionH'],
        'I'  => [EhraQuestionsGHIJData::class, 'sectionI'],
        'J'  => [EhraQuestionsGHIJData::class, 'sectionJ'],
    ];

    public function run(): void
    {
        // ── Idempotency check ────────────────────────────────
        if (QuestionnaireVersion::where('version_code', 'EHRA-2026')->exists()) {
            $this->command?->warn('⚠  Kuesioner EHRA-2026 sudah ada. Skipping seeder.');
            return;
        }

        DB::transaction(function () {
            $this->command?->info('🚀 Memulai seeding Kuesioner EHRA 2026...');

            // ── 1. Questionnaire Version ─────────────────────
            $admin = User::where('role', 'admin')->first();
            $adminId = $admin?->id ?? User::first()?->id;

            if (!$adminId) {
                $this->command?->error('❌ Tidak ada user admin. Jalankan UserSeeder terlebih dahulu.');
                return;
            }

            $version = QuestionnaireVersion::create([
                'version_code' => 'EHRA-2026',
                'title'        => 'Kuesioner Penilaian Risiko Kesehatan Lingkungan (EHRA) 2025/2029',
                'description'  => 'Kuesioner standar Environmental Health Risk Assessment (EHRA) untuk penilaian risiko sanitasi permukiman. Digunakan dalam Program Percepatan Pembangunan Sanitasi Permukiman (PPSP).',
                'valid_from'   => '2026-01-01',
                'valid_until'  => '2029-12-31',
                'is_active'    => true,
                'created_by'   => $adminId,
            ]);

            $this->command?->info("  ✅ Version: {$version->version_code}");

            // ── 2. IRS Components ────────────────────────────
            $irsMap = $this->seedIrsComponents($version);
            $this->command?->info('  ✅ IRS Components: ' . count($irsMap));

            // ── 3. Sections ──────────────────────────────────
            $sectionMap = $this->seedSections($version, $irsMap);
            $this->command?->info('  ✅ Sections: ' . count($sectionMap));

            // ── 4. Questions & Options ───────────────────────
            $totalQuestions = 0;
            $totalOptions = 0;

            foreach (self::SECTION_QUESTION_MAP as $sectionCode => $callable) {
                if (!isset($sectionMap[$sectionCode])) {
                    $this->command?->warn("  ⚠  Section {$sectionCode} not found, skipping.");
                    continue;
                }

                $sectionId = $sectionMap[$sectionCode];
                $questions = call_user_func($callable);

                [$qCount, $oCount] = $this->seedQuestions($sectionId, $questions);
                $totalQuestions += $qCount;
                $totalOptions += $oCount;

                $this->command?->info("    📋 Section {$sectionCode}: {$qCount} questions, {$oCount} options");
            }

            $this->command?->info("  ✅ Total Questions: {$totalQuestions}");
            $this->command?->info("  ✅ Total Options: {$totalOptions}");
            $this->command?->info('🎉 Seeding Kuesioner EHRA 2026 selesai!');
        });
    }

    /**
     * Seed IRS Components. Returns map [key => id].
     */
    private function seedIrsComponents(QuestionnaireVersion $version): array
    {
        $map = [];

        foreach (EhraSectionsData::irsComponents() as $comp) {
            $irs = IrsComponent::create([
                'version_id' => $version->id,
                'key'        => $comp['key'],
                'label'      => $comp['label'],
                'sort_order' => $comp['sort_order'],
            ]);
            $map[$comp['key']] = $irs->id;
        }

        return $map;
    }

    /**
     * Seed Sections. Returns map [code => id].
     */
    private function seedSections(QuestionnaireVersion $version, array $irsMap): array
    {
        $map = [];

        foreach (EhraSectionsData::sections() as $sec) {
            $section = Section::create([
                'version_id'       => $version->id,
                'code'             => $sec['code'],
                'title'            => $sec['title'],
                'description'      => $sec['description'],
                'sort_order'       => $sec['sort_order'],
                'is_irs_component' => $sec['is_irs'],
                'irs_component_id' => $sec['is_irs'] ? ($irsMap[$sec['irs_key']] ?? null) : null,
            ]);
            $map[$sec['code']] = $section->id;
        }

        return $map;
    }

    /**
     * Seed questions and their options for a given section.
     * Handles parent-child (sub-question) relationships.
     *
     * Children sort_order dihitung otomatis:
     *   child_sort = parent_sort * 100 + relative_sort
     *
     * Contoh: B.13 (sort=13) → B.13.A (1301), B.13.B (1302), ...
     *         B.14 (sort=14) → B.14.A (1401), B.14.B (1402), ...
     *
     * Ini menjamin urutan global yang benar meskipun query flat
     * (tanpa hierarki parent-child), sekaligus children tetap
     * mengelompok di bawah parent-nya.
     *
     * @return array{int, int} [question_count, option_count]
     */
    private function seedQuestions(string $sectionId, array $questionsData): array
    {
        $qCount = 0;
        $oCount = 0;

        foreach ($questionsData as $qData) {
            $parentSort = $qData['sort'];

            $question = Question::create([
                'section_id'         => $sectionId,
                'code'               => $qData['code'],
                'question_text'      => $qData['text'],
                'question_type'      => $qData['type'],
                'is_required'        => $qData['required'] ?? true,
                'is_observation'     => $qData['obs'] ?? false,
                'sort_order'         => $parentSort * 100,
                'skip_logic'         => $qData['skip'] ?? null,
                'parent_question_id' => null,
            ]);
            $qCount++;

            // Seed options
            $oCount += $this->seedOptions($question->id, $qData['options'] ?? []);

            // Seed child questions (e.g., B.13.A, B.13.B, etc.)
            // sort_order = parent_sort * 100 + child_relative_sort
            // sehingga B.13.A = 1301, B.13.B = 1302, dst.
            if (!empty($qData['children'])) {
                foreach ($qData['children'] as $childData) {
                    $childSort = ($parentSort * 100) + $childData['sort'];

                    $child = Question::create([
                        'section_id'         => $sectionId,
                        'code'               => $childData['code'],
                        'question_text'      => $childData['text'],
                        'question_type'      => $childData['type'],
                        'is_required'        => false,
                        'is_observation'     => false,
                        'sort_order'         => $childSort,
                        'skip_logic'         => null,
                        'parent_question_id' => $question->id,
                    ]);
                    $qCount++;

                    // Seed child options jika ada
                    if (!empty($childData['options'])) {
                        $oCount += $this->seedOptions($child->id, $childData['options']);
                    }
                }
            }
        }

        return [$qCount, $oCount];
    }

    /**
     * Seed options for a question.
     *
     * @return int Number of options created
     */
    private function seedOptions(string $questionId, array $optionsData): int
    {
        $count = 0;

        foreach ($optionsData as $index => $opt) {
            QuestionOption::create([
                'question_id'  => $questionId,
                'option_value' => $opt['value'],
                'option_label' => $opt['label'],
                'sort_order'   => $index + 1,
                'is_risk_flag' => $opt['risk'] ?? false,
                'risk_weight'  => isset($opt['risk']) && $opt['risk'] ? ($opt['risk_weight'] ?? null) : null,
            ]);
            $count++;
        }

        return $count;
    }
}
