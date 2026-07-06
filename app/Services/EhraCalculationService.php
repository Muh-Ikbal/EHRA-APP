<?php

namespace App\Services;

use App\Models\SurveyResponse;
use App\Models\Answer;
use App\Models\IrsWeight;
use App\Models\IrsComponent;
use App\Models\RiskAspectCategory;
use App\Models\VillageIrsResult;

class EhraCalculationService
{
    public function calculateForVillage($villageId, $versionId)
    {
        // 1. Get total respondents in this village for this version
        $totalRespondents = SurveyResponse::where('village_id', $villageId)
            ->where('version_id', $versionId)
            ->where('status', 'submitted')
            ->count();

        if ($totalRespondents == 0) {
            return null; // Nothing to calculate
        }

        // 2. Get active weights and components
        $weights = IrsWeight::where('version_id', $versionId)
            ->where('is_active', true)
            ->get();
            
        $components = IrsComponent::where('version_id', $versionId)
            ->where('is_active', true)
            ->get();

        $kumulatif = 0;
        $componentScores = [];

        // 3. Kalkulasi per komponen
        // Rumus: Kalkulasi = Persentase indeks risiko (%) x Bobot per sumber bahaya (%)
        foreach ($components as $component) {
            $componentWeights = $weights->where('irs_component_id', $component->id);
            $componentKalkulasi = 0;
            foreach ($componentWeights as $w) {
                \Illuminate\Support\Facades\Log::info("Menghitung komponen {$component->key} untuk Q: {$w->question_id} dengan Kondisi: {$w->risk_condition}");
                // Sumber bahaya = Jumlah sampel per kawasan yang berisiko
                // Indeks risiko = (Sumber bahaya / Total sampel) * 100%
                
                // Cari jumlah responden yang menjawab sesuai risk_condition
                $riskCount = Answer::whereHas('response', function($q) use ($villageId, $versionId) {
                    $q->where('village_id', $villageId)
                      ->where('version_id', $versionId)
                      ->where('status', '!=', 'draft');
                })
                ->where('question_id', $w->question_id)
                ->where(function($query) use ($w) {
                    $query->where('answer_value', $w->risk_condition)
                          ->orWhere('answer_code', $w->risk_condition)
                          // Handle JSON array (multi_choice)
                          ->orWhereJsonContains('answer_codes', $w->risk_condition);
                })->count();

                $persentaseIndeksRisiko = ($riskCount / $totalRespondents) * 100;
                
                // Kalkulasi = Persentase indeks risiko (%) x Bobot
                // Jika weight disimpan dalam persen (contoh: 20), kita konversi ke desimal untuk perkalian
                // atau pertahankan persen (jika bobot = 20, 50% * 20 = 10%)
                // Karena rumus di gambar adalah Persentase x Bobot, 
                // Asumsi: jika $w->weight = 20 (untuk 20%), maka dikali ($w->weight / 100).
                // Atau dikali langsung ($w->weight) dan hasilnya dibagi 100? 
                // Rumus: (Persentase / 100) * Bobot, atau Persentase * (Bobot / 100)
                $kalkulasi = $persentaseIndeksRisiko * ($w->weight / 100);
                
                $componentKalkulasi += $kalkulasi;
            }

            \Illuminate\Support\Facades\Log::info("Hasil Komponen {$component->key}: Total Risiko = {$componentKalkulasi}, Responden = {$totalRespondents}");

            $componentScores[$component->key ?? $component->id] = [
                'score' => round($componentKalkulasi, 2),
                'label' => $component->label
            ];
            
            // Kumulatif = Menjumlahkan total setiap komponen parameter
            $kumulatif += $componentKalkulasi;
        }

        $kumulatif = round($kumulatif, 2);

        // 4. Penentuan Kategori IRS
        // Cari di tabel risk_aspect_categories berdasarkan lower_bound dan upper_bound
        $category = RiskAspectCategory::where('lower_bound', '<=', $kumulatif)
            ->where('upper_bound', '>=', $kumulatif)
            ->first();

        // Jika tidak ada yang cocok tapi ada data kategori, fallback ke kategori tertinggi atau terendah
        if (!$category) {
            $category = RiskAspectCategory::orderBy('lower_bound', 'asc')->first();
        }

        // 5. Simpan ke village_irs_results
        $result = VillageIrsResult::updateOrCreate(
            ['village_id' => $villageId, 'version_id' => $versionId],
            [
                'total_respondents' => $totalRespondents,
                'component_scores' => $componentScores,
                'components_snapshot' => $components->pluck('label', 'key')->toArray(),
                'irs_total' => $kumulatif,
                'risk_aspect_category_id' => $category ? $category->id : null,
                'calculated_at' => now(),
                'is_published' => true, // Publikasi otomatis untuk MVP
            ]
        );
        $result->save();
        
        \Illuminate\Support\Facades\Log::info("Selesai Kalkulasi Desa {$villageId}. Total IRS: {$kumulatif} (Kategori: " . ($category ? $category->category_name : 'N/A') . ")");

        return $result;
    }
}
