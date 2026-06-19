# Implementasi Fitur Pembuatan Kuesioner EHRA

Berdasarkan analisis terhadap `PRD_EHRA.md` dan `EHRA_Database_Schema(1).md`, fitur "Manajemen Kuesioner" adalah salah satu fitur paling krusial dan kompleks dalam aplikasi ini.

## Analisis Struktur Kuesioner EHRA

Kuesioner EHRA bukan sekadar form biasa, melainkan instrumen terstruktur untuk menghitung Indeks Risiko Sanitasi (IRS). Strukturnya memiliki hierarki berikut:

1. **Questionnaire Version**: Kuesioner bisa memiliki versi (misal: "EHRA 2026-2029"). Hanya satu versi yang aktif pada satu waktu.
2. **IRS Components**: Pilar penilaian (Air Minum, Jamban, Persampahan, dll) yang akan dihitung IRS-nya.
3. **Sections**: Bagian kuesioner (A. Identitas, C. Pengelolaan Sampah). Section bisa dikaitkan dengan IRS Component (jika berisi pertanyaan yang dinilai).
4. **Questions**: Pertanyaan dengan berbagai tipe (`single_choice`, `multi_choice`, `text`, dll), dukungan *skip logic* (aturan loncat), dan bisa berstatus *observation* (pengamatan enumerator).
5. **Question Options**: Pilihan jawaban. Sangat penting karena jawaban tertentu dapat di-*flag* sebagai risiko (`is_risk_flag = true`) beserta bobotnya.
6. **IRS Weights**: Pemetaan akhir seberapa besar sebuah kondisi risiko (jawaban) menyumbang pada total skor komponen IRS.

---

## User Review Required

> [!IMPORTANT]
> Mengingat kompleksitas relasi (Versi → Komponen → Section → Pertanyaan → Opsi), saya mengusulkan pendekatan **Single Page Builder (SPA)** menggunakan React untuk halaman pembuat kuesioner. Seluruh struktur akan di-manage di *client-side* dan disimpan ke backend dalam satu atau beberapa *batch request*. 
> 
> Apakah Anda setuju dengan pendekatan antarmuka *builder* interaktif ini, atau lebih memilih form CRUD tradisional per elemen (yang mungkin lebih lambat untuk digunakan)?

## Open Questions

> [!WARNING]
> 1. **Data Awal**: Apakah Anda ingin saya membuatkan fitur ini agar admin membangun kuesioner dari nol, atau apakah Anda ingin saya juga membuatkan **Seeder** berisi *template* Kuesioner EHRA standar Kemenkes sebagai contoh?
> 2. **Skip Logic UI**: Implementasi visual untuk aturan loncat (*skip logic*) bisa sangat rumit. Untuk MVP, apakah cukup menggunakan antarmuka sederhana (Pilih Jawaban -> Loncat ke Pertanyaan Kode X)?

---

## Proposed Changes

### Backend (Controllers & Routing)

#### [NEW] `app/Http/Controllers/Admin/QuestionnaireController.php`
- Menangani CRUD untuk `QuestionnaireVersion`.
- Mengatur versi mana yang sedang `is_active`.

#### [NEW] `app/Http/Controllers/Admin/QuestionnaireBuilderController.php`
- Controller khusus untuk menangani *builder* kuesioner.
- `edit`: Me-load seluruh struktur (komponen, section, question, option) dari suatu versi untuk di-render di React.
- `save`: Menerima *payload* JSON besar dari React frontend dan melakukan sinkronisasi (Create/Update/Delete) terhadap seluruh relasi (Section, Question, Option, IRS Weights) secara transaksional (`DB::transaction`).

#### [MODIFY] `routes/web.php`
- Menambahkan grup routing `/admin/questionnaires` dengan *middleware* admin.

---

### Frontend (React + Inertia.js + Tailwind)

#### [NEW] `resources/js/Pages/Admin/Questionnaire/Index.tsx`
- Halaman daftar versi kuesioner.
- Tombol untuk membuat versi baru, mengaktifkan versi, dan tombol "Builder" untuk mengedit struktur kuesioner.

#### [NEW] `resources/js/Pages/Admin/Questionnaire/Builder.tsx`
- Halaman utama Builder. Akan dibagi menjadi beberapa *Tab* atau *Accordion* UI:
  1. **Tab IRS Components**: Mendefinisikan komponen pilar sanitasi.
  2. **Tab Sections**: Membuat bagian-bagian kuesioner dan menghubungkannya dengan IRS Components.
  3. **Tab Editor Kuesioner**: UI dinamis tempat Admin bisa menambah pertanyaan per section, menentukan tipe input, dan menambah opsi jawaban beserta pengaturan *flag* risiko.
  4. **Tab IRS Scoring/Weights**: UI khusus untuk mengatur bobot (weight) pada pertanyaan yang memicu risiko.

#### [NEW] `resources/js/Components/QuestionnaireBuilder/*.tsx`
- Komponen-komponen pendukung UI builder:
  - `SectionEditor.tsx`
  - `QuestionEditor.tsx`
  - `OptionEditor.tsx`
  - `LogicEditor.tsx` (untuk skip logic)

---

## Verification Plan

### Automated Tests
- Memastikan `QuestionnaireBuilderController::save` dapat memproses payload JSON kompleks dan menyimpannya secara konsisten ke 6 tabel berbeda.
- Menguji integritas *Foreign Key* saat struktur diperbarui.

### Manual Verification
- Menjalankan server, masuk sebagai Admin, membuat versi kuesioner baru.
- Mencoba antarmuka Builder: menambah section, pertanyaan, opsi risiko, lalu menyimpannya.
- Membaca ulang data di halaman Builder untuk memastikan struktur yang tersimpan ditampilkan dengan benar (tidak hilang atau *corrupted*).
