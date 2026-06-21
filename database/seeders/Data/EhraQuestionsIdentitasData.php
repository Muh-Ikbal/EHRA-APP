<?php

namespace Database\Seeders\Data;

/**
 * Section ID: Identitas Wilayah
 *
 * Semua pertanyaan di section ini auto_fill = true.
 * Data diambil dari relasi: User → enumerator_villages → village → district → city → province.
 */
class EhraQuestionsIdentitasData
{
    public static function questions(): array
    {
        return [
            [
                'code' => 'ID.1', 'text' => 'Kode Provinsi (sesuai ketentuan Kemendagri)',
                'type' => 'text', 'obs' => false, 'required' => false, 'sort' => 1,
                'options' => [], 'skip' => null,
                'note' => 'Auto-fill dari provinces.kemendagri_code via village assignment',
            ],
            [
                'code' => 'ID.2', 'text' => 'Kode Kabupaten/Kota (sesuai ketentuan Kemendagri)',
                'type' => 'text', 'obs' => false, 'required' => false, 'sort' => 2,
                'options' => [], 'skip' => null,
                'note' => 'Auto-fill dari cities.kemendagri_code via village assignment',
            ],
            [
                'code' => 'ID.3', 'text' => 'Kode Kecamatan (sesuai ketentuan Kemendagri)',
                'type' => 'text', 'obs' => false, 'required' => false, 'sort' => 3,
                'options' => [], 'skip' => null,
                'note' => 'Auto-fill dari districts.kemendagri_code via village assignment',
            ],
            [
                'code' => 'ID.4', 'text' => 'Kode Desa/Kelurahan (sesuai ketentuan Kemendagri)',
                'type' => 'text', 'obs' => false, 'required' => false, 'sort' => 4,
                'options' => [], 'skip' => null,
                'note' => 'Auto-fill dari villages.kemendagri_code via village assignment',
            ],
            [
                'code' => 'ID.5', 'text' => 'Strata Desa/Kelurahan (apabila tidak menggunakan strata maka dipilih 5)',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 5,
                'options' => [
                    ['value' => '0', 'label' => 'Strata 0'],
                    ['value' => '1', 'label' => 'Strata 1'],
                    ['value' => '2', 'label' => 'Strata 2'],
                    ['value' => '3', 'label' => 'Strata 3'],
                    ['value' => '4', 'label' => 'Strata 4'],
                    ['value' => '5', 'label' => 'Tidak menggunakan strata'],
                ],
                'skip' => null,
                'note' => 'Auto-fill dari villages.strata via village assignment',
            ],
            [
                'code' => 'ID.6', 'text' => 'Status Desa/Kelurahan/Nagari',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Perdesaan'],
                    ['value' => '2', 'label' => 'Perkotaan'],
                ],
                'skip' => null,
                'note' => 'Auto-fill dari villages.status via village assignment',
            ],
            [
                'code' => 'ID.7', 'text' => 'Banjar atau RT/RW (Contoh: 0304)',
                'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 7,
                'options' => [], 'skip' => null,
            ],
            [
                'code' => 'ID.8', 'text' => 'Nomor Urut Responden (Contoh: 01, 02, 03, dst)',
                'type' => 'text', 'obs' => false, 'required' => true, 'sort' => 8,
                'options' => [], 'skip' => null,
                'note' => 'Auto-generated berdasarkan urutan responden di desa',
            ],
            [
                'code' => 'ID.9', 'text' => 'Nomor Kuesioner — 13 digit: Kode Prov + Kode Kab/Kota + Kode Kec. + Kode Desa + Strata + No. Urut responden',
                'type' => 'text', 'obs' => false, 'required' => false, 'sort' => 9,
                'options' => [], 'skip' => null,
                'note' => 'Auto-generated dari gabungan ID.1-ID.5 + ID.8',
            ],
        ];
    }
}
