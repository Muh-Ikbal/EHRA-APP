<?php

namespace Database\Seeders\Data;

/**
 * Section A: Informasi Umum
 * Section B: Informasi Responden
 */
class EhraQuestionsInfoData
{
    /**
     * A. Informasi Umum — data pelaksanaan survei dan rumah tangga.
     */
    public static function sectionA(): array
    {
        return [
            ['code' => 'A.1', 'text' => 'Tanggal Survei', 'type' => 'date', 'obs' => false, 'required' => true, 'sort' => 1, 'options' => [], 'skip' => null],
            ['code' => 'A.2', 'text' => 'Jam wawancara/lama wawancara', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 2, 'options' => [], 'skip' => null],
            ['code' => 'A.3', 'text' => 'Nama Pewawancara/Enumerator', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 3, 'options' => [], 'skip' => null],
            ['code' => 'A.4', 'text' => 'Nama Supervisor', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 4, 'options' => [], 'skip' => null],
            ['code' => 'A.5', 'text' => 'Nama Koordinator Kecamatan', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 5, 'options' => [], 'skip' => null],
            ['code' => 'A.6', 'text' => 'Nama Kepala Rumah Tangga', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 6, 'options' => [], 'skip' => null],
            ['code' => 'A.7', 'text' => 'Jumlah Keluarga dalam Rumah (jumlah KK yang tinggal dalam satu rumah)', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 7, 'options' => [], 'skip' => null],
            ['code' => 'A.8.L', 'text' => 'Jumlah jiwa dalam Rumah — Laki-laki', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 8, 'options' => [], 'skip' => null],
            ['code' => 'A.8.P', 'text' => 'Jumlah jiwa dalam Rumah — Perempuan', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 9, 'options' => [], 'skip' => null],
            ['code' => 'A.9', 'text' => 'Nama Responden', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 10, 'options' => [], 'skip' => null],
            [
                'code' => 'A.10', 'text' => 'Hubungan responden dengan Kepala Rumah Tangga',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 11,
                'options' => [
                    ['value' => '1', 'label' => 'Istri'],
                    ['value' => '2', 'label' => 'Anak perempuan yang sudah menikah/dewasa'],
                    ['value' => '3', 'label' => 'Kepala keluarga'],
                ],
                'skip' => null,
            ],
            ['code' => 'A.11', 'text' => 'Alamat/Telpon', 'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 12, 'options' => [], 'skip' => null],
        ];
    }

    /**
     * B. Informasi Responden — data sosial-ekonomi responden.
     */
    public static function sectionB(): array
    {
        return [
            ['code' => 'B.1', 'text' => 'Maaf, berapakah usia responden sekarang?', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 1, 'options' => [], 'skip' => null],
            [
                'code' => 'B.2', 'text' => 'Maaf, apa status rumah yang responden tempati saat ini?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Milik sendiri'],
                    ['value' => '2', 'label' => 'Rumah Dinas'],
                    ['value' => '3', 'label' => 'Berbagi dengan keluarga lain'],
                    ['value' => '4', 'label' => 'Sewa'],
                    ['value' => '5', 'label' => 'Kontrak'],
                    ['value' => '6', 'label' => 'Milik orang tua/anak/saudara'],
                ],
                'skip' => null,
            ],
            ['code' => 'B.3', 'text' => 'Luas lahan (rumah dan pekarangan)', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 3, 'options' => [], 'skip' => null],
            [
                'code' => 'B.4', 'text' => 'Jenis bangunan rumah',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 4,
                'options' => [
                    ['value' => '1', 'label' => 'Permanen'],
                    ['value' => '2', 'label' => 'Semi permanen'],
                    ['value' => '3', 'label' => 'Darurat'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'B.5', 'text' => 'Maaf, apa pendidikan terakhir responden?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak sekolah formal'],
                    ['value' => '2', 'label' => 'SD'],
                    ['value' => '3', 'label' => 'SMP'],
                    ['value' => '4', 'label' => 'SMA'],
                    ['value' => '5', 'label' => 'SMK/Kejuruan'],
                    ['value' => '6', 'label' => 'Universitas/Akademi'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'B.6', 'text' => 'Maaf, apakah responden/Ibu mempunyai Surat Keterangan Tidak Mampu (SKTM) atau sejenisnya dari desa/kelurahan?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => null,
            ],
            ['code' => 'B.7', 'text' => 'Maaf, berapa besar pengeluaran rumah tangga keluarga responden/Ibu setiap bulan?', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 7, 'options' => [], 'skip' => null],
            [
                'code' => 'B.8', 'text' => 'Maaf, berapa besar penghasilan rumah tangga keluarga responden/Ibu setiap bulan?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 8,
                'options' => [
                    ['value' => '1', 'label' => '≤ Rp1.800.000'],
                    ['value' => '2', 'label' => 'Rp1.800.001–Rp3.000.000'],
                    ['value' => '3', 'label' => 'Rp3.000.001–Rp4.800.000'],
                    ['value' => '4', 'label' => 'Rp4.800.001–Rp7.200.000'],
                    ['value' => '5', 'label' => '≥ Rp7.200.000'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'B.9', 'text' => 'Maaf, apakah responden/Ibu mempunyai Kartu Jaminan Kesehatan (BPJS, Kartu Indonesia Sehat) atau sejenisnya?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 9,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'B.10', 'text' => 'Bantuan apa yang pernah diterima keluarga untuk sektor air minum dan sanitasi?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 10,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak pernah menerima bantuan'],
                    ['value' => '2', 'label' => 'Menerima 1 bantuan'],
                    ['value' => '3', 'label' => 'Menerima lebih dari 1 bantuan'],
                ],
                'skip' => null,
            ],
            ['code' => 'B.11', 'text' => 'Sudah berapa lama tinggal di sini?', 'type' => 'number', 'obs' => false, 'required' => true, 'sort' => 11, 'options' => [], 'skip' => null],
            [
                'code' => 'B.12', 'text' => 'Maaf, apa responden mempunyai anak?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 12,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => null,
            ],
            // B.13 — sub-pertanyaan jumlah anak laki-laki per kelompok umur
            [
                'code' => 'B.13', 'text' => 'Berapa jumlah anak laki-laki yang tinggal di rumah ini dengan kelompok umur:',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 13,
                'options' => [],
                'skip' => null,
                'children' => [
                    ['code' => 'B.13.A', 'text' => 'Anak laki-laki kurang dari 2 tahun', 'type' => 'number', 'sort' => 1],
                    ['code' => 'B.13.B', 'text' => 'Anak laki-laki 2 – < 5 tahun', 'type' => 'number', 'sort' => 2],
                    ['code' => 'B.13.C', 'text' => 'Anak laki-laki 6 – 12 tahun', 'type' => 'number', 'sort' => 3],
                    ['code' => 'B.13.D', 'text' => 'Anak laki-laki lebih dari 12 tahun', 'type' => 'number', 'sort' => 4],
                ],
            ],
            // B.14 — sub-pertanyaan jumlah anak perempuan per kelompok umur
            [
                'code' => 'B.14', 'text' => 'Berapa jumlah anak perempuan yang tinggal di rumah ini dengan kelompok umur:',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 14,
                'options' => [],
                'skip' => null,
                'children' => [
                    ['code' => 'B.14.A', 'text' => 'Anak perempuan kurang dari 2 tahun', 'type' => 'number', 'sort' => 1],
                    ['code' => 'B.14.B', 'text' => 'Anak perempuan 2 – < 5 tahun', 'type' => 'number', 'sort' => 2],
                    ['code' => 'B.14.C', 'text' => 'Anak perempuan 6 – 12 tahun', 'type' => 'number', 'sort' => 3],
                    ['code' => 'B.14.D', 'text' => 'Anak perempuan lebih dari 12 tahun', 'type' => 'number', 'sort' => 4],
                ],
            ],
        ];
    }
}
