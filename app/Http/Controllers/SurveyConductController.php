<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QuestionnaireVersion;
use App\Models\SurveyResponse;
use App\Models\Answer;
use App\Models\Village;
use App\Models\District;
use App\Models\City;
use App\Models\Province;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SurveyConductController extends Controller
{
    public function index()
    {
        // Get the active questionnaire version
        $version = QuestionnaireVersion::where('is_active', true)
            ->with([
                'sections' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'sections.questions' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'sections.questions.options' => function ($query) {
                    $query->orderBy('sort_order');
                }
            ])
            ->first();

        if (!$version) {
            return redirect()->route('dashboard')->with('error', 'Tidak ada kuesioner aktif saat ini.');
        }

        return Inertia::render('Survey/Conduct', [
            'version' => $version
        ]);
    }

    public function store(Request $request, QuestionnaireVersion $version)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            // Get or create a dummy village for MVP
            $village = Village::first();
            if (!$village) {
                $province = Province::create(['name' => 'SULAWESI TENGGARA']);
                $city = City::create(['province_id' => $province->id, 'name' => 'KENDARI', 'type' => 'kota']);
                $district = District::create(['city_id' => $city->id, 'name' => 'KADIA']);
                $village = Village::create(['district_id' => $district->id, 'name' => 'BONGGOEYA', 'status' => 'kelurahan']);
            }

            // Generate Respondent Code (e.g. VIL-DATE-SEQ)
            $villageCount = SurveyResponse::where('village_id', $village->id)->count();
            $seq = $villageCount + 1;
            $respondentCode = 'R-' . strtoupper(substr($village->name, 0, 3)) . '-' . str_pad($seq, 4, '0', STR_PAD_LEFT);

            // Create Survey Response
            $surveyResponse = SurveyResponse::create([
                'version_id' => $version->id,
                'enumerator_id' => Auth::id(),
                'village_id' => $village->id,
                'respondent_code' => $respondentCode,
                'respondent_seq' => $seq,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // Create Answers
            foreach ($validated['answers'] as $questionId => $value) {
                if (empty($value)) continue;

                // Simple handling for arrays (multi_choice) vs string
                if (is_array($value)) {
                    Answer::create([
                        'response_id' => $surveyResponse->id,
                        'question_id' => $questionId,
                        'answer_codes' => json_encode($value),
                    ]);
                } else {
                    Answer::create([
                        'response_id' => $surveyResponse->id,
                        'question_id' => $questionId,
                        'answer_value' => $value,
                        'answer_code' => is_numeric($value) ? $value : null, // Simplistic mapping
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Survei berhasil dikirim! (Kode Responden: ' . $respondentCode . ')');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan survei: ' . $e->getMessage()]);
        }
    }
}
