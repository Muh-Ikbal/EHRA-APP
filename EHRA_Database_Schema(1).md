# Database Schema — Aplikasi EHRA
> Urutan tabel mengikuti urutan migrasi yang aman (parent table sebelum child table)

---

## Grup 1 — Wilayah Administratif

### 1. `provinces`
> Tidak ada foreign key. Migrasi pertama.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `kemendagri_code` | `char(2)` UNIQUE NOT NULL | Kode provinsi Kemendagri, contoh: `73` |
| `name` | `varchar(100)` NOT NULL | Nama provinsi |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

### 2. `cities`
> FK ke `provinces`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `province_id` | `uuid` FK NOT NULL | → `provinces.id` |
| `kemendagri_code` | `char(4)` UNIQUE NOT NULL | Kode kab/kota Kemendagri, contoh: `7371` |
| `name` | `varchar(100)` NOT NULL | Nama kabupaten/kota |
| `type` | `enum('kabupaten','kota')` NOT NULL | Jenis wilayah |
| `geojson_path` | `varchar(255)` NULLABLE | Path file GeoJSON, contoh: `geojson/cities/7371.geojson` |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

### 3. `districts`
> FK ke `cities`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `city_id` | `uuid` FK NOT NULL | → `cities.id` |
| `kemendagri_code` | `char(7)` UNIQUE NOT NULL | Kode kecamatan Kemendagri, contoh: `7371010` |
| `name` | `varchar(100)` NOT NULL | Nama kecamatan |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

### 4. `villages`
> FK ke `districts`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `district_id` | `uuid` FK NOT NULL | → `districts.id` |
| `kemendagri_code` | `char(10)` UNIQUE NOT NULL | Kode desa Kemendagri, contoh: `7371010001` |
| `name` | `varchar(100)` NOT NULL | Nama desa/kelurahan |
| `status` | `enum('perdesaan','perkotaan')` NOT NULL | Sesuai ID.6 kuesioner |
| `strata` | `tinyint` NOT NULL DEFAULT `5` | Nilai 0–5, sesuai ID.5 kuesioner. Default 5 = tidak menggunakan strata |
| `centroid_lat` | `decimal(10,7)` NULLABLE | Titik tengah wilayah — untuk popup peta |
| `centroid_lng` | `decimal(10,7)` NULLABLE | Titik tengah wilayah — untuk popup peta |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

## Grup 2 — Pengguna

### 5. `users`
> FK ke `cities` (nullable). Tidak bergantung tabel kuesioner sehingga bisa migrasi lebih awal.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `name` | `varchar(100)` NOT NULL | Nama lengkap |
| `email` | `varchar(150)` UNIQUE NOT NULL | Email login |
| `password` | `varchar(255)` NOT NULL | Hashed password |
| `role` | `enum('admin','enumerator')` NOT NULL | Role pengguna |
| `assigned_city_id` | `uuid` FK NULLABLE | → `cities.id`. Untuk enumerator: kab/kota tugasnya |
| `is_active` | `boolean` NOT NULL DEFAULT `true` | Status akun |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

## Grup 3 — Versi Kuesioner

### 6. `questionnaire_versions`
> FK ke `users`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `version_code` | `varchar(20)` UNIQUE NOT NULL | Kode versi, contoh: `EHRA-2025` |
| `title` | `varchar(150)` NOT NULL | Judul versi, contoh: `Kuesioner EHRA 2025–2029` |
| `description` | `text` NULLABLE | Deskripsi versi |
| `valid_from` | `date` NOT NULL | Tanggal mulai berlaku |
| `valid_until` | `date` NULLABLE | Tanggal berakhir. NULL = masih berlaku |
| `is_active` | `boolean` NOT NULL DEFAULT `false` | Versi yang sedang digunakan enumerator |
| `created_by` | `uuid` FK NOT NULL | → `users.id` |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Catatan:** Hanya satu versi yang boleh `is_active = true` dalam satu waktu. Enforce di level aplikasi.

---

## Grup 4 — Komponen IRS

### 7. `irs_components`
> FK ke `questionnaire_versions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `key` | `varchar(50)` NOT NULL | Kunci unik per versi, contoh: `air_minum`, `persampahan` |
| `label` | `varchar(100)` NOT NULL | Label tampilan, contoh: `Sumber Air Minum` |
| `sort_order` | `tinyint` NOT NULL DEFAULT `0` | Urutan tampil di laporan dan grafik |
| `is_active` | `boolean` NOT NULL DEFAULT `true` | — |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(version_id, key)` — kunci tidak boleh duplikat dalam satu versi.

**Contoh data untuk EHRA 2025:**

