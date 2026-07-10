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
        // 1. Total Survei
        $totalSurveys = SurveyResponse::count();

        // 2. Desa Tersurvei
        $totalVillages = Village::count();
        $surveyedVillages = VillageIrsResult::distinct('village_id')->count();

        // 3. Risiko Tinggi & Rata-rata Indeks Risiko
        $avgIrs = VillageIrsResult::avg('irs_total') ?? 0;
        $categories = RiskAspectCategory::orderBy('lower_bound')->get();
        
        $averageRiskCategory = $categories->first(function ($cat) use ($avgIrs) {
            return $avgIrs >= $cat->lower_bound && $avgIrs <= $cat->upper_bound;
        });

        $highRiskCategories = $categories->filter(function ($cat) {
            return stripos($cat->category_name, 'Tinggi') !== false;
        })->pluck('id');

        $highRiskCount = VillageIrsResult::whereIn('risk_aspect_category_id', $highRiskCategories)->count();
        $highRiskPercentage = $surveyedVillages > 0 ? round(($highRiskCount / $surveyedVillages) * 100) : 0;

        // 4. Distribusi Risiko
        $riskDistribution = VillageIrsResult::with('riskAspectCategory')
            ->select('risk_aspect_category_id', DB::raw('count(*) as total'))
            ->groupBy('risk_aspect_category_id')
            ->get()
            ->map(function ($group) use ($surveyedVillages, $categories) {
                $category = $group->riskAspectCategory;
                return [
                    'name' => $category ? $category->category_name : 'Belum Dihitung',
                    'color' => $category ? $category->color : '#cccccc',
                    'count' => $group->total,
                    'pct' => $surveyedVillages > 0 ? round(($group->total / $surveyedVillages) * 100) : 0,
                ];
            });

        // 5. Survei Terbaru
        $recentSurveys = SurveyResponse::with(['village.district', 'enumerator'])
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

        // 6. Progress Survei (Grafik 6 Bulan Terakhir)
        $months = collect(range(5, 0))->map(function ($i) {
            return now()->subMonths($i)->format('Y-m');
        });
        
        $progressRaw = SurveyResponse::select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
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
        ]);
    }
}
