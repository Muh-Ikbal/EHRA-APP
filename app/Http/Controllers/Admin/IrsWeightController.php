<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QuestionnaireVersion;
use App\Models\IrsComponent;
use App\Models\IrsWeight;
use App\Models\Question;

class IrsWeightController extends Controller
{
    public function index($version_id)
    {
        $version = QuestionnaireVersion::findOrFail($version_id);
        
        // Fetch IRS components for this version
        $components = IrsComponent::where('version_id', $version_id)->orderBy('sort_order')->get();
        
        // Fetch choice questions for this version
        $questions = Question::with(['options', 'section'])
            ->whereIn('section_id', $version->sections()->pluck('id'))
            ->whereIn('question_type', ['single_choice', 'multi_choice'])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($q) {
                return [
                    'id' => $q->id,
                    'code' => $q->code,
                    'text' => $q->question_text,
                    'irs_component_id' => $q->section ? $q->section->irs_component_id : null,
                    'options' => $q->options->map(function ($o) {
                        return [
                            'id' => $o->id,
                            'value' => $o->option_value,
                            'label' => $o->option_label
                        ];
                    })->values()
                ];
            })->values();

        $weights = IrsWeight::where('version_id', $version_id)->get();

        return Inertia::render('Admin/Questionnaire/Weights', [
            'version' => $version,
            'components' => $components,
            'questions' => $questions,
            'weights' => $weights
        ]);
    }

    public function store(Request $request, $version_id)
    {
        $validated = $request->validate([
            'irs_component_id' => 'required|exists:irs_components,id',
            'question_id' => 'required|exists:questions,id',
            'risk_condition' => 'required|string|max:255',
            'weight' => 'required|numeric|min:0',
        ]);

        $weight = IrsWeight::create([
            'version_id' => $version_id,
            'irs_component_id' => $validated['irs_component_id'],
            'question_id' => $validated['question_id'],
            'risk_condition' => $validated['risk_condition'],
            'weight' => $validated['weight'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Aturan bobot IRS berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        IrsWeight::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Aturan bobot IRS berhasil dihapus.');
    }
}
