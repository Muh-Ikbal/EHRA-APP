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
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class QuestionnaireBuilderController extends Controller
{
    public function edit(QuestionnaireVersion $version)
    {
        // Load the entire structure
        $version->load([
            'irsComponents',
            'sections' => function ($query) {
                $query->orderBy('sort_order');
            },
            'sections.questions' => function ($query) {
                $query->orderBy('sort_order');
            },
            'sections.questions.options' => function ($query) {
                $query->orderBy('sort_order');
            },
            'irsWeights'
        ]);

        return Inertia::render('Admin/Questionnaire/Builder', [
            'version' => $version,
        ]);
    }

    public function save(Request $request, QuestionnaireVersion $version)
    {
        $payload = $request->all();

        DB::beginTransaction();

        try {
            // 1. Save IRS Components
            $componentIdsToKeep = [];
            foreach ($payload['irsComponents'] ?? [] as $idx => $compData) {
                $component = IrsComponent::updateOrCreate(
                    ['id' => $compData['id'] ?? null],
                    [
                        'version_id' => $version->id,
                        'key' => $compData['key'],
                        'label' => $compData['label'],
                        'sort_order' => $idx,
                        'is_active' => $compData['is_active'] ?? true,
                    ]
                );
                $componentIdsToKeep[] = $component->id;
                // Update temporary ID map if needed
                $this->updateIdMap($payload, $compData['id'], $component->id);
            }
            IrsComponent::where('version_id', $version->id)
                ->whereNotIn('id', $componentIdsToKeep)
                ->delete();

            // 2. Save Sections
            $sectionIdsToKeep = [];
            foreach ($payload['sections'] ?? [] as $idx => $secData) {
                $irsCompId = $this->getMappedId($payload, $secData['irs_component_id'] ?? null);

                $section = Section::updateOrCreate(
                    ['id' => $secData['id'] ?? null],
                    [
                        'version_id' => $version->id,
                        'code' => $secData['code'],
                        'title' => $secData['title'],
                        'description' => $secData['description'] ?? null,
                        'sort_order' => $idx,
                        'is_irs_component' => $secData['is_irs_component'] ?? false,
                        'irs_component_id' => $irsCompId,
                    ]
                );
                $sectionIdsToKeep[] = $section->id;
                $this->updateIdMap($payload, $secData['id'], $section->id);

                // 3. Save Questions for this section
                $questionIdsToKeep = [];
                foreach ($secData['questions'] ?? [] as $qIdx => $qData) {
                    $question = Question::updateOrCreate(
                        ['id' => $qData['id'] ?? null],
                        [
                            'section_id' => $section->id,
                            'code' => $qData['code'],
                            'question_text' => $qData['question_text'],
                            'question_type' => $qData['question_type'],
                            'is_required' => $qData['is_required'] ?? true,
                            'is_observation' => $qData['is_observation'] ?? false,
                            'sort_order' => $qIdx,
                            'skip_logic' => $qData['skip_logic'] ?? null,
                            'parent_question_id' => null, // Simplified MVP
                        ]
                    );
                    $questionIdsToKeep[] = $question->id;
                    $this->updateIdMap($payload, $qData['id'], $question->id);

                    // 4. Save Options for this question
                    $optionIdsToKeep = [];
                    foreach ($qData['options'] ?? [] as $oIdx => $oData) {
                        $option = QuestionOption::updateOrCreate(
                            ['id' => $oData['id'] ?? null],
                            [
                                'question_id' => $question->id,
                                'option_value' => $oData['option_value'],
                                'option_label' => $oData['option_label'],
                                'sort_order' => $oIdx,
                                'is_risk_flag' => $oData['is_risk_flag'] ?? false,
                            ]
                        );
                        $optionIdsToKeep[] = $option->id;
                        $this->updateIdMap($payload, $oData['id'], $option->id);
                    }
                    QuestionOption::where('question_id', $question->id)
                        ->whereNotIn('id', $optionIdsToKeep)
                        ->delete();
                }
                Question::where('section_id', $section->id)
                    ->whereNotIn('id', $questionIdsToKeep)
                    ->delete();
            }
            Section::where('version_id', $version->id)
                ->whereNotIn('id', $sectionIdsToKeep)
                ->delete();

            // 5. Save IRS Weights (if any)
            // Simplified for MVP, risk_weight is mostly saved in QuestionOption

            DB::commit();

            return redirect()->back()->with('success', 'Struktur kuesioner berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }

    private function updateIdMap(&$payload, $tempId, $realId)
    {
        if (!isset($payload['idMap'])) {
            $payload['idMap'] = [];
        }
        if ($tempId && !str_starts_with($tempId, 'new-')) {
            // Already a real UUID
            return;
        }
        if ($tempId) {
            $payload['idMap'][$tempId] = $realId;
        }
    }

    private function getMappedId($payload, $id)
    {
        if (!$id) return null;
        return $payload['idMap'][$id] ?? $id;
    }
}
