<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\Village;
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
    }
}
