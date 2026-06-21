<?php

namespace Database\Seeders\Data;

/**
 * Section G: Perilaku Cuci Tangan Pakai Sabun (G.1 – G.6)
 * Section H: Kejadian Penyakit Infeksi (H.1 – H.2)
 * Section I: Rumah Sehat (I.1 – I.6)
 * Section J: Tempat Mencuci dan Menyimpan Pangan (J.1 – J.2)
 */
class EhraQuestionsGHIJData
{
    /**
     * G. Perilaku Cuci Tangan Pakai Sabun
     */
    public static function sectionG(): array
    {
        return [
            [
                'code' => 'G.1', 'text' => 'Apakah Ibu memakai sabun untuk mencuci tangan pada hari ini atau kemarin?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => ['2' => 'H.1'],
            ],
            [
                'code' => 'G.2', 'text' => 'Di mana saja anggota keluarga biasanya mencuci tangan?',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 2,
                'options' => [
                    ['value' => 'A', 'label' => 'Di kamar mandi'],
                    ['value' => 'B', 'label' => 'Di jamban'],
                    ['value' => 'C', 'label' => 'Di tempat cuci piring'],
                    ['value' => 'D', 'label' => 'Di depan rumah'],
                    ['value' => 'E', 'label' => 'Tidak tahu'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'G.3', 'text' => 'Kapan biasanya anggota keluarga mencuci tangan pakai sabun?',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 3,
                'options' => [
                    ['value' => 'A', 'label' => 'Sebelum ke toilet'],
                    ['value' => 'B', 'label' => 'Setelah menceboki bayi/anak'],
                    ['value' => 'C', 'label' => 'Setelah dari buang air besar'],
                    ['value' => 'D', 'label' => 'Sebelum makan'],
                    ['value' => 'E', 'label' => 'Sebelum menyuapi/menyusui anak'],
                    ['value' => 'F', 'label' => 'Sebelum menyiapkan masakan'],
                    ['value' => 'G', 'label' => 'Setelah memegang hewan'],
                    ['value' => 'H', 'label' => 'Tidak pernah', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'G.4', 'text' => 'Amati: Apakah responden dapat melakukan cuci tangan pakai sabun dengan benar?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 4,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'G.5', 'text' => 'Amati: Apakah terlihat ada sabun untuk mencuci tangan di jamban/tempat mencuci tangan?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'G.6', 'text' => 'Amati: Apakah tersedia air di dalam ruangan jamban?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, dalam bak air/ember'],
                    ['value' => '2', 'label' => 'Ya, dari kran & berfungsi'],
                    ['value' => '3', 'label' => 'Ya, dari kran, tidak berfungsi dengan baik', 'risk' => true],
                    ['value' => '4', 'label' => 'Tidak ada', 'risk' => true],
                ],
                'skip' => null,
            ],
        ];
    }

    /**
     * H. Kejadian Penyakit Infeksi Lainnya
     */
    public static function sectionH(): array
    {
        return [
            [
                'code' => 'H.1', 'text' => 'Kapan waktu paling dekat anggota keluarga terkena diare?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => '1', 'label' => '1–6 hari ini', 'risk' => true],
                    ['value' => '2', 'label' => '1 minggu terakhir', 'risk' => true],
                    ['value' => '3', 'label' => '1 bulan terakhir', 'risk' => true],
                    ['value' => '4', 'label' => '3 bulan terakhir'],
                    ['value' => '5', 'label' => 'Lebih dari 3 bulan lalu'],
                    ['value' => '6', 'label' => 'Tidak pernah'],
                ],
                'skip' => ['6' => 'I.1'],
            ],
            [
                'code' => 'H.2', 'text' => 'Siapa anggota keluarga terakhir yang terkena diare?',
                'type' => 'multi_choice', 'obs' => false, 'required' => false, 'sort' => 2,
                'options' => [
                    ['value' => 'A', 'label' => 'Bayi/balita', 'risk' => true],
                    ['value' => 'B', 'label' => 'Anak-anak'],
                    ['value' => 'C', 'label' => 'Anak remaja laki-laki'],
                    ['value' => 'D', 'label' => 'Anak remaja perempuan'],
                    ['value' => 'E', 'label' => 'Orang dewasa laki-laki'],
                    ['value' => 'F', 'label' => 'Orang dewasa perempuan'],
                ],
                'skip' => null,
            ],
        ];
    }

    /**
     * I. Lihat dan Amati Rumah Sehat
     */
    public static function sectionI(): array
    {
        return [
            [
                'code' => 'I.1', 'text' => 'Amati: Luas penghawaan/ventilasi alamiah yang permanen (min. 10% dari luas lantai)',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'I.2', 'text' => 'Amati: Tidak ada tikus, kecoa dan binatang pengganggu vektor lainnya (jejak binatang pengganggu/vektor tidak ada)',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'I.3', 'text' => 'Amati: Pencahayaan alam dan/atau buatan yang langsung ataupun tidak langsung dapat menerangi seluruh ruangan?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 3,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'I.4', 'text' => 'Amati: Kualitas udara di dalam rumah, suhu dan kelembapan terasa nyaman?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 4,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'I.5', 'text' => 'Amati: Kepadatan hunian, minimal luas ruang tidur 8 m² (tidak boleh lebih dari 2 orang per ruangan)',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 5,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'I.6', 'text' => 'Amati: Kondisi rumah yang ada',
                'type' => 'multi_choice', 'obs' => true, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => 'A', 'label' => 'Dinding kuat'],
                    ['value' => 'B', 'label' => 'Lantai tidak dari tanah'],
                    ['value' => 'C', 'label' => 'Atap tidak ada kebocoran'],
                ],
                'skip' => null,
                'note' => 'Kode 0=Tidak, 1=Ya. Jika ada yang 0 maka berisiko.',
            ],
        ];
    }

    /**
     * J. Lihat dan Amati Tempat Mencuci dan Menyimpan Pangan
     */
    public static function sectionJ(): array
    {
        return [
            [
                'code' => 'J.1', 'text' => 'Amati: Apakah ada air untuk mencuci pangan, dan/atau peralatan makan dan masak?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 1,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'J.2', 'text' => 'Amati: Apakah makanan ditutup/dilindungi dari lalat, kecoa, cicak, semut dan serangga lainnya?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Ya, disimpan di atas meja dan ditutup'],
                    ['value' => '2', 'label' => 'Ya, disimpan dalam lemari makan'],
                    ['value' => '3', 'label' => 'Ya, di dalam kulkas'],
                    ['value' => '4', 'label' => 'Ya, di atas kompor dan tertutup'],
                    ['value' => '5', 'label' => 'Tidak ditutup', 'risk' => true],
                ],
                'skip' => null,
            ],
        ];
    }
}
