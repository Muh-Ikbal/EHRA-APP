<?php

namespace Database\Seeders\Data;

/**
 * Section D: Pembuangan Tinja Manusia dan Lumpur Tinja (D.1 – D.21)
 */
class EhraQuestionsTinjaData
{
    public static function questions(): array
    {
        return [
            [
                'code' => 'D.1', 'text' => 'Dimana anggota keluarga bila ingin buang air besar?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => '1', 'label' => 'Jamban pribadi'],
                    ['value' => '2', 'label' => 'Jamban tetangga/saudara'],
                    ['value' => '3', 'label' => 'MCK/WC Umum'],
                    ['value' => '4', 'label' => 'Ke empang/kolam/sungai/pantai/kebun/selokan/got/saluran irigasi/drainase', 'risk' => true],
                ],
                'skip' => ['4' => 'D.2'],
            ],
            [
                'code' => 'D.2', 'text' => 'Apakah masih ada orang lain/tetangga di lingkungan ibu yang buang air besar sembarangan di tempat terbuka?',
                'type' => 'multi_choice', 'obs' => false, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => 'A', 'label' => 'Anak laki-laki balita', 'risk' => true],
                    ['value' => 'B', 'label' => 'Anak perempuan balita', 'risk' => true],
                    ['value' => 'C', 'label' => 'Anak dan remaja laki-laki', 'risk' => true],
                    ['value' => 'D', 'label' => 'Anak dan remaja perempuan', 'risk' => true],
                    ['value' => 'E', 'label' => 'Laki-laki dewasa', 'risk' => true],
                    ['value' => 'F', 'label' => 'Perempuan dewasa', 'risk' => true],
                    ['value' => 'G', 'label' => 'Masih ada tapi tidak tahu/jelas siapa', 'risk' => true],
                    ['value' => 'H', 'label' => 'Tidak ada'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.3', 'text' => 'Apa jenis jamban yang responden/ibu punyai di rumah?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 3,
                'options' => [
                    ['value' => '1', 'label' => 'Kloset leher angsa tersambung ke IPAL'],
                    ['value' => '2', 'label' => 'Kloset leher angsa dengan tangki septik fabrikasi sesuai SNI'],
                    ['value' => '3', 'label' => 'Kloset leher angsa dengan tangki septik konstruksi sendiri'],
                    ['value' => '4', 'label' => 'Kloset leher angsa dengan cubluk/lubang tanah', 'risk' => true],
                    ['value' => '5', 'label' => 'Plengsengan dengan cubluk/lubang tanah', 'risk' => true],
                    ['value' => '6', 'label' => 'Cemplung dengan cubluk/lubang tanah', 'risk' => true],
                    ['value' => '7', 'label' => 'Kloset/plengsengan/cemplung ke empang/sungai/drainase', 'risk' => true],
                ],
                'skip' => [
                    '1' => 'D.12',
                    '2' => 'D.8',
                    '3' => 'D.8',
                    '7' => 'D.16',
                ],
            ],
            [
                'code' => 'D.4', 'text' => 'Lihat dan Amati: Apakah jarak sumur resapan/cubluk dengan sumber air terdekat minimal 10 meter?',
                'type' => 'single_choice', 'obs' => true, 'required' => false, 'sort' => 4,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.5', 'text' => 'Lihat dan Amati: Apakah lantai dan dinding jamban dalam kondisi bersih dan tidak berbau?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.6', 'text' => 'Lihat dan Amati: Apakah jamban bebas dari kecoa, lalat, dan binatang pengganggu lainnya?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.7', 'text' => 'Lihat dan Amati: Jika ada kloset jongkok/duduk leher angsa, apakah ada air untuk menyiram/mencebok?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 7,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.8', 'text' => 'Apakah terdapat lubang udara/ventilasi di tangki septik Ibu?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 8,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.9', 'text' => 'Tanya, Lihat dan Amati: Apakah terdapat lubang penyedotan di tangki septik Ibu?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 9,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.10', 'text' => 'Kemanakah pembuangan akhir dari tangki septik Ibu/responden?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 10,
                'options' => [
                    ['value' => '1', 'label' => 'Sumur resapan'],
                    ['value' => '2', 'label' => 'Drainase', 'risk' => true],
                    ['value' => '3', 'label' => 'Sungai/badan air/kolam/laut', 'risk' => true],
                    ['value' => '4', 'label' => 'Tidak ada/meresap ke bawah/dinding tangki', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.11', 'text' => 'Sudah berapa lama tangki septik ini dibuat/dibangun?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 11,
                'options' => [
                    ['value' => '1', 'label' => '0–12 bulan yang lalu'],
                    ['value' => '2', 'label' => '1–5 tahun yang lalu'],
                    ['value' => '3', 'label' => '5–10 tahun yang lalu'],
                    ['value' => '4', 'label' => 'Lebih dari 10 tahun yang lalu', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.12', 'text' => 'Kapan tangki septik terakhir dikosongkan/disedot?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 12,
                'options' => [
                    ['value' => '1', 'label' => '0–3 tahun yang lalu'],
                    ['value' => '2', 'label' => '3–5 tahun yang lalu'],
                    ['value' => '3', 'label' => '5–10 tahun yang lalu', 'risk' => true],
                    ['value' => '4', 'label' => 'Lebih dari 10 tahun yang lalu', 'risk' => true],
                    ['value' => '5', 'label' => 'Tidak pernah', 'risk' => true],
                ],
                'skip' => ['5' => 'D.16'],
            ],
            [
                'code' => 'D.13', 'text' => 'Siapa yang mengosongkan tangki septik Ibu?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 13,
                'options' => [
                    ['value' => '1', 'label' => 'Layanan sedot tinja pemerintah/swasta'],
                    ['value' => '2', 'label' => 'Membayar tukang'],
                    ['value' => '3', 'label' => 'Dikosongkan sendiri', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.14', 'text' => 'Apakah Ibu tahu, ke mana lumpur tinja dibuang pada saat tangki septik dikosongkan/disedot?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 14,
                'options' => [
                    ['value' => '1', 'label' => 'IPLT'],
                    ['value' => '2', 'label' => 'Dibuang ke sungai/selokan/parit/kolam/drainase', 'risk' => true],
                    ['value' => '3', 'label' => 'Dikubur'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.15', 'text' => 'Berapa biaya yang pernah dikeluarkan ketika terakhir kali tangki septik disedot/dikosongkan?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 15,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari Rp100 ribu'],
                    ['value' => '2', 'label' => 'Rp100 ribu s.d. Rp200 ribu'],
                    ['value' => '3', 'label' => 'Rp201 ribu s.d Rp300 ribu'],
                    ['value' => '4', 'label' => 'Rp301 ribu s.d Rp400 ribu'],
                    ['value' => '5', 'label' => 'Lebih dari Rp400 ribu'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.16', 'text' => 'Apakah di rumah ada anak 0–5 tahun?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 16,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => ['2' => 'D.19'],
            ],
            [
                'code' => 'D.17', 'text' => 'Bagaimana cara penanganan tinja bayi dan balita yang menggunakan popok sekali pakai/pampers?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 17,
                'options' => [
                    ['value' => '1', 'label' => 'Tinja dibersihkan di jamban dan popok dibuang ke tempat sampah'],
                    ['value' => '2', 'label' => 'Ditanam', 'risk' => true],
                    ['value' => '3', 'label' => 'Dibuang di tempat sampah', 'risk' => true],
                    ['value' => '4', 'label' => 'Dibuang di sembarang tempat', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.18', 'text' => 'Apakah anak balita di rumah Ibu masih terbiasa buang air besar di lantai, kebun, jalan, selokan/got atau sungai?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 18,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, sangat sering', 'risk' => true],
                    ['value' => '2', 'label' => 'Ya, kadang-kadang', 'risk' => true],
                    ['value' => '3', 'label' => 'Tidak'],
                ],
                'skip' => null,
            ],
            // Sub-section: Kemauan dan Kemampuan Membayar Layanan Sedot Lumpur Tinja
            [
                'code' => 'D.19', 'text' => 'Apabila ada program layanan sedot lumpur tinja terjadwal, apakah Bapak/Ibu akan berlangganan?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 19,
                'options' => [
                    ['value' => '1', 'label' => 'Mau berlangganan dengan membayar'],
                    ['value' => '2', 'label' => 'Tidak mau berlangganan'],
                ],
                'skip' => ['2' => 'D.21'],
            ],
            [
                'code' => 'D.20', 'text' => 'Berapa Bapak/Ibu sanggup membayar biaya penyedotan lumpur tinja?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 20,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari Rp100.000'],
                    ['value' => '2', 'label' => 'Rp100.000 s.d Rp200.000'],
                    ['value' => '3', 'label' => 'Rp200.000 s.d Rp300.000'],
                    ['value' => '4', 'label' => 'Rp300.000 s.d Rp400.000'],
                    ['value' => '5', 'label' => 'Lebih dari Rp400.000'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'D.21', 'text' => 'Apa yang menyebabkan Bapak/Ibu tidak berkeinginan berlangganan penyedotan lumpur tinja?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 21,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak sanggup membayar biaya penyedotan'],
                    ['value' => '2', 'label' => 'Belum perlu'],
                ],
                'skip' => null,
            ],
        ];
    }
}
