<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $mapData = \App\Models\VillageIrsResult::with(['village', 'riskAspectCategory'])
        ->where('is_published', true)
        ->get()
        ->mapWithKeys(function ($result) {
            return [
                $result->village->name => [
                    'risk' => $result->riskAspectCategory ? $result->riskAspectCategory->category_name : 'Belum Dihitung',
                    'color' => $result->riskAspectCategory ? $result->riskAspectCategory->color : '#cccccc',
                    'irs_total' => $result->irs_total,
                    'total_respondents' => $result->total_respondents,
                ]
            ];
        });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'mapData' => $mapData,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Survey Conduct Routes
    Route::get('/survey/conduct', [\App\Http\Controllers\SurveyConductController::class, 'index'])->name('survey.conduct');
    Route::post('/survey/conduct/{version}', [\App\Http\Controllers\SurveyConductController::class, 'store'])->name('survey.store');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Location Management Routes
        Route::get('/locations', [\App\Http\Controllers\Admin\LocationController::class, 'index'])->name('locations.index');
        Route::post('/locations', [\App\Http\Controllers\Admin\LocationController::class, 'store'])->name('locations.store');
        Route::post('/locations/{id}', [\App\Http\Controllers\Admin\LocationController::class, 'update'])->name('locations.update');
        Route::delete('/locations/{id}', [\App\Http\Controllers\Admin\LocationController::class, 'destroy'])->name('locations.destroy');

        // Questionnaire Routes
        Route::get('/questionnaires', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'index'])->name('questionnaires.index');
        Route::post('/questionnaires', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'store'])->name('questionnaires.store');
        Route::post('/questionnaires/{version}/toggle', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'toggleActive'])->name('questionnaires.toggleActive');
        Route::delete('/questionnaires/{version}', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'destroy'])->name('questionnaires.destroy');

        // Questionnaire Builder Routes
        Route::get('/questionnaires/{version}/builder', [\App\Http\Controllers\Admin\QuestionnaireBuilderController::class, 'edit'])->name('questionnaires.builder.edit');
        Route::post('/questionnaires/{version}/builder', [\App\Http\Controllers\Admin\QuestionnaireBuilderController::class, 'save'])->name('questionnaires.builder.save');

        // Questionnaire IRS Weight Routes
        Route::get('/questionnaires/{version}/weights', [\App\Http\Controllers\Admin\IrsWeightController::class, 'index'])->name('questionnaires.weights.index');
        Route::post('/questionnaires/{version}/weights', [\App\Http\Controllers\Admin\IrsWeightController::class, 'store'])->name('questionnaires.weights.store');
        Route::delete('/questionnaires/weights/{id}', [\App\Http\Controllers\Admin\IrsWeightController::class, 'destroy'])->name('questionnaires.weights.destroy');
        // Survey Results Routes
        Route::get('/survey-results', [\App\Http\Controllers\Admin\SurveyResultController::class, 'index'])->name('survey-results.index');
        Route::get('/survey-results/{id}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'show'])->name('survey-results.show');
        Route::get('/survey-results/{id}/edit', [\App\Http\Controllers\Admin\SurveyResultController::class, 'edit'])->name('survey-results.edit');
        Route::put('/survey-results/{id}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'update'])->name('survey-results.update');
        Route::patch('/survey-results/{id}/status', [\App\Http\Controllers\Admin\SurveyResultController::class, 'updateStatus'])->name('survey-results.updateStatus');
        Route::post('/survey-results/{id}/recalculate-irs', [\App\Http\Controllers\Admin\SurveyResultController::class, 'recalculateIrs'])->name('survey-results.recalculate');

        // Risk Aspect Categories
        Route::resource('/risk-categories', \App\Http\Controllers\RiskAspectCategoryController::class);

        // Enumerators
        Route::resource('/enumerators', \App\Http\Controllers\Admin\EnumeratorController::class);
    });
});

require __DIR__.'/auth.php';
