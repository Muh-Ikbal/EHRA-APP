<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\DashboardController;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Survey Conduct Routes
    Route::get('/survey/conduct', [\App\Http\Controllers\SurveyConductController::class, 'index'])->name('survey.conduct');
    Route::post('/survey/conduct/{version}', [\App\Http\Controllers\SurveyConductController::class, 'store'])->name('survey.store');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Survey Results Routes (Accessible to Admin & Enumerator)
        Route::get('/survey-results', [\App\Http\Controllers\Admin\SurveyResultController::class, 'index'])->name('survey-results.index');
        Route::get('/survey-results/village/{villageId}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'villageResponses'])->name('survey-results.village');
        Route::get('/survey-results/{id}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'show'])->name('survey-results.show');
        Route::get('/survey-results/{id}/edit', [\App\Http\Controllers\Admin\SurveyResultController::class, 'edit'])->name('survey-results.edit');
        Route::put('/survey-results/{id}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'update'])->name('survey-results.update');
        Route::patch('/survey-results/{id}/status', [\App\Http\Controllers\Admin\SurveyResultController::class, 'updateStatus'])->name('survey-results.updateStatus');
        Route::post('/survey-results/{id}/recalculate-irs', [\App\Http\Controllers\Admin\SurveyResultController::class, 'recalculateIrs'])->name('survey-results.recalculate');
        Route::delete('/survey-results/{id}', [\App\Http\Controllers\Admin\SurveyResultController::class, 'destroy'])->name('survey-results.destroy');

        // Admin Only Routes
        Route::middleware('role:admin')->group(function () {
            // Location Management Routes
            Route::get('/locations', [\App\Http\Controllers\Admin\LocationController::class, 'index'])->name('locations.index');
            Route::post('/locations', [\App\Http\Controllers\Admin\LocationController::class, 'store'])->name('locations.store');
            Route::post('/locations/{id}', [\App\Http\Controllers\Admin\LocationController::class, 'update'])->name('locations.update');
            Route::delete('/locations/{id}', [\App\Http\Controllers\Admin\LocationController::class, 'destroy'])->name('locations.destroy');

            // Questionnaire Routes
            Route::get('/questionnaires', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'index'])->name('questionnaires.index');
            Route::post('/questionnaires', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'store'])->name('questionnaires.store');
            Route::post('/questionnaires/{version}/toggle', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'toggleActive'])->name('questionnaires.toggleActive');
            Route::put('/questionnaires/{version}', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'update'])->name('questionnaires.update');
            Route::post('/questionnaires/{version}/duplicate', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'duplicate'])->name('questionnaires.duplicate');
            Route::delete('/questionnaires/{version}', [\App\Http\Controllers\Admin\QuestionnaireController::class, 'destroy'])->name('questionnaires.destroy');

            // Questionnaire Builder Routes
            Route::get('/questionnaires/{version}/builder', [\App\Http\Controllers\Admin\QuestionnaireBuilderController::class, 'edit'])->name('questionnaires.builder.edit');
            Route::post('/questionnaires/{version}/builder', [\App\Http\Controllers\Admin\QuestionnaireBuilderController::class, 'save'])->name('questionnaires.builder.save');

            // Questionnaire IRS Weight Routes
            Route::get('/questionnaires/{version}/weights', [\App\Http\Controllers\Admin\IrsWeightController::class, 'index'])->name('questionnaires.weights.index');
            Route::post('/questionnaires/{version}/weights', [\App\Http\Controllers\Admin\IrsWeightController::class, 'store'])->name('questionnaires.weights.store');
            Route::delete('/questionnaires/weights/{id}', [\App\Http\Controllers\Admin\IrsWeightController::class, 'destroy'])->name('questionnaires.weights.destroy');

            // Risk Aspect Categories
            Route::resource('/risk-categories', \App\Http\Controllers\RiskAspectCategoryController::class);

            // Enumerators
            Route::resource('/enumerators', \App\Http\Controllers\Admin\EnumeratorController::class);

            // Users Management
            Route::post('/users/{user}/toggle-active', [\App\Http\Controllers\Admin\UserController::class, 'toggleActive'])->name('users.toggleActive');
            Route::resource('/users', \App\Http\Controllers\Admin\UserController::class)->except(['create', 'show', 'edit']);
        });

    });
});

require __DIR__.'/auth.php';
