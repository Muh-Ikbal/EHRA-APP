<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Village;
use App\Models\QuestionnaireVersion;
use App\Models\SurveyResponse;
use App\Models\Section;
use App\Models\Answer;
use Illuminate\Support\Str;

class SurveyResponseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        if (!$admin) return;

        $version = QuestionnaireVersion::first();
        if (!$version) return;

        $villages = Village::inRandomOrder()->take(5)->get();
        if ($villages->isEmpty()) return;

        $sections = Section::where('version_id', $version->id)
            ->with('questions.options')
            ->get();

        $this->command->info("Membuat 10 dummy survey responses...");

        for ($i = 0; $i < 10; $i++) {
            $village = $villages->random();
            $seq = $i + 1;
            $code = "R-" . strtoupper(Str::random(4)) . "-" . str_pad($seq, 3, '0', STR_PAD_LEFT);

            $response = SurveyResponse::create([
                'version_id' => $version->id,
                'enumerator_id' => $admin->id,
                'village_id' => $village->id,
                'respondent_code' => $code,
                'respondent_seq' => $seq,
                'status' => 'submitted',
                'gps_lat' => $village->centroid_lat ?? -4.0,
                'gps_lng' => $village->centroid_lng ?? 122.0,
                'submitted_at' => now()->subDays(rand(1, 30))->subHours(rand(1, 24)),
            ]);

            // Create some random answers
            foreach ($sections as $section) {
                foreach ($section->questions as $question) {
                    // Answer about 80% of questions to simulate real data
                    if (rand(1, 100) <= 80) {
                        $answerData = [
                            'response_id' => $response->id,
                            'question_id' => $question->id,
                        ];

                        if ($question->options->isNotEmpty()) {
                            $option = $question->options->random();
                            $answerData['answer_code'] = $option->option_value;
                            $answerData['answer_value'] = $option->option_label;
                            $answerData['is_flagged_risk'] = $option->is_risk_flag;
                        } else {
                            if (in_array($question->type, ['text', 'textarea'])) {
                                $answerData['answer_value'] = "Jawaban teks " . Str::random(10);
                            } elseif ($question->type === 'number') {
                                $answerData['answer_value'] = (string) rand(1, 100);
                            }
                        }

                        if (isset($answerData['answer_code']) || isset($answerData['answer_value'])) {
                            Answer::create($answerData);
                        }
                    }
                }
            }
        }

        $this->command->info("10 dummy responses berhasil dibuat.");
    }
}