| `key` | `label` | `sort_order` |
|---|---|---|
| `air_minum` | Sumber Air Minum | 1 |
| `air_limbah` | Air Limbah Domestik | 2 |
| `persampahan` | Pengelolaan Sampah | 3 |
| `drainase` | Drainase Lingkungan | 4 |
| `phbs` | Perilaku Hidup Bersih Sehat | 5 |

---

## Grup 5 — Struktur Kuesioner

### 8. `sections`
> FK ke `questionnaire_versions` dan `irs_components`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `code` | `varchar(10)` NOT NULL | Kode section, contoh: `A`, `B`, `C` |
| `title` | `varchar(150)` NOT NULL | Judul section, contoh: `Pengelolaan Sampah Rumah Tangga` |
| `description` | `text` NULLABLE | Petunjuk pengisian section |
| `sort_order` | `tinyint` NOT NULL DEFAULT `0` | Urutan tampil di form kuesioner |
| `is_irs_component` | `boolean` NOT NULL DEFAULT `false` | Apakah section ini masuk perhitungan IRS? |
| `irs_component_id` | `uuid` FK NULLABLE | → `irs_components.id`. Wajib diisi jika `is_irs_component = true` |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(version_id, code)`.

**Contoh data:**

| `code` | `title` | `is_irs_component` | `irs_component_id` |
|---|---|---|---|
| A | Informasi Umum | `false` | `null` |
| B | Informasi Responden | `false` | `null` |
| C | Pengelolaan Sampah | `true` | → `persampahan` |
| D | Pembuangan Tinja | `true` | → `air_limbah` |
| E | Drainase & Banjir | `true` | → `drainase` |
| F | Air Minum | `true` | → `air_minum` |
| G | Perilaku CTPS | `true` | → `phbs` |
| H | Kejadian Penyakit | `false` | `null` |
| I | Rumah Sehat | `true` | → `phbs` |
| J | Tempat Pangan | `false` | `null` |

---

### 9. `questions`
> FK ke `sections`. Self-referencing FK ke `questions` (untuk skip logic parent).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `section_id` | `uuid` FK NOT NULL | → `sections.id` |
| `code` | `varchar(10)` NOT NULL | Kode pertanyaan, contoh: `C.1`, `D.3` |
| `question_text` | `text` NOT NULL | Teks pertanyaan |
| `question_type` | `enum('single_choice','multi_choice','text','number','date','matrix')` NOT NULL | Jenis input |
| `is_required` | `boolean` NOT NULL DEFAULT `true` | Wajib diisi sebelum submit |
| `is_observation` | `boolean` NOT NULL DEFAULT `false` | Pertanyaan tipe "Lihat dan Amati" |
| `sort_order` | `smallint` NOT NULL DEFAULT `0` | Urutan tampil dalam section |
| `skip_logic` | `json` NULLABLE | Aturan loncat pertanyaan. Lihat format di bawah |
| `parent_question_id` | `uuid` FK NULLABLE | → `questions.id`. Pertanyaan induk untuk sub-pertanyaan |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

**Format `skip_logic`:**
```json
[
  {
    "if_question_code": "D.1",
    "operator": "equals",
    "value": "4",
    "action": "jump",
    "target_code": "D.2"
  },
  {
    "if_question_code": "C.6",
    "operator": "equals",
    "value": "2",
    "action": "jump",
    "target_code": "C.8"
  }
]
```

**Nilai `question_type`:**

| Nilai | Keterangan | Contoh |
|---|---|---|
| `single_choice` | Pilih satu opsi | B.4 Jenis bangunan |
| `multi_choice` | Pilih banyak dengan kode 0/1 | C.3 Kondisi sampah |
| `text` | Isian teks bebas | A.3 Nama enumerator |
| `number` | Isian angka | B.1 Usia responden |
| `date` | Isian tanggal | A.1 Tanggal survei |
| `matrix` | Tabel silang | E.1 Drainase per sumber |

---

### 10. `question_options`
> FK ke `questions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `question_id` | `uuid` FK NOT NULL | → `questions.id` |
| `option_value` | `varchar(10)` NOT NULL | Kode opsi, contoh: `1`, `2`, `A`, `B` |
| `option_label` | `varchar(255)` NOT NULL | Teks opsi, contoh: `Jamban pribadi` |
| `sort_order` | `tinyint` NOT NULL DEFAULT `0` | Urutan tampil |
| `is_risk_flag` | `boolean` NOT NULL DEFAULT `false` | Apakah jawaban ini dihitung sebagai kondisi berisiko? |
| `risk_weight` | `decimal(5,2)` NULLABLE | Bobot risiko opsi ini jika `is_risk_flag = true` |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

## Grup 6 — Bobot IRS

