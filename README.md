# Aplikasi EHRA (Environmental Health Risk Assessment)

EHRA-APP adalah sistem informasi berbasis web yang dirancang khusus untuk memfasilitasi pelaksanaan dan analisis **Penilaian Risiko Kesehatan Lingkungan (EHRA)**. Aplikasi ini memungkinkan pemerintah daerah atau instansi terkait untuk membuat kuesioner dinamis, mengumpulkan data lapangan melalui enumerator, dan secara otomatis menghitung **Indeks Risiko Sanitasi (IRS)** pada tingkat desa/kelurahan.

## ✨ Fitur Utama

- **Builder Kuesioner Dinamis (Form Builder)**
  Admin dapat membuat dan merancang kuesioner EHRA secara fleksibel. Mendukung berbagai tipe pertanyaan (pilihan ganda, teks, angka) serta pengaturan logika lompat (*skip logic*).
  
- **Manajemen Bobot IRS (Indeks Risiko Sanitasi)**
  Fitur kalkulasi cerdas di mana admin dapat menentukan "Kondisi Risiko" dari setiap jawaban kuesioner dan memberikan bobot (%). Sistem akan menghitung skor IRS setiap desa secara otomatis berdasarkan data yang dikumpulkan.
  
- **Aplikasi Enumerator (Mobile-Friendly)**
  Tampilan antarmuka pengisian survei di lapangan yang dioptimalkan untuk perangkat *mobile*. Mendukung penyimpanan data koordinat lokasi (Geotagging) untuk validitas pemetaan.
  
- **Visualisasi Peta & Dashboard**
  Dilengkapi dengan integrasi pemetaan (Leaflet & GeoJSON) untuk memvisualisasikan tingkat risiko sanitasi per wilayah (misalnya: tingkat risiko tinggi berwarna merah, aman berwarna hijau).
  
- **Sistem Role & Multi-Tenancy**
  Dilengkapi dengan hak akses (Role-Based Access Control) untuk Super Admin, Admin Kabupaten/Kota, dan Enumerator Lapangan.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan *stack* teknologi modern untuk menjamin performa dan skalabilitas:

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React.js 18 dengan TypeScript
- **Penghubung (Bridge):** Inertia.js (SPA tanpa API berulang)
- **Styling:** Tailwind CSS & Lucide Icons
- **Database:** MariaDB / MySQL (Dukungan penuh untuk fitur pencarian JSON)
- **Pemetaan:** React-Leaflet (GeoJSON Terintegrasi)

## 🚀 Cara Instalasi (Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi ini secara lokal:

1. **Clone repositori**
   ```bash
   git clone https://github.com/Muh-Ikbal/EHRA-APP.git
   cd EHRA-APP
   ```

2. **Install Dependensi PHP & Node.js**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment**
   Salin file konfigurasi lalu sesuaikan pengaturan database Anda:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Migrasi dan Seeding Database**
   Jalankan perintah ini untuk membuat struktur tabel sekaligus mengisi data awal (dummy data, akun admin, dll):
   ```bash
   php artisan migrate --seed
   ```

5. **Jalankan Aplikasi**
   Anda membutuhkan dua terminal yang berjalan bersamaan:
   ```bash
   # Terminal 1 (Menjalankan server PHP/Laravel)
   php artisan serve
   
   # Terminal 2 (Menjalankan Vite build tool untuk React)
   npm run dev
   ```
   Aplikasi dapat diakses melalui `http://localhost:8000`.

## 📚 Hak Akses / Akun Default (Testing)
*(Opsional: Jika menggunakan Seeder bawaan)*
- **Email:** admin@ehra.local
- **Password:** password

## 📝 Lisensi
Proyek ini bersifat tertutup (Proprietary) atau sesuai dengan perjanjian instansi terkait.
