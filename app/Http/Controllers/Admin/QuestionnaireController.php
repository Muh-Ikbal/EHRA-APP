<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuestionnaireVersion;
use App\Models\IrsComponent;
use App\Models\Section;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\IrsWeight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestionnaireController extends Controller
{
    public function index()
    {
        $versions = QuestionnaireVersion::with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Questionnaire/Index', [
            'versions' => $versions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'version_code' => 'required|string|max:20|unique:questionnaire_versions',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        $validated['created_by'] = Auth::id() ?? \App\Models\User::first()->id; // Fallback if no auth

        // If this is the first version, make it active
        if (QuestionnaireVersion::count() === 0) {
            $validated['is_active'] = true;
        }

        QuestionnaireVersion::create($validated);

        return redirect()->back()->with('success', 'Versi kuesioner berhasil dibuat.');
    }

    public function toggleActive(QuestionnaireVersion $version)
    {
        // Deactivate all others
        QuestionnaireVersion::where('id', '!=', $version->id)->update(['is_active' => false]);
        
        // Activate this one
        $version->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Versi kuesioner berhasil diaktifkan.');
    }

    public function update(Request $request, QuestionnaireVersion $version)
    {
        $validated = $request->validate([
            'version_code' => 'required|string|max:20|unique:questionnaire_versions,version_code,' . $version->id,
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        $version->update($validated);

        return redirect()->back()->with('success', 'Versi kuesioner berhasil diperbarui.');
    }

    public function duplicate(QuestionnaireVersion $version)
    {
        DB::beginTransaction();

        try {
            // 1. Create new version
            $newVersion = QuestionnaireVersion::create([
                'version_code' => $version->version_code . '-COPY',
                'title' => $version->title . ' (Salinan)',
                'description' => $version->description,
                'valid_from' => now(),
                'valid_until' => $version->valid_until,
                'is_active' => false,
                'created_by' => Auth::id() ?? $version->created_by,
            ]);

            // 2. Copy IRS Components and build old->new ID map
            $componentMap = []; // old_id => new_id
            foreach ($version->irsComponents()->orderBy('sort_order')->get() as $comp) {
                $newComp = IrsComponent::create([
                    'version_id' => $newVersion->id,
                    'key' => $comp->key,
                    'label' => $comp->label,
                    'sort_order' => $comp->sort_order,
                    'is_active' => $comp->is_active,
                ]);
                $componentMap[$comp->id] = $newComp->id;
            }

            // 3. Copy Sections, Questions, Options and build question ID map
            $questionMap = []; // old_question_id => new_question_id
            foreach ($version->sections()->orderBy('sort_order')->get() as $section) {
                $newSection = Section::create([
                    'version_id' => $newVersion->id,
                    'code' => $section->code,
                    'title' => $section->title,
                    'description' => $section->description,
                    'sort_order' => $section->sort_order,
                    'is_irs_component' => $section->is_irs_component,
                    'irs_component_id' => $section->irs_component_id ? ($componentMap[$section->irs_component_id] ?? null) : null,
                ]);

                // Copy questions (top-level first, then sub-questions)
                $topQuestions = $section->questions()->whereNull('parent_question_id')->orderBy('sort_order')->get();
                foreach ($topQuestions as $question) {
                    $newQuestion = Question::create([
                        'section_id' => $newSection->id,
                        'code' => $question->code,
                        'question_text' => $question->question_text,
                        'question_type' => $question->question_type,
                        'is_required' => $question->is_required,
                        'is_observation' => $question->is_observation,
                        'sort_order' => $question->sort_order,
                        'skip_logic' => $question->skip_logic,
                        'parent_question_id' => null,
                    ]);
                    $questionMap[$question->id] = $newQuestion->id;

                    // Copy options
                    foreach ($question->options()->orderBy('sort_order')->get() as $opt) {
                        QuestionOption::create([
                            'question_id' => $newQuestion->id,
                            'option_value' => $opt->option_value,
                            'option_label' => $opt->option_label,
                            'sort_order' => $opt->sort_order,
                            'is_risk_flag' => $opt->is_risk_flag,
                        ]);
                    }

                    // Copy sub-questions
                    foreach ($question->subQuestions()->orderBy('sort_order')->get() as $subQ) {
                        $newSubQ = Question::create([
                            'section_id' => $newSection->id,
                            'code' => $subQ->code,
                            'question_text' => $subQ->question_text,
                            'question_type' => $subQ->question_type,
                            'is_required' => $subQ->is_required,
                            'is_observation' => $subQ->is_observation,
                            'sort_order' => $subQ->sort_order,
                            'skip_logic' => $subQ->skip_logic,
                            'parent_question_id' => $newQuestion->id,
                        ]);
                        $questionMap[$subQ->id] = $newSubQ->id;

                        foreach ($subQ->options()->orderBy('sort_order')->get() as $opt) {
                            QuestionOption::create([
                                'question_id' => $newSubQ->id,
                                'option_value' => $opt->option_value,
                                'option_label' => $opt->option_label,
                                'sort_order' => $opt->sort_order,
                                'is_risk_flag' => $opt->is_risk_flag,
                            ]);
                        }
                    }
                }
            }

            // 4. Copy IRS Weights with remapped component and question IDs
            foreach ($version->irsWeights as $weight) {
                $newComponentId = $weight->irs_component_id ? ($componentMap[$weight->irs_component_id] ?? null) : null;
                $newQuestionId = $weight->question_id ? ($questionMap[$weight->question_id] ?? null) : null;

                if ($newComponentId && $newQuestionId) {
                    IrsWeight::create([
                        'version_id' => $newVersion->id,
                        'irs_component_id' => $newComponentId,
                        'question_id' => $newQuestionId,
                        'risk_condition' => $weight->risk_condition,
                        'weight' => $weight->weight,
                        'is_active' => $weight->is_active,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Kuesioner berhasil diduplikasi sebagai "' . $newVersion->version_code . '".');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Gagal duplikasi kuesioner', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal menduplikasi kuesioner: ' . $e->getMessage());
        }
    }

    public function destroy(QuestionnaireVersion $version)
    {
        if ($version->is_active) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus versi yang sedang aktif.');
        }

        $version->delete();

        return redirect()->back()->with('success', 'Versi kuesioner berhasil dihapus.');
    }
}
