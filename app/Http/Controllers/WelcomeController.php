<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RiskAspectCategory;
use App\Models\QuestionnaireVersion;
use App\Models\VillageIrsResult;
use App\Models\City;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;


class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $categories = RiskAspectCategory::orderBy('lower_bound')->get();
        $versions = QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title', 'is_active']);

        $selectedVersionId = $request->query('version');

        if (!$selectedVersionId) {
            $activeVersion = $versions->firstWhere('is_active', true) ?? $versions->first();
            $selectedVersionId = $activeVersion->id ?? null;
        }

        $mapData = VillageIrsResult::with(['village.district.city','riskAspectCategory'])
                    ->where('is_published',true)
                    ->when($selectedVersionId, function($query) use ($selectedVersionId){
                        return $query->where('version_id',$selectedVersionId);
                    })
                    ->get()
                    ->mapWithKeys(function($result) use ($categories){
                        $risk = $result->riskAspectCategory;
                        if(!$risk && $result->irs_total !==null){
                            $risk = $categories->first(function($cat) use ($result){
                                return $result->irs_total >= $cat->lower_bound && $result->irs_total <= $cat->upper_bound;
                            });
                        }

                        $city = $result->village->district->city->name ?? '';
                        $district = $result->village->district->name ?? '';
                        $village = $result->village->name ?? '';
                        // $cityName - $result->vil
                        $key = strtoupper($city.'_'.$district.'_'.$village);
                        return [
                            $key => [
                                'risk' => $risk ? $risk->category_name : 'Belum Dihitung',
                                'color' => $risk ? $risk->color : '#cccccc',
                                'irs_total' => $result->irs_total,
                                'total_respondents' => $result->total_respondents,
                                'village_name' => $village,
                                'district_name' => $district,
                                'city_name' => $city,
                                'kemendagri_code' => $result->village->kemendagri_code ?? '',
                                'component_scores' => $result->component_scores ?? []


                            ]
                        ];
                    });

                    $riskCategories = $categories->map(fn($cat)=>[
                        'name' => $cat->category_name,
                        'color' => $cat->color,
                        'lower_bound' => $cat->lower_bound,
                        'upper_bound' => $cat->upper_bound,
                    ])->values();

                    $cityList = City::orderBy('name')->pluck('name')->values();

                    return Inertia::render('Welcome',[
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                        'laravelVersion' => Application::VERSION,
                        'phpVersion' => PHP_VERSION,
                        'mapData' => $mapData,
                        'riskCategories' => $riskCategories,
                        'cityList' => $cityList,
                        'versions' => $versions,
                        'selectedVersionId' => $selectedVersionId,
                    ]);

    }
}
