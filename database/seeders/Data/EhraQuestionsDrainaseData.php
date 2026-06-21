<?php

namespace Database\Seeders\Data;

/**
 * Section E: Drainase Lingkungan/Selokan Sekitar Rumah dan Banjir (E.1 – E.9)
 */
class EhraQuestionsDrainaseData
{
    public static function questions(): array
    {
        return [
            [
                'code' => 'E.1', 'text' => 'Tanya, Lihat dan Amati: Kemana air bekas buangan/air limbah dibuang?',
                'type' => 'matrix', 'obs' => true, 'required' => true, 'sort' => 1,
                'options' => [
                    // Baris (saluran)
                    ['value' => '1', 'label' => 'Saluran terbuka ke sungai/kanal/kolam/selokan', 'risk' => true],
                    ['value' => '2', 'label' => 'Ke jalan, halaman, kebun', 'risk' => true],
                    ['value' => '3', 'label' => 'Saluran terbuka ke cubluk/lubang tanah', 'risk' => true],
                    ['value' => '4', 'label' => 'Saluran tertutup ke riol'],
                    ['value' => '5', 'label' => 'Saluran tertutup ke selokan'],
                    ['value' => '6', 'label' => 'Sumur resapan'],
                    ['value' => '7', 'label' => 'Saluran pembuangan air limbah/IPAL terpusat'],
                    ['value' => '8', 'label' => 'IPAL Komunal (contoh: Sanimas)'],
                ],
                'skip' => null,
                'note' => 'Matrix: kolom = Dapur, Kamar Mandi, Tempat Cuci Pakaian, Wastafel. Kode: 0=Tidak, 1=Ya',
            ],
            [
                'code' => 'E.2', 'text' => 'Apakah saluran pembuangan air limbah di atas lancar?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 2,
                'options' => [
                    ['value' => '1', 'label' => 'Ya'],
                    ['value' => '2', 'label' => 'Tidak', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.3.1', 'text' => 'Amati: Apakah halaman/bagian depan rumah ada genangan air?',
                'type' => 'single_choice', 'obs' => true, 'required' => true, 'sort' => 3,
                'options' => [
                    ['value' => '1', 'label' => 'Ya', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => [['if_question_code' => 'E.3.1', 'operator' => 'equals', 'value' => '2', 'action' => 'jump', 'target_code' => 'E.4']],
            ],
            [
                'code' => 'E.3.2', 'text' => 'Amati: Dimana air biasanya tergenang?',
                'type' => 'multi_choice', 'obs' => true, 'required' => false, 'sort' => 4,
                'options' => [
                    ['value' => 'A', 'label' => 'Di halaman/pekarangan rumah', 'risk' => true],
                    ['value' => 'B', 'label' => 'Di dekat dapur', 'risk' => true],
                    ['value' => 'C', 'label' => 'Di dekat kamar mandi', 'risk' => true],
                    ['value' => 'D', 'label' => 'Di dekat bak penampungan air hujan', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.3.3', 'text' => 'Amati: Darimana air genangan berasal?',
                'type' => 'multi_choice', 'obs' => true, 'required' => false, 'sort' => 5,
                'options' => [
                    ['value' => 'A', 'label' => 'Hujan'],
                    ['value' => 'B', 'label' => 'Air limbah dapur', 'risk' => true],
                    ['value' => 'C', 'label' => 'Air limbah kamar mandi', 'risk' => true],
                    ['value' => 'D', 'label' => 'Air limbah dari sumber lain', 'risk' => true],
                    ['value' => 'E', 'label' => 'Tidak tahu/tidak pasti'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.4', 'text' => 'Apakah rumah yang ditempati saat ini atau lingkungan sekitar pernah terkena banjir?',
                'type' => 'single_choice', 'obs' => false, 'required' => true, 'sort' => 6,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak pernah'],
                    ['value' => '2', 'label' => 'Sekali dalam setahun', 'risk' => true],
                    ['value' => '3', 'label' => 'Beberapa kali dalam setahun', 'risk' => true],
                    ['value' => '4', 'label' => 'Sekali atau beberapa kali dalam sebulan', 'risk' => true],
                ],
                'skip' => [['if_question_code' => 'E.4', 'operator' => 'equals', 'value' => '1', 'action' => 'jump', 'target_code' => 'F.1.1']],
            ],
            [
                'code' => 'E.5', 'text' => 'Apakah banjir biasa terjadi secara rutin?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 7,
                'options' => [
                    ['value' => '1', 'label' => 'Ya', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.6', 'text' => 'Pada saat banjir terakhir, apakah air memasuki rumah?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 8,
                'options' => [
                    ['value' => '1', 'label' => 'Ya', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak'],
                ],
                'skip' => [['if_question_code' => 'E.6', 'operator' => 'equals', 'value' => '2', 'action' => 'jump', 'target_code' => 'F.1.1']],
            ],
            [
                'code' => 'E.7', 'text' => 'Pada saat terakhir kali banjir, berapa tinggi air yang masuk ke dalam rumah Ibu?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 9,
                'options' => [
                    ['value' => '1', 'label' => 'Setumit orang dewasa'],
                    ['value' => '2', 'label' => 'Selutut orang dewasa', 'risk' => true],
                    ['value' => '3', 'label' => 'Sepinggang orang dewasa', 'risk' => true],
                    ['value' => '4', 'label' => 'Sebahu orang dewasa', 'risk' => true],
                    ['value' => '5', 'label' => 'Lebih tinggi dari orang dewasa', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.8', 'text' => 'Pada saat terakhir banjir, apakah jamban di rumah ibu juga terendam banjir?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 10,
                'options' => [
                    ['value' => '1', 'label' => 'Tidak punya jamban', 'risk' => true],
                    ['value' => '2', 'label' => 'Tidak pernah'],
                    ['value' => '3', 'label' => 'Kadang-kadang', 'risk' => true],
                    ['value' => '4', 'label' => 'Selalu', 'risk' => true],
                ],
                'skip' => null,
            ],
            [
                'code' => 'E.9', 'text' => 'Pada saat terakhir banjir, berapa lama air banjir mengering?',
                'type' => 'single_choice', 'obs' => false, 'required' => false, 'sort' => 11,
                'options' => [
                    ['value' => '1', 'label' => 'Kurang dari 1 jam'],
                    ['value' => '2', 'label' => '1–3 jam'],
                    ['value' => '3', 'label' => 'Setengah hari', 'risk' => true],
                    ['value' => '4', 'label' => 'Satu hari', 'risk' => true],
                    ['value' => '5', 'label' => 'Lebih dari 1 hari', 'risk' => true],
                ],
                'skip' => null,
            ],
        ];
    }
}
