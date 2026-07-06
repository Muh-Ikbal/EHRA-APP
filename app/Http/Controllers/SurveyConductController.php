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

        // Fetch authorized villages for the user
        $user = Auth::user();
        $assignedVillages = collect();

        if ($user->role === 'admin') {
            // Admins can survey any village for testing purposes
            $assignedVillages = Village::with('district.city.province')->orderBy('name')->get();
        } else {
            // Enumerators can only survey assigned villages
            $villageIds = \App\Models\EnumeratorVillage::where('user_id', $user->id)
                ->where('version_id', $version->id)
                ->pluck('village_id');
            $assignedVillages = Village::with('district.city.province')->whereIn('id', $villageIds)->orderBy('name')->get();
        }

        return Inertia::render('Survey/Conduct', [
            'version' => $version,
            'assignedVillages' => $assignedVillages
        ]);
    }

    public function store(Request $request, QuestionnaireVersion $version)
    {
        $validated = $request->validate([
            'village_id' => 'required|exists:villages,id',
            'answers' => 'required|array',
        ]);

        $user = Auth::user();
        
        // Verify authorization for enumerator
        if ($user->role !== 'admin') {
            $isAssigned = \App\Models\EnumeratorVillage::where('user_id', $user->id)
                ->where('version_id', $version->id)
                ->where('village_id', $validated['village_id'])
                ->exists();
                
            if (!$isAssigned) {
                return redirect()->back()->withErrors(['village_id' => 'Anda tidak ditugaskan untuk melakukan survei di desa ini.']);
            }
        }

        DB::beginTransaction();

        try {
            $village = Village::findOrFail($validated['village_id']);

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
                        'answer_codes' => $value,
                    ]);
                } else {
                    $answerCodeStr = (string)$value;
                    Answer::create([
                        'response_id' => $surveyResponse->id,
                        'question_id' => $questionId,
                        'answer_value' => $value,
                        'answer_code' => (is_numeric($value) && strlen($answerCodeStr) <= 10) ? $answerCodeStr : null, // Prevent data too long (max 10)
                    ]);
                }
            }

            DB::commit();

            // Trigger EHRA Calculation for this village and version
            $calcService = new \App\Services\EhraCalculationService();
            $calcService->calculateForVillage($village->id, $version->id);

            return redirect()->route('dashboard')->with('success', 'Survei berhasil dikirim! (Kode Responden: ' . $respondentCode . ')');

        } catch (\Exception $e) {
            DB::rollBack();
            
            \Illuminate\Support\Facades\Log::error('Gagal menyimpan survei', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'village_id' => $request->village_id ?? null,
            ]);

            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan survei: ' . $e->getMessage()]);
        }
    }
}
