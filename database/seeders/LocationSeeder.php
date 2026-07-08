<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Village;
use App\Models\VillageIrsResult;
use App\Models\QuestionnaireVersion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $geojsonPath = public_path('data/sultra.geojson');
        
        if (!File::exists($geojsonPath)) {
            $this->command->error("File sultra.geojson tidak ditemukan di public/data/");
            return;
        }

        $this->command->info("Membaca data GeoJSON...");
        $json = File::get($geojsonPath);
        $data = json_decode($json, true);

        if (!isset($data['features'])) {
            $this->command->error("Format GeoJSON tidak valid (tidak ada features).");
            return;
        }

        // Dapatkan Questionnaire Version aktif (atau buat jika belum ada)
        $version = QuestionnaireVersion::firstOrCreate(
            ['is_active' => true],
            [
                'title' => 'EHRA 2026',
                'version_code' => 'EHRA-2026',
                'description' => 'Kuesioner Default'
            ]
        );

        $provCache = [];
        $cityCache = [];
        $distCache = [];
        
        $villagesToInsert = [];
        $insertedVillages = [];

        $this->command->info("Memproses " . count($data['features']) . " desa...");

        foreach ($data['features'] as $feature) {
            $props = $feature['properties'];
            $provName = $props['WADMPR'] ?? 'Sulawesi Tenggara';
            $provCode = $props['KDPPUM'] ?? '74';
            $cityName = $props['WADMKK'] ?? 'Unknown City';
            $cityCode = $props['KDPKAB'] ?? null;
            $distName = $props['WADMKC'] ?? 'Unknown District';
            $distCode = $props['KDCPUM'] ?? null;
            $villName = $props['WADMKD'] ?? 'Unknown Village';
            $villCode = $props['KDEPUM'] ?? null;

            // Province
            if (!isset($provCache[$provName])) {
                $prov = Province::firstOrCreate(
                    ['name' => $provName],
                    ['kemendagri_code' => $provCode]
                );
                $provCache[$provName] = $prov->id;
            }
            $provId = $provCache[$provName];

            // City
            $cityKey = $provId . '_' . $cityName;
            if (!isset($cityCache[$cityKey])) {
                $city = City::firstOrCreate(
                    ['province_id' => $provId, 'name' => $cityName],
                    ['kemendagri_code' => $cityCode, 'type' => 'kabupaten']
                );
                $cityCache[$cityKey] = $city->id;
            }
            $cityId = $cityCache[$cityKey];

            // District
            $distKey = $cityId . '_' . $distName;
            if (!isset($distCache[$distKey])) {
                $dist = District::firstOrCreate(
                    ['city_id' => $cityId, 'name' => $distName],
                    ['kemendagri_code' => $distCode]
                );
                $distCache[$distKey] = $dist->id;
            }
            $distId = $distCache[$distKey];

            // Village
            // Optimization: we could bulk insert villages, but firstOrCreate is safe.
            // Since we need the ID for VillageIrsResult, we'll do firstOrCreate
            $village = Village::firstOrCreate(
                ['district_id' => $distId, 'name' => $villName],
                ['kemendagri_code' => $villCode, 'strata' => 1]
            );
            
            $insertedVillages[] = $village->id;
        }

        $this->command->info("Berhasil menyimpan data lokasi.");
        $this->command->info("Membuat dummy data VillageIrsResult untuk 30% desa...");

        $totalVillages = count($insertedVillages);
        $villagesWithDataCount = (int)($totalVillages * 0.3);

        // Randomize
        shuffle($insertedVillages);
        $villagesWithData = array_slice($insertedVillages, 0, $villagesWithDataCount);

        $riskCategories = \App\Models\RiskAspectCategory::all();

        $resultsToInsert = [];
        foreach ($villagesWithData as $villageId) {
            $irsTotal = rand(10, 100);
            $riskCategory = $riskCategories->first(function ($cat) use ($irsTotal) {
                return $irsTotal >= $cat->lower_bound && $irsTotal <= $cat->upper_bound;
            });
            $categoryId = $riskCategory ? $riskCategory->id : ($riskCategories->first()->id ?? null);
            
            VillageIrsResult::updateOrCreate(
                ['village_id' => $villageId, 'version_id' => $version->id],
                [
                    'total_respondents' => rand(20, 100),
                    'irs_total' => $irsTotal,
                    'risk_aspect_category_id' => $categoryId,
                    'is_published' => true,
                    'calculated_at' => now(),
                    'component_scores' => [],
                    'components_snapshot' => [],
                ]
            );
        }

        $this->command->info("Selesai! $villagesWithDataCount data risiko desa berhasil dibuat.");
    }
}
