<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SurveyResponse;
use App\Models\Village;
use App\Models\VillageIrsResult;
use App\Models\RiskAspectCategory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Available survey years
        $yearsFromSurveys = SurveyResponse::selectRaw('YEAR(created_at) as year')
            ->whereNotNull('created_at')
            ->distinct()
            ->pluck('year');

        $yearsFromResults = VillageIrsResult::selectRaw('YEAR(created_at) as year')
            ->whereNotNull('created_at')
            ->distinct()
            ->pluck('year');

        $availableYears = $yearsFromSurveys->concat($yearsFromResults)
            ->filter()
            ->map(fn($y) => (int) $y)
            ->unique()
            ->sortDesc()
            ->values()
            ->toArray();

        $selectedYear = $request->query('year');
        if ($selectedYear && !in_array((int) $selectedYear, $availableYears)) {
            $selectedYear = null;
        }

        // 1. Total Survei
        $totalSurveys = SurveyResponse::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })->count();

        // 2. Desa Tersurvei
        $totalVillages = Village::count();
        $surveyedVillages = VillageIrsResult::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })->distinct('village_id')->count();

        // 3. Risiko Tinggi & Rata-rata Indeks Risiko
        $avgIrs = VillageIrsResult::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })->avg('irs_total') ?? 0;

        $categories = RiskAspectCategory::orderBy('lower_bound')->get();

        $averageRiskCategory = $categories->first(function ($cat) use ($avgIrs) {
            return $avgIrs >= $cat->lower_bound && $avgIrs <= $cat->upper_bound;
        });

        $highRiskCategories = $categories->filter(function ($cat) {
            return stripos($cat->category_name, 'Tinggi') !== false;
        })->pluck('id');

        $highRiskCount = VillageIrsResult::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })->whereIn('risk_aspect_category_id', $highRiskCategories)->count();
        $highRiskPercentage = $surveyedVillages > 0 ? round(($highRiskCount / $surveyedVillages) * 100) : 0;

        $selectedVersionId = $request->query('version_id');
        $availableVersions = \App\Models\QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title']);

        // 4. Distribusi Risiko
        $totalRiskDistCount = VillageIrsResult::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })
            ->when($selectedVersionId, function ($q) use ($selectedVersionId) {
                $q->where('version_id', $selectedVersionId);
            })
            ->count();

        $riskDistribution = VillageIrsResult::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })
            ->when($selectedVersionId, function ($q) use ($selectedVersionId) {
                $q->where('version_id', $selectedVersionId);
            })
            ->with('riskAspectCategory')
            ->select('risk_aspect_category_id', DB::raw('count(*) as total'))
            ->groupBy('risk_aspect_category_id')
            ->get()
            ->map(function ($group) use ($totalRiskDistCount) {
                $category = $group->riskAspectCategory;
                return [
                    'name' => $category ? $category->category_name : 'Belum Dihitung',
                    'color' => $category ? $category->color : '#cccccc',
                    'count' => $group->total,
                    'pct' => $totalRiskDistCount > 0 ? round(($group->total / $totalRiskDistCount) * 100) : 0,
                ];
            });

        // 5. Survei Terbaru
        $recentSurveys = SurveyResponse::when($selectedYear, function ($q) use ($selectedYear) {
            $q->whereYear('created_at', $selectedYear);
        })
            ->with(['village.district', 'enumerator'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($survey) {
                return [
                    'id' => $survey->id,
                    'village_name' => $survey->village->name ?? '-',
                    'district_name' => $survey->village->district->name ?? '-',
                    'enumerator_name' => $survey->enumerator->name ?? '-',
                    'date' => $survey->created_at->format('d M Y, H:i'),
                    'status' => $survey->status ?? 'Selesai',
                ];
            });

        // 6. Progress Survei (Grafik 12 Bulan)
        $targetYear = $selectedYear ?: now()->year;

        $months = collect(range(1, 12))->map(function ($m) use ($targetYear) {
            return sprintf('%04d-%02d', $targetYear, $m);
        });

        $progressRaw = SurveyResponse::select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('count(*) as total'))
            ->whereYear('created_at', $targetYear)
            ->groupBy('month')
            ->pluck('total', 'month');

        $surveyProgress = $months->map(function ($month) use ($progressRaw) {
            return [
                'label' => Carbon::createFromFormat('Y-m', $month)->translatedFormat('M'),
                'value' => $progressRaw->get($month, 0),
            ];
        })->toArray();

        // Calculate height percentage for the chart
        $maxValue = max(array_column($surveyProgress, 'value')) ?: 1;
        foreach ($surveyProgress as &$p) {
            $p['height'] = round(($p['value'] / $maxValue) * 100);
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_surveys' => $totalSurveys,
                'total_villages' => $totalVillages,
                'surveyed_villages' => $surveyedVillages,
                'high_risk_count' => $highRiskCount,
                'high_risk_percentage' => $highRiskPercentage,
                'average_risk_name' => $averageRiskCategory ? $averageRiskCategory->category_name : 'Belum Ada',
                'average_risk_color' => $averageRiskCategory ? $averageRiskCategory->color : '#1a5c3a',
            ],
            'riskDistribution' => $riskDistribution,
            'recentSurveys' => $recentSurveys,
            'surveyProgress' => $surveyProgress,
            'availableYears' => $availableYears,
            'selectedYear' => $selectedYear ? (string) $selectedYear : '',
            'availableVersions' => $availableVersions,
            'selectedVersionId' => $selectedVersionId ? (string) $selectedVersionId : '',
        ]);
    }
}
