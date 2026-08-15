<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SurveyResponse;
use App\Models\Village;
use App\Models\VillageIrsResult;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyResultController extends Controller
{
    /**
     * Display a listing of the survey responses grouped by Village.
     */
    public function index(Request $request)
    {
        $versionId = $request->query('version_id');
        $status = $request->query('status');
        $search = $request->query('search');

        // Query villages that have survey responses matching the filters
        $villageQuery = Village::whereHas('surveyResponses', function ($q) use ($versionId, $status, $search) {
            if ($versionId) {
                $q->where('version_id', $versionId);
            }
            if ($status) {
                $q->where('status', $status);
            }
            if ($search) {
                $q->where(function ($sq) use ($search) {
                    $sq->where('respondent_code', 'like', "%{$search}%")
                      ->orWhereHas('enumerator', function ($eq) use ($search) {
                          $eq->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('village', function ($vq) use ($search) {
                          $vq->where('name', 'like', "%{$search}%");
                      });
                });
            }
        })
        ->with(['district.city'])
        ->withCount(['surveyResponses as total_surveys' => function ($q) use ($versionId, $status, $search) {
            if ($versionId) $q->where('version_id', $versionId);
            if ($status) $q->where('status', $status);
            if ($search) {
                $q->where(function ($sq) use ($search) {
                    $sq->where('respondent_code', 'like', "%{$search}%")
                      ->orWhereHas('enumerator', function ($eq) use ($search) {
                          $eq->where('name', 'like', "%{$search}%");
                      });
                });
            }
        }]);

        $user = auth()->user();
        if ($user && $user->isEnumerator()) {
            $assignedVillageIds = $user->assignedVillages()->pluck('villages.id');
            $villageQuery->whereIn('id', $assignedVillageIds);
        }

        $villages = $villageQuery->orderBy('name')->paginate(10)->withQueryString();

        // Transform villages data for index list
        $villages->getCollection()->transform(function ($village) use ($versionId) {
            // Fetch IRS result snapshot for this village
            $irsResult = VillageIrsResult::where('village_id', $village->id)
                ->when($versionId, fn($q) => $q->where('version_id', $versionId))
                ->with('riskAspectCategory')
                ->orderBy('created_at', 'desc')
                ->first();

            return [
                'id' => $village->id,
                'name' => $village->name,
                'district_name' => $village->district->name ?? '-',
                'total_surveys' => $village->total_surveys,
                'irs_result' => $irsResult ? [
                    'irs_total' => $irsResult->irs_total,
                    'category_name' => $irsResult->riskAspectCategory->category_name ?? 'Belum Terkategori',
                    'color' => $irsResult->riskAspectCategory->color ?? '#9ca3af',
                ] : null,
            ];
        });

        $versions = \App\Models\QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title']);

        return Inertia::render('Admin/SurveyResults/Index', [
            'villages' => $villages,
            'versions' => $versions,
            'filters' => $request->only(['search', 'status', 'version_id']),
        ]);
    }

    /**
     * Display a listing of survey responses for a specific village.
     */
    public function villageResponses(Request $request, $villageId)
    {
        $village = Village::with('district.city.province')->findOrFail($villageId);

        $user = auth()->user();
        if ($user && $user->isEnumerator()) {
            $assignedVillageIds = $user->assignedVillages()->pluck('villages.id');
            if (!$assignedVillageIds->contains($villageId)) {
                abort(403, 'Anda tidak memiliki akses ke desa ini.');
            }
        }

        $versionId = $request->query('version_id');
        $status = $request->query('status');
        $search = $request->query('search');

        // Fetch IRS calculation snapshot for this village
        $irsResult = VillageIrsResult::where('village_id', $villageId)
            ->when($versionId, fn($q) => $q->where('version_id', $versionId))
            ->with('riskAspectCategory')
            ->orderBy('created_at', 'desc')
            ->first();

        // Build query for survey responses in this village
        $query = SurveyResponse::where('village_id', $villageId)
            ->with(['enumerator', 'version'])
            ->latest('submitted_at');

        if ($versionId) {
            $query->where('version_id', $versionId);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if ($search) {
            $query->where(function ($sq) use ($search) {
                $sq->where('respondent_code', 'like', "%{$search}%")
                  ->orWhereHas('enumerator', function ($eq) use ($search) {
                      $eq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $responses = $query->paginate(15)->withQueryString();
        $versions = \App\Models\QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title']);

        $totalSurveys = SurveyResponse::where('village_id', $villageId)
            ->when($versionId, fn($q) => $q->where('version_id', $versionId))
            ->count();

        return Inertia::render('Admin/SurveyResults/VillageResponses', [
            'village' => [
                'id' => $village->id,
                'name' => $village->name,
                'district_name' => $village->district->name ?? '-',
                'city_name' => $village->district->city->name ?? '-',
                'province_name' => $village->district->city->province->name ?? '-',
                'total_surveys' => $totalSurveys,
            ],
            'irsResult' => $irsResult ? [
                'irs_total' => $irsResult->irs_total,
                'category_name' => $irsResult->riskAspectCategory->category_name ?? 'Belum Terkategori',
                'color' => $irsResult->riskAspectCategory->color ?? '#9ca3af',
            ] : null,
            'responses' => $responses,
            'versions' => $versions,
            'filters' => $request->only(['search', 'status', 'version_id']),
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

        $user = auth()->user();
        if ($user && $user->isEnumerator()) {
            $assignedVillageIds = $user->assignedVillages()->pluck('villages.id')->toArray();
            if (!in_array($response->village_id, $assignedVillageIds)) {
                abort(403, 'Akses ditolak. Anda hanya dapat melihat survei dari wilayah tugas Anda.');
            }
        }

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

        $user = auth()->user();
        if ($user && $user->isEnumerator()) {
            $assignedVillageIds = $user->assignedVillages()->pluck('villages.id')->toArray();
            if (!in_array($response->village_id, $assignedVillageIds)) {
                abort(403, 'Akses ditolak.');
            }
        }
        $response->update(['status' => $request->status]);

        return back()->with('success', 'Status survei berhasil diperbarui.');
    }

    public function edit($id)
    {
        $response = SurveyResponse::with(['answers'])->findOrFail($id);
        
        $user = auth()->user();
        if ($user && $user->isEnumerator()) {
            $assignedVillageIds = $user->assignedVillages()->pluck('villages.id')->toArray();
            if (!in_array($response->village_id, $assignedVillageIds)) {
                abort(403, 'Akses ditolak.');
            }
        }
        
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

            $user = auth()->user();
            if ($user && $user->isEnumerator()) {
                $assignedVillageIds = $user->assignedVillages()->pluck('villages.id')->toArray();
                if (!in_array($surveyResponse->village_id, $assignedVillageIds)) {
                    abort(403, 'Akses ditolak.');
                }
            }

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

            $user = auth()->user();
            if ($user && $user->isEnumerator()) {
                abort(403, 'Hanya admin yang dapat melakukan kalkulasi ulang IRS.');
            }
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
            
            $user = auth()->user();
            if ($user && $user->isEnumerator()) {
                abort(403, 'Hanya admin yang dapat menghapus data survei.');
            }
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
