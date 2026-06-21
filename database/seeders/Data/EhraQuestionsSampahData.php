<?php

namespace Database\Seeders\Data;

/**
 * Section C: Pengelolaan Sampah Rumah Tangga (C.1 – C.21)
 */
class EhraQuestionsSampahData
{
    public static function questions(): array
    {
        return [
            ['code' => 'C.1', 'text' => 'Berapa timbulan sampah yang keluarga Ibu hasilkan dalam satu hari? (perkiraan)', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 1, 'options' => [], 'skip' => null],
            [
                'code' => 'C.2', 'text' => 'Amati: Apakah sekeliling halaman bersih dari sampah?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.3', 'text' => 'Bagaimana kondisi sampah di sekitar lingkungan RT/RW rumah responden/Ibu?',
                'type' => 'multi_choice', 'obs' => false, 'required' => true, 'sort' => 3,
                'options' => [
                    ['value' => 'A', 'label' => 'Banyak sampah berserakan atau bertumpuk di sekitar lingkungan', 'risk' => true],
                    ['value' => 'B', 'label' => 'Banyak lalat di sekitar tumpukan sampah', 'risk' => true],
                    ['value' => 'C', 'label' => 'Banyak tikus berkeliaran', 'risk' => true],
                    ['value' => 'D', 'label' => 'Banyak nyamuk', 'risk' => true],
                    ['value' => 'E', 'label' => 'Banyak kucing dan anjing mendatangi tumpukan sampah', 'risk' => true],
                    ['value' => 'F', 'label' => 'Bau busuk yang mengganggu', 'risk' => true],
                    ['value' => 'G', 'label' => 'Menyumbat saluran drainase', 'risk' => true],
                    ['value' => 'H', 'label' => 'Ada anak-anak yang bermain di sekitarnya', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.4', 'text' => 'Tanya, Lihat dan Amati: Bagaimana sampah rumah tangga dikelola?',
                'type' => 'multi_choice', 'obs' => true, 'required' => true, 'sort' => 4,
                'options' => [
                    ['value' => 'A', 'label' => 'Dikumpulkan pada tempat sampah yang tertutup, kuat dan mudah dibersihkan'],
                    ['value' => 'B', 'label' => 'Dilakukan pemilahan sampah'],
                    ['value' => 'C', 'label' => 'Dikumpulkan oleh kolektor informal yang mendaur ulang dan/atau sampah organik ditimbun/kompos'],
                    ['value' => 'D', 'label' => 'Dikumpulkan dan dibuang ke TPS'],
                    ['value' => 'E', 'label' => 'Dibakar', 'risk' => true],
                    ['value' => 'F', 'label' => 'Dibuang ke dalam lubang dan ditutup dengan tanah', 'risk' => true],
                    ['value' => 'G', 'label' => 'Dibuang ke dalam lubang tetapi tidak ditutup dengan tanah', 'risk' => true],
                    ['value' => 'H', 'label' => 'Dibuang ke sungai/kali/laut/danau', 'risk' => true],
                    ['value' => 'I', 'label' => 'Dibiarkan saja sampai membusuk', 'risk' => true],
                    ['value' => 'J', 'label' => 'Dibuang ke lahan kosong/kebun/hutan', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.5', 'text' => 'Lihat dan Amati: Apakah ada wadah/tempat yang dipakai untuk mengumpulkan sampah di dapur dan ruangan lain di dalam rumah?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, menggunakan kantong plastik tertutup'],
                    ['value' => '2', 'label' => 'Ya, menggunakan kantong plastik terbuka', 'risk' => true],
                    ['value' => '3', 'label' => 'Ya, tempat sampah terbuka', 'risk' => true],
                    ['value' => '4', 'label' => 'Ya, tempat sampah tertutup'],
                    ['value' => '5', 'label' => 'Tidak ada', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.6', 'text' => 'Apakah Ibu melakukan pemilahan sampah di rumah sebelum dibuang?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => ['2' => 'C.8'],
            ],
            [
                'code' => 'C.7', 'text' => 'Jika mendaur ulang, apa saja jenis sampah yang dipilah/dipisahkan sebelum dibuang?',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 7,
                'options' => [
                    ['value' => 'A', 'label' => 'Sampah organik/sampah basah'],
                    ['value' => 'B', 'label' => 'Plastik'],
                    ['value' => 'C', 'label' => 'Gelas atau kaca'],
                    ['value' => 'D', 'label' => 'Kertas'],
                    ['value' => 'E', 'label' => 'Besi/logam'],
                    ['value' => 'F', 'label' => 'Bahan Berbahaya dan Beracun (B3)'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.8', 'text' => 'Seberapa sering petugas mengangkut sampah dari rumah?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 8,
                'options' => [
                    ['value' => '1', 'label' => 'Tiap hari'],
                    ['value' => '2', 'label' => 'Beberapa kali dalam seminggu'],
                    ['value' => '3', 'label' => 'Sekali dalam seminggu'],
                    ['value' => '4', 'label' => 'Beberapa kali dalam sebulan', 'risk' => true],
                    ['value' => '5', 'label' => 'Sekali dalam sebulan', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.9', 'text' => 'Dari pengalaman dalam sebulan terakhir ini, apakah sampah selalu diangkut tepat waktu?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 9,
                'options' => [
                    ['value' => '1', 'label' => 'Tepat waktu'],
                    ['value' => '2', 'label' => 'Sering terlambat', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.10', 'text' => 'Apakah layanan pengangkutan sampah oleh tukang sampah itu berbayar?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 10,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => ['2' => 'C.13'],
            ],
            [
                'code' => 'C.11', 'text' => 'Kepada siapa membayarnya?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 11,
                'options' => [
                    ['value' => '1', 'label' => 'Pemungut uang sampah dari RT'],
                    ['value' => '2', 'label' => 'Pemungut uang sampah dari Desa/Kelurahan'],
                    ['value' => '3', 'label' => 'Pemungut uang sampah dari perusahaan swasta'],
                ],
                'skip' => null,
            ],
            ['code' => 'C.12', 'text' => 'Berapa biaya yang dikeluarkan dalam sebulan untuk membayar layanan sampah?', 'type' => 'number', 'obs' => false, 'required' => false, 'sort' => 12, 'options' => [], 'skip' => null],
            [
                'code' => 'C.13', 'text' => 'Amati: Apakah di rumah responden ada tempat serta kegiatan untuk membuat kompos?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 13,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => ['2' => 'C.16'],
            ],
            [
                'code' => 'C.14', 'text' => 'Amati: Apakah ada kompos yang sudah bisa dipakai?',
                'type' => 'single_choice', 'obs' => true, 'required' => false, 'sort' => 14,
                'options' => [
                    ['value' => '1', 'label' => 'Ada'],
                    ['value' => '2', 'label' => 'Tidak ada'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.15', 'text' => 'Amati: Untuk apa saja kompos dipakai oleh responden?',
                'type' => 'multi_choice', 'obs' => true, 'required' => false, 'sort' => 15,
                'options' => [
                    ['value' => 'A', 'label' => 'Pupuk tanaman hias, buah, sayur'],
                    ['value' => 'B', 'label' => 'Dijual'],
                    ['value' => 'C', 'label' => 'Tidak dimanfaatkan'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.16', 'text' => 'Amati: Apakah di halaman ada benda yang dapat menyebabkan air tergenang (ban bekas, kaleng, panci, ember)?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 16,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, di halaman ada benda yang dapat menyebabkan air tergenang', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak, halaman bersih dari benda yang dapat menyebabkan air tergenang'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.17', 'text' => 'Amati: Apakah Ibu dapat melihat saluran air hujan atau saluran air limbah di dekat rumah?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 17,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, terbuka'],
                    ['value' => '2', 'label' => 'Ya, tertutup, tidak terlihat'],
                    ['value' => '3', 'label' => 'Tidak, tidak terlihat'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.18', 'text' => 'Amati: Apakah air di saluran dapat mengalir?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 18,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                    ['value' => '3', 'label' => 'Tidak ada saluran'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.19', 'text' => 'Amati: Apakah saluran air bersih dari sampah?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 19,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, bersih atau hampir selalu bersih dari sampah'],
                    ['value' => '2', 'label' => 'Tidak bersih dari sampah, tapi air masih dapat mengalir', 'risk' => true],
                    ['value' => '3', 'label' => 'Tidak bersih dari sampah, saluran tersumbat', 'risk' => true],
                    ['value' => '4', 'label' => 'Tidak bersih dari sampah, tapi saluran kering', 'risk' => true],
                    ['value' => '5', 'label' => 'Tidak ada saluran'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'C.20', 'text' => 'Apakah di rumah ibu/responden ada yang pernah/sedang melakukan perawatan/sakit?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 20,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => ['2' => 'D.1'],
            ],
            [
                'code' => 'C.21', 'text' => 'Bagaimana ibu/responden mengelola sampah anggota keluarga yang sedang melakukan perawatan/sakit di rumah (masker, sarung tangan, dll)?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 21,
                'options' => [
                    ['value' => '1', 'label' => 'Dibuang bersama sampah lain', 'risk' => true],
                    ['value' => '2', 'label' => 'Dipisah dengan sampah lain tanpa disinfektan', 'risk' => true],
                    ['value' => '3', 'label' => 'Dipisah dengan sampah biasa dan disemprot desinfektan'],
                    ['value' => '4', 'label' => 'Dipisah, disemprot desinfektan dan digunting/dihancurkan'],
                ],
                'skip' => null,
            ],
        ];
    }
}