### 11. `irs_weights`
> FK ke `questionnaire_versions`, `irs_components`, dan `questions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `irs_component_id` | `uuid` FK NOT NULL | → `irs_components.id` |
| `question_id` | `uuid` FK NOT NULL | → `questions.id`. Pertanyaan yang diukur |
| `risk_condition` | `varchar(255)` NOT NULL | Kondisi jawaban yang dianggap berisiko, contoh: `answer_code IN ('H','I','J')` |
| `weight` | `decimal(5,2)` NOT NULL | Bobot dalam persen. Total per komponen harus = 100% |
| `is_active` | `boolean` NOT NULL DEFAULT `true` | — |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

---

## Grup 7 — Penugasan Enumerator

### 12. `enumerator_villages`
> FK ke `users` dan `villages` dan `questionnaire_versions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `user_id` | `uuid` FK NOT NULL | → `users.id`. Harus berole `enumerator` |
| `village_id` | `uuid` FK NOT NULL | → `villages.id` |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `created_at` | `timestamp` | — |

> **Unique constraint:** `(user_id, village_id, version_id)` — satu enumerator tidak bisa ditugaskan dua kali ke desa yang sama dalam versi yang sama.

---

## Grup 8 — Kuota Survei

### 13. `village_survey_quota`
> FK ke `villages` dan `questionnaire_versions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `village_id` | `uuid` FK NOT NULL | → `villages.id` |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `max_respondents` | `tinyint` NOT NULL DEFAULT `40` | Batas maks survei per desa. Sesuai BR-01 |
| `current_count` | `smallint` NOT NULL DEFAULT `0` | Jumlah survei yang sudah masuk |
| `is_locked` | `boolean` NOT NULL DEFAULT `false` | `true` jika `current_count >= max_respondents` |
| `locked_at` | `timestamp` NULLABLE | Waktu kuota penuh |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(village_id, version_id)`.

---

## Grup 9 — Responden dan Jawaban

### 14. `survey_responses`
> FK ke `questionnaire_versions`, `users`, dan `villages`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `enumerator_id` | `uuid` FK NOT NULL | → `users.id` |
| `village_id` | `uuid` FK NOT NULL | → `villages.id` |
| `respondent_code` | `varchar(13)` NOT NULL | Kode 13 digit: KodeProv+Kab+Kec+Desa+Strata+NoUrut. Contoh: `7371010001501` |
| `respondent_seq` | `tinyint` NOT NULL | Nomor urut responden dalam desa (01–40) |
| `status` | `enum('draft','submitted','reviewed','approved')` NOT NULL DEFAULT `draft` | Status pengisian |
| `gps_lat` | `decimal(10,7)` NULLABLE | Koordinat GPS lokasi wawancara |
| `gps_lng` | `decimal(10,7)` NULLABLE | Koordinat GPS lokasi wawancara |
| `submitted_at` | `timestamp` NULLABLE | Waktu submit. NULL jika masih draft |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(respondent_code)`.

---

### 15. `answers`
> FK ke `survey_responses` dan `questions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `response_id` | `uuid` FK NOT NULL | → `survey_responses.id` |
| `question_id` | `uuid` FK NOT NULL | → `questions.id` |
| `answer_value` | `text` NULLABLE | Nilai jawaban bebas (teks/angka/tanggal) |
| `answer_code` | `varchar(10)` NULLABLE | Kode opsi yang dipilih untuk `single_choice` |
| `answer_codes` | `json` NULLABLE | Array kode opsi untuk `multi_choice`. Contoh: `["A","C","F"]` |
| `is_flagged_risk` | `boolean` NOT NULL DEFAULT `false` | Di-set otomatis saat submit berdasarkan `question_options.is_risk_flag` |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(response_id, question_id)` — satu pertanyaan hanya boleh dijawab sekali per responden.

---

## Grup 10 — Hasil Analisis dan GIS

### 16. `village_irs_results`
> FK ke `villages` dan `questionnaire_versions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `village_id` | `uuid` FK NOT NULL | → `villages.id` |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `total_respondents` | `smallint` NOT NULL DEFAULT `0` | Jumlah responden yang dihitung |
| `component_scores` | `json` NOT NULL | Skor IRS per komponen. Lihat format di bawah |
| `components_snapshot` | `json` NOT NULL | Snapshot definisi komponen saat kalkulasi — audit trail |
| `irs_total` | `decimal(6,2)` NOT NULL | Skor IRS kumulatif |
| `risk_category` | `enum('tidak_berisiko','kurang_berisiko','sedang','tinggi','sangat_tinggi')` NOT NULL | Kategori risiko |
| `risk_color` | `varchar(7)` NOT NULL | Kode hex warna, contoh: `#22c55e` |
| `is_published` | `boolean` NOT NULL DEFAULT `false` | Apakah sudah boleh tampil di dashboard publik |
| `calculated_at` | `timestamp` NOT NULL | Waktu kalkulasi terakhir |
| `created_at` | `timestamp` | — |
| `updated_at` | `timestamp` | — |

