<?php

namespace Database\Seeders\Data;

/**
 * Section F: Pengelolaan Air Minum, Masak dan Keperluan Higiene dan Sanitasi
 * F.1 (Sumber Air) + F.2 (Perilaku Pengelolaan Air)
 */
class EhraQuestionsAirData
{
    public static function questions(): array
    {
        return [
            // F.1.1 — Matrix sumber air (Minum, Masak, Mencuci, Mandi, Gosok Gigi)
            [
                'code' => 'F.1.1', 'text' => 'Amati: Sumber air untuk minum, masak, mencuci alat makan, mandi, dan gosok gigi',
                'type' => 'matrix', 'obs' => true, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => 'A', 'label' => 'Air kemasan bermerk'],
                    ['value' => 'B', 'label' => 'Air isi ulang dari depot air minum isi ulang'],
                    ['value' => 'C', 'label' => 'Air ledeng dari PDAM/Proyek/HIPPAM sendiri'],
                    ['value' => 'D', 'label' => 'Air ledeng dari PDAM/Proyek/HIPPAM tetangga'],
                    ['value' => 'E', 'label' => 'Air ledeng eceran dari PDAM/Proyek/HIPPAM'],
                    ['value' => 'F', 'label' => 'Air dari hidran/kran umum – PDAM/HIPPAM/Proyek'],
                    ['value' => 'G', 'label' => 'Air dari terminal air PDAM/HIPPAM/Proyek'],
                    ['value' => 'H', 'label' => 'Air dari sumur bor dengan pompa tangan/listrik/mesin'],
                    ['value' => 'I', 'label' => 'Air dari sumur gali terlindungi sendiri'],
                    ['value' => 'J', 'label' => 'Air dari sumur gali terlindungi tetangga'],
                    ['value' => 'K', 'label' => 'Air dari sumur gali tidak terlindungi sendiri', 'risk' => true],
                    ['value' => 'L', 'label' => 'Air dari sumur gali tidak terlindungi tetangga', 'risk' => true],
                    ['value' => 'M', 'label' => 'Air dari mata air terlindungi'],
                    ['value' => 'N', 'label' => 'Air dari mata air tidak terlindungi', 'risk' => true],
                    ['value' => 'O', 'label' => 'Air hujan (PAH/Penampungan Air Hujan terlindungi)'],
                    ['value' => 'P', 'label' => 'Air dari sungai', 'risk' => true],
                    ['value' => 'Q', 'label' => 'Air dari waduk/danau', 'risk' => true],
                ],
                'skip' => null,
                'note' => 'Matrix: kolom = Minum, Masak, Mencuci Alat Makan & Masak, Mandi, Gosok Gigi. Kode: 0=Tidak, 1=Ya',
            ],
            [
                'code' => 'F.1.2', 'text' => 'Amati: Apa wadah/tempat yang digunakan untuk menyimpan air baku untuk air minum di dapur?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak disimpan'],
                    ['value' => '2', 'label' => 'Ya, dalam panci/ember/tempayan tanpa tutup', 'risk' => true],
                    ['value' => '3', 'label' => 'Ya, dalam panci/ember/tempayan yang mempunyai tutup'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.3', 'text' => 'Amati: Bagaimana Ibu mengambil air minum dari wadah penyimpanan air?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 3,
                'options' => [
                    ['value' => '1', 'label' => 'Tangan menyentuh air', 'risk' => true],
                    ['value' => '2', 'label' => 'Tangan tidak menyentuh air'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.4', 'text' => 'Berapa perkiraan jumlah pemakaian air setiap orang per hari dalam rumah Ibu?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 4,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari 60 liter (±4 galon)', 'risk' => true],
                    ['value' => '2', 'label' => '60 liter (±4 galon)'],
                    ['value' => '3', 'label' => 'Lebih dari 60 liter (±4 galon)'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.5', 'text' => 'Berapa jumlah rata-rata pemakaian air untuk air minum setiap orang per hari?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => '0–1 liter', 'risk' => true],
                    ['value' => '2', 'label' => '1–2 liter'],
                    ['value' => '3', 'label' => '> 2 liter'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.6', 'text' => 'Dalam satu tahun terakhir, apakah rumah tangga ibu pernah mengalami kekurangan air minimal 1 bulan?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Pernah', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak pernah'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.7', 'text' => 'Dimana lokasi sumber air minum utama ibu tersebut?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 7,
                'options' => [
                    ['value' => '1', 'label' => 'Di dalam kawasan pagar rumah'],
                    ['value' => '2', 'label' => 'Di luar kawasan pagar rumah'],
                ],
                'skip' => [['if_question_code' => 'F.1.7', 'operator' => 'equals', 'value' => '1', 'action' => 'jump', 'target_code' => 'F.1.9']],
            ],
            [
                'code' => 'F.1.8', 'text' => 'Jika sumber air di luar kawasan pagar, berapa jarak sumber air minum utama dari rumah?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 8,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari 1 km'],
                    ['value' => '2', 'label' => 'Lebih dari atau sama dengan 1 km', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.9', 'text' => 'Berapa lama waktu yang Ibu habiskan untuk mengakses sumber air minum utama?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 9,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari 30 menit'],
                    ['value' => '2', 'label' => 'Lebih dari 30 menit', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.10', 'text' => 'Apakah Ibu puas dengan kualitas air yang digunakan saat ini?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 10,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.11', 'text' => 'Apakah sumber air sumur/air tanah pernah mengalami kekeringan di waktu kemarau?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 11,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, pernah', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak pernah'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.12', 'text' => 'Berapa kedalaman muka air sumur di lingkungan tempat tinggal Ibu (perkiraan)?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 12,
                'options' => [
                    ['value' => '1', 'label' => '< 1 meter', 'risk' => true],
                    ['value' => '2', 'label' => '1–3 meter'],
                    ['value' => '3', 'label' => '3–6 meter'],
                    ['value' => '4', 'label' => '> 6 meter'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.13', 'text' => 'Berapa jarak sumber air sumur/air tanah ke tempat penampungan tinja?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 13,
                'options' => [
                    ['value' => '1', 'label' => '< 10 m', 'risk' => true],
                    ['value' => '2', 'label' => '≥ 10 m'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.14', 'text' => 'Apakah dalam satu bulan terakhir rumah ibu pernah mengalami gangguan aliran air ledeng?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 14,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak pernah'],
                    ['value' => '2', 'label' => 'Beberapa jam saja'],
                    ['value' => '3', 'label' => 'Satu sampai dua hari', 'risk' => true],
                    ['value' => '4', 'label' => 'Tiga hari sampai kurang dari seminggu', 'risk' => true],
                    ['value' => '5', 'label' => 'Seminggu', 'risk' => true],
                    ['value' => '6', 'label' => 'Lebih dari satu minggu', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.15', 'text' => 'Bagaimana menurut Ibu, kondisi fisik air yang Ibu ambil dari sarana untuk air minum?',
                'type' => 'multi_choice', 'obs' => false, 'required' => true, 'sort' => 15,
                'options' => [
                    ['value' => 'A', 'label' => 'Keruh', 'risk' => true],
                    ['value' => 'B', 'label' => 'Berwarna', 'risk' => true],
                    ['value' => 'C', 'label' => 'Berasa', 'risk' => true],
                    ['value' => 'D', 'label' => 'Berbusa', 'risk' => true],
                    ['value' => 'E', 'label' => 'Berbau', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.16', 'text' => 'Di mana ibu menyimpan air untuk minum dan untuk memasak?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 16,
                'options' => [
                    ['value' => '1', 'label' => 'Wadah stainless steel'],
                    ['value' => '2', 'label' => 'Wadah keramik'],
                    ['value' => '3', 'label' => 'Wadah kaca'],
                    ['value' => '4', 'label' => 'Wadah plastik (dengan tanda gelas garpu)'],
                    ['value' => '5', 'label' => 'Wadah plastik (tanpa tanda gelas garpu)', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.1.17', 'text' => 'Berapa biaya rata-rata per bulan yang dikeluarkan untuk kebutuhan air rumah tangga Ibu?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 17,
                'options' => [
                    ['value' => '1', 'label' => '< Rp300.000'],
                    ['value' => '2', 'label' => 'Rp300.000 – Rp500.000'],
                    ['value' => '3', 'label' => '> Rp500.000'],
                ],
                'skip' => null,
            ],
            // F.2 — Perilaku Pengelolaan, Penyimpanan & Penanganan Air
            [
                'code' => 'F.2.1', 'text' => 'Apakah Ibu mengolah/menangani air sebelum digunakan untuk minum (kecuali air kemasan)?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 18,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => [['if_question_code' => 'F.2.1', 'operator' => 'equals', 'value' => '2', 'action' => 'jump', 'target_code' => 'F.2.3']],
            ],
            [
                'code' => 'F.2.2', 'text' => 'Apa yang biasa ibu lakukan dalam mengolah air agar lebih aman untuk diminum?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 19,
                'options' => [
                    ['value' => '1', 'label' => 'Merebus/memasak hingga mendidih'],
                    ['value' => '2', 'label' => 'Menggunakan filter modern (keramik, bio sand, dll)'],
                    ['value' => '3', 'label' => 'Menjemur di bawah sinar matahari (solar disinfectant)'],
                    ['value' => '4', 'label' => 'Tidak tahu', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.2.3', 'text' => 'Bagaimana ibu menyimpan air yang digunakan untuk minum?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 20,
                'options' => [
                    ['value' => '1', 'label' => 'Panci/ember/jerigen tertutup'],
                    ['value' => '2', 'label' => 'Panci/ember/jerigen tidak tertutup', 'risk' => true],
                    ['value' => '3', 'label' => 'Teko/termos/kendi air'],
                    ['value' => '4', 'label' => 'Galon atau dispenser'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.2.4', 'text' => 'Apakah ibu membersihkan tempat penyimpanan air minum?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 21,
                'options' => [
                    ['value' => '1', 'label' => 'Setiap hari'],
                    ['value' => '2', 'label' => 'Tidak dibersihkan', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'F.2.5', 'text' => 'Bagaimana Ibu mengambil air untuk minum, dari tempat penyimpanan air?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 22,
                'options' => [
                    ['value' => '1', 'label' => 'Langsung dari dispenser'],
                    ['value' => '2', 'label' => 'Menggunakan pompa manual/elektronik pada galon air'],
                    ['value' => '3', 'label' => 'Menggunakan ciduk air', 'risk' => true],
                    ['value' => '4', 'label' => 'Menggunakan gelas'],
                ],
                'skip' => null,
            ],
        ];
    }
}
