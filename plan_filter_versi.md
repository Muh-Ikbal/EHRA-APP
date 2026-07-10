# Rencana Perbaikan: Menambahkan Filter Versi Kuesioner di Halaman Welcome

Untuk menambahkan filter versi pada data peta dan grafik di halaman dashboard publik (Welcome), kita perlu melakukan perubahan pada **Backend (routes/web.php)** untuk menangkap filter dan **Frontend (Welcome.tsx)** untuk menampilkan *dropdown* pilihan versi.

Silakan ikuti langkah-langkah berikut secara berurutan.

## Langkah 1: Modifikasi Backend (`routes/web.php`)

Buka file `routes/web.php` dan cari bagian `Route::get('/', function () { ... })`. Kita perlu mengubah logika untuk mengambil daftar versi dan memfilter `VillageIrsResult` berdasarkan versi yang dipilih.

**Ubah kode di dalam `Route::get('/', function () { ... })` menjadi seperti berikut:**

```php
Route::get('/', function () {
    $categories = \App\Models\RiskAspectCategory::orderBy('lower_bound')->get();

    // 1. Ambil daftar semua versi kuesioner
    $versions = \App\Models\QuestionnaireVersion::orderBy('created_at', 'desc')->get(['id', 'version_code', 'title', 'is_active']);
    
    // 2. Tentukan versi yang sedang dipilih dari query parameter URL (misal: /?version=xxx)
    $selectedVersionId = request()->query('version');
    
    // Jika tidak ada parameter version di URL, gunakan versi yang sedang aktif sebagai default
    if (!$selectedVersionId) {
        $activeVersion = $versions->firstWhere('is_active', true) ?? $versions->first();
        $selectedVersionId = $activeVersion ? $activeVersion->id : null;
    }

    // 3. Filter mapData berdasarkan version_id
    $mapData = \App\Models\VillageIrsResult::with(['village.district.city', 'riskAspectCategory'])
        ->where('is_published', true)
        ->when($selectedVersionId, function ($query) use ($selectedVersionId) {
            return $query->where('version_id', $selectedVersionId);
        })
        ->get()
        ->mapWithKeys(function ($result) use ($categories) {
            // PASTIKAN ANDA TIDAK MENGHAPUS LOGIKA DI DALAM SINI
            $risk = $result->riskAspectCategory;
            
            if (!$risk && $result->irs_total !== null) {
                $risk = $categories->first(function ($cat) use ($result) {
                    return $result->irs_total >= $cat->lower_bound && $result->irs_total <= $cat->upper_bound;
                });
            }
            
            $city = $result->village->district->city->name ?? '';
            $district = $result->village->district->name ?? '';
            $village = $result->village->name ?? '';
            $cityName = $result->village->district->city->name ?? '';
            
            $key = strtoupper($city . '_' . $district . '_' . $village);

            return [
                $key => [
                    'risk' => $risk ? $risk->category_name : 'Belum Dihitung',
                    'color' => $risk ? $risk->color : '#cccccc',
                    'irs_total' => $result->irs_total,
                    'total_respondents' => $result->total_respondents,
                    'village_name' => $village,
                    'district_name' => $district,
                    'city_name' => $cityName,
                    'kemendagri_code' => $result->village->kemendagri_code ?? '',
                    'component_scores' => $result->component_scores ?? [],
                ]
            ];
        });

    $riskCategories = $categories->map(fn($cat) => [
        'name' => $cat->category_name,
        'color' => $cat->color,
        'lower_bound' => $cat->lower_bound,
        'upper_bound' => $cat->upper_bound,
    ])->values();

    $cityList = \App\Models\City::orderBy('name')->pluck('name')->values();

    // 4. Passing data versions dan selectedVersionId ke file React (Inertia)
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'mapData' => $mapData,
        'riskCategories' => $riskCategories,
        'cityList' => $cityList,
        'versions' => $versions,
        'selectedVersionId' => $selectedVersionId,
    ]);
});
```

---

## Langkah 2: Modifikasi Frontend (`resources/js/Pages/Welcome.tsx`)

Buka file `resources/js/Pages/Welcome.tsx` dan ikuti beberapa poin perubahan berikut:

### A. Tambahkan Import Inertia Router
Pada bagian atas file, pastikan Anda menambahkan `router` dari `@inertiajs/react`.
Cari `import { Head, Link } from '@inertiajs/react';` dan ubah menjadi:
```tsx
import { Head, Link, router } from '@inertiajs/react';
```

### B. Update `WelcomeProps`
Tambahkan deklarasi tipe data untuk data versi yang dikirim dari backend.
Cari interface `WelcomeProps` dan tambahkan `versions` dan `selectedVersionId`:
```tsx
interface WelcomeProps {
    laravelVersion: string;
    phpVersion: string;
    mapData?: Record<string, VillageData>;
    riskCategories?: RiskCategory[];
    cityList?: string[];
    // Tambahkan 2 baris ini:
    versions?: { id: string; version_code: string; title: string }[];
    selectedVersionId?: string | null;
}
```

### C. Update parameter fungsi `Welcome`
Di dalam fungsi komponen `Welcome`, tambahkan `versions` dan `selectedVersionId` di parameternya.
```tsx
export default function Welcome({
    auth, mapData = {}, riskCategories = [], cityList = [], versions = [], selectedVersionId = null
}: PageProps<WelcomeProps>) {
// ...
```

### D. Buat Fungsi Handler untuk Mengubah Versi
Di dalam komponen `Welcome`, tambahkan fungsi untuk memanggil ulang halaman saat dropdown versi diganti. Tambahkan kode berikut di bawah baris state (`const [selectedRow, setSelectedRow] = useState<string | null>(null);`):

```tsx
    const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/', { version: e.target.value }, { preserveState: true });
    };
```

### E. Tambahkan Dropdown Filter Versi di Sidebar Kiri
Cari bagian *Left Sidebar* di mana *dropdown* Kabupaten/Kota berada. Tambahkan *dropdown* untuk versi tepat di atas atau di bawahnya.
Cari kode ini (biasanya di baris ke 260-an):
```tsx
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                                Pilih Kabupaten / Kota Sultra
                            </label>
                            {/* ... select kabupaten ... */}
```

Ubah dan tambahkan kode untuk Filter Versi sehingga menjadi seperti ini:

```tsx
                        {/* Filter Versi Kuesioner */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                                Versi Kuesioner (Tahun)
                            </label>
                            <select
                                value={selectedVersionId || ''}
                                onChange={handleVersionChange}
                                style={{
                                    width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px',
                                    fontSize: '13px', fontWeight: 500, backgroundColor: '#fff', cursor: 'pointer',
                                }}
                            >
                                {versions.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.version_code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Kabupaten */}
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                                Pilih Kabupaten / Kota Sultra
                            </label>
                            <select
                                value={selectedKabupaten}
                                onChange={e => setSelectedKabupaten(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px',
                                    fontSize: '13px', fontWeight: 500, backgroundColor: '#fff', cursor: 'pointer',
                                }}
                            >
                                <option value="">Seluruh Wilayah</option>
                                {cityList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
```

Setelah Anda selesai melakukan perubahan ini, jalankan ulang `npm run dev` jika server React belum berjalan, dan coba akses kembali dashboard Anda!