> **Unique constraint:** `(village_id, version_id)`.

**Format `component_scores`:**
```json
{
  "air_minum":   { "score": 45.20, "category": "Tinggi" },
  "air_limbah":  { "score": 88.10, "category": "Sangat Tinggi" },
  "persampahan": { "score": 32.00, "category": "Sedang" },
  "drainase":    { "score": 12.50, "category": "Kurang Berisiko" },
  "phbs":        { "score": 67.30, "category": "Tinggi" }
}
```

**Format `components_snapshot`:**
```json
{
  "air_minum":   "Sumber Air Minum",
  "air_limbah":  "Air Limbah Domestik",
  "persampahan": "Pengelolaan Sampah",
  "drainase":    "Drainase Lingkungan",
  "phbs":        "Perilaku Hidup Bersih Sehat"
}
```

**Warna per kategori risiko:**

| Kategori | Warna | Hex |
|---|---|---|
| `tidak_berisiko` | Hijau | `#22c55e` |
| `kurang_berisiko` | Biru | `#3b82f6` |
| `sedang` | Kuning | `#eab308` |
| `tinggi` | Oranye | `#f97316` |
| `sangat_tinggi` | Merah | `#ef4444` |

---

### 17. `map_popup_cache`
> FK ke `villages` dan `questionnaire_versions`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | Primary key |
| `village_id` | `uuid` FK NOT NULL | → `villages.id` |
| `version_id` | `uuid` FK NOT NULL | → `questionnaire_versions.id` |
| `popup_data` | `json` NOT NULL | Data popup siap tampil. Lihat format di bawah |
| `cached_at` | `timestamp` NOT NULL | Waktu cache dibuat atau diperbarui |

> **Unique constraint:** `(village_id, version_id)`.
> Cache di-regenerate otomatis setiap kali `village_irs_results` diperbarui.

**Format `popup_data`:**
```json
{
  "village_name":     "Kelurahan Rappocini",
  "district_name":    "Kecamatan Rappocini",
  "total_respondents": 40,
  "irs_total":        64.50,
  "risk_category":    "Tinggi",
  "risk_color":       "#f97316",
  "component_scores": {
    "air_minum":   45.20,
    "air_limbah":  88.10,
    "persampahan": 32.00,
    "drainase":    12.50,
    "phbs":        67.30
  },
  "is_published": true
}
```

---

## Urutan Migrasi (Aman dari FK Error)

```
1.  provinces
2.  cities                   ← FK: provinces
3.  districts                ← FK: cities
4.  villages                 ← FK: districts
5.  users                    ← FK: cities (nullable)
6.  questionnaire_versions   ← FK: users
7.  irs_components           ← FK: questionnaire_versions
8.  sections                 ← FK: questionnaire_versions, irs_components
9.  questions                ← FK: sections, questions (self)
10. question_options         ← FK: questions
11. irs_weights              ← FK: questionnaire_versions, irs_components, questions
12. enumerator_villages      ← FK: users, villages, questionnaire_versions
13. village_survey_quota     ← FK: villages, questionnaire_versions
14. survey_responses         ← FK: questionnaire_versions, users, villages
15. answers                  ← FK: survey_responses, questions
16. village_irs_results      ← FK: villages, questionnaire_versions
17. map_popup_cache          ← FK: villages, questionnaire_versions
```

---

## Catatan Implementasi

**UUID vs Auto Increment** — Semua tabel menggunakan UUID sebagai primary key. Lebih aman untuk data yang nantinya bisa diimport dari kabupaten lain dan menghindari konflik ID.

**Soft Delete** — Pertimbangkan menambahkan `deleted_at` (soft delete) pada tabel `questions` dan `question_options` agar histori pertanyaan yang dihapus tetap terjaga dan jawaban lama tidak orphan.

**Index yang disarankan:**
- `villages(kemendagri_code)`
- `survey_responses(village_id, version_id)`
- `answers(response_id)`
- `village_irs_results(village_id, version_id, is_published)`
- `map_popup_cache(village_id, version_id)`

**Database Engine** — Gunakan PostgreSQL jika memungkinkan untuk dukungan tipe `json` yang lebih baik dan kemungkinan upgrade ke PostGIS di masa depan. Jika MySQL, pastikan versi 8.0+ untuk dukungan `json` dan `uuid`.
