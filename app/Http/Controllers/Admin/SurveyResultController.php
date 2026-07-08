<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SurveyResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyResultController extends Controller
{
    /**
     * Display a listing of the survey responses.
     */
    public function index(Request $request)
    {
        $query = SurveyResponse::with(['enumerator', 'village', 'version'])
            ->latest('submitted_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('respondent_code', 'like', "%{$search}%")
                  ->orWhereHas('village', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('enumerator', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $responses = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/SurveyResults/Index', [
            'responses' => $responses,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified survey response.
     */
    public function show($id)
    {
        $response = SurveyResponse::with([
            'enumerator',
            'village.district.city.province',
            'version',
            'answers.question'
        ])->findOrFail($id);

        // Group answers by section to make it easier for the frontend to render
        $sections = \App\Models\Section::where('version_id', $response->version_id)
            ->orderBy('sort_order')
            ->with(['questions' => function ($q) {
                $q->orderBy('sort_order');
            }])
            ->get();

        // Fetch Village IRS Result if available
        $irsResult = \App\Models\VillageIrsResult::with('riskAspectCategory')
            ->where('village_id', $response->village_id)
            ->where('version_id', $response->version_id)
            ->first();

        // Render the view with Inertia
        return Inertia::render('Admin/SurveyResults/Show', [
            'response' => $response,
            'sections' => $sections,
            'irsResult' => $irsResult,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:draft,submitted,reviewed,approved'
        ]);

        $response = SurveyResponse::findOrFail($id);
        $response->update(['status' => $request->status]);

        return back()->with('success', 'Status survei berhasil diperbarui.');
    }

    public function edit($id)
    {
        $response = SurveyResponse::with(['answers'])->findOrFail($id);
        
        $version = \App\Models\QuestionnaireVersion::where('id', $response->version_id)
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

        // Convert answers to key-value pairs
        $initialAnswers = [];
        foreach ($response->answers as $ans) {
            if ($ans->answer_codes) {
                // If it was somehow saved as string (double encoded previously), decode it, otherwise use it directly
                $initialAnswers[$ans->question_id] = is_string($ans->answer_codes) ? json_decode($ans->answer_codes, true) : $ans->answer_codes;
            } else {
                $initialAnswers[$ans->question_id] = $ans->answer_value ?? $ans->answer_code;
            }
        }

        return Inertia::render('Admin/SurveyResults/Edit', [
            'version' => $version,
            'response' => $response,
            'initialAnswers' => $initialAnswers
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            $surveyResponse = SurveyResponse::findOrFail($id);

            // Delete old answers
            \App\Models\Answer::where('response_id', $surveyResponse->id)->delete();

            // Insert new answers
            foreach ($validated['answers'] as $questionId => $value) {
                if (empty($value) && $value !== '0' && $value !== 0) continue;

                if (is_array($value)) {
                    \App\Models\Answer::create([
                        'response_id' => $surveyResponse->id,
                        'question_id' => $questionId,
                        'answer_codes' => $value,
                    ]);
                } else {
                    $answerCodeStr = (string)$value;
                    \App\Models\Answer::create([
                        'response_id' => $surveyResponse->id,
                        'question_id' => $questionId,
                        'answer_value' => $value,
                        'answer_code' => (is_numeric($value) && strlen($answerCodeStr) <= 10) ? $answerCodeStr : null,
                    ]);
                }
            }

            \Illuminate\Support\Facades\DB::commit();

            // Recalculate IRS
            $calcService = new \App\Services\EhraCalculationService();
            $calcService->calculateForVillage($surveyResponse->village_id, $surveyResponse->version_id);

            return redirect()->route('admin.survey-results.show', $surveyResponse->id)->with('success', 'Jawaban survei berhasil diperbarui.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Gagal update survei', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Gagal memperbarui survei: ' . $e->getMessage()]);
        }
    }

    public function recalculateIrs($id)
    {
        try {
            $surveyResponse = SurveyResponse::findOrFail($id);
            $calcService = new \App\Services\EhraCalculationService();
            $calcService->calculateForVillage($surveyResponse->village_id, $surveyResponse->version_id);
            
            return back()->with('success', 'Perhitungan bobot IRS desa berhasil diperbarui secara manual.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gagal hitung ulang IRS', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['error' => 'Gagal menghitung ulang: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $response = SurveyResponse::findOrFail($id);
            $villageId = $response->village_id;
            $versionId = $response->version_id;

            // Delete answers first, then the response
            \App\Models\Answer::where('response_id', $response->id)->delete();
            $response->delete();

            // Recalculate IRS for the village after deletion
            $remaining = SurveyResponse::where('village_id', $villageId)
                ->where('version_id', $versionId)
                ->where('status', 'submitted')
                ->count();

            if ($remaining > 0) {
                $calcService = new \App\Services\EhraCalculationService();
                $calcService->calculateForVillage($villageId, $versionId);
            }

            return redirect()->route('admin.survey-results.index')->with('success', 'Data survei berhasil dihapus.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gagal hapus survei', [
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors(['error' => 'Gagal menghapus survei: ' . $e->getMessage()]);
        }
    }
}
