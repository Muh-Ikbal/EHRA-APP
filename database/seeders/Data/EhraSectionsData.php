<?php

namespace Database\Seeders\Data;

/**
 * Definisi Section dan IRS Component untuk Kuesioner EHRA 2026.
 *
 * Section "ID" (Identitas Wilayah) ditandai auto_fill = true karena
 * data provinsi, kabupaten, kecamatan, dan desa terisi otomatis dari
 * relasi user → enumerator_villages → village (beserta parent-nya).
 */
class EhraSectionsData
{
    /**
     * Komponen IRS (Indeks Risiko Sanitasi) untuk perhitungan skor.
     */
    public static function irsComponents(): array
    {
        return [
            ['key' => 'air_minum',    'label' => 'Sumber Air Minum',               'sort_order' => 1],
            ['key' => 'air_limbah',   'label' => 'Air Limbah Domestik',             'sort_order' => 2],
            ['key' => 'persampahan',  'label' => 'Pengelolaan Sampah',              'sort_order' => 3],
            ['key' => 'drainase',     'label' => 'Drainase Lingkungan',             'sort_order' => 4],
            ['key' => 'phbs',         'label' => 'Perilaku Hidup Bersih dan Sehat', 'sort_order' => 5],
        ];
    }

    /**
     * Definisi seluruh section kuesioner.
     *
     * - code           : Kode section di kuesioner
     * - title          : Judul section
     * - description    : Deskripsi/petunjuk pengisian section
     * - sort_order     : Urutan tampil
     * - is_irs         : Apakah masuk perhitungan IRS
     * - irs_key        : Key IRS component (nullable)
     * - auto_fill      : Section yang terisi otomatis dari database lokasi
     */
    public static function sections(): array
    {
        return [
            [
                'code'        => 'ID',
                'title'       => 'Identitas Wilayah',
                'description' => 'Data identitas wilayah administratif responden meliputi kode provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan sesuai ketentuan Kemendagri. Bagian ini TERISI OTOMATIS berdasarkan penugasan desa (id_desa) pada akun enumerator yang login, sehingga tidak perlu diisi manual oleh pewawancara.',
                'sort_order'  => 1,
                'is_irs'      => false,
                'irs_key'     => null,
                'auto_fill'   => true,
            ],
            [
                'code'        => 'A',
                'title'       => 'Informasi Umum',
                'description' => 'Informasi umum pelaksanaan survei mencakup tanggal survei, jam wawancara, identitas pewawancara/enumerator, supervisor, koordinator kecamatan, serta data dasar rumah tangga responden seperti nama kepala rumah tangga, jumlah keluarga, dan jumlah jiwa dalam rumah.',
                'sort_order'  => 2,
                'is_irs'      => false,
                'irs_key'     => null,
                'auto_fill'   => false,
            ],
            [
                'code'        => 'B',
                'title'       => 'Informasi Responden',
                'description' => 'Data sosial-ekonomi responden meliputi usia, status rumah, luas lahan, jenis bangunan, pendidikan terakhir, kepemilikan SKTM, pengeluaran dan penghasilan rumah tangga, kepemilikan jaminan kesehatan (BPJS/KIS), bantuan sanitasi yang pernah diterima, lama tinggal, serta data jumlah anak berdasarkan kelompok umur dan jenis kelamin.',
                'sort_order'  => 3,
                'is_irs'      => false,
                'irs_key'     => null,
                'auto_fill'   => false,
            ],
            [
                'code'        => 'C',
                'title'       => 'Pengelolaan Sampah Rumah Tangga',
                'description' => 'Penilaian pengelolaan sampah rumah tangga mencakup timbulan sampah harian, kondisi kebersihan lingkungan, cara pengelolaan sampah (pengumpulan, pemilahan, pengangkutan, pembakaran, pembuangan), frekuensi dan biaya layanan pengangkutan, kegiatan pengomposan, kondisi drainase lingkungan, serta pengelolaan sampah medis/perawatan di rumah.',
                'sort_order'  => 4,
                'is_irs'      => true,
                'irs_key'     => 'persampahan',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'D',
                'title'       => 'Pembuangan Tinja Manusia dan Lumpur Tinja',
                'description' => 'Penilaian praktik pembuangan tinja dan pengelolaan lumpur tinja meliputi lokasi BAB anggota keluarga, jenis jamban, kondisi fisik jamban, keberadaan tangki septik beserta spesifikasinya (ventilasi, lubang penyedotan, pembuangan akhir), riwayat penyedotan, penanganan tinja bayi/balita, serta kemauan dan kemampuan membayar layanan sedot lumpur tinja terjadwal.',
                'sort_order'  => 5,
                'is_irs'      => true,
                'irs_key'     => 'air_limbah',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'E',
                'title'       => 'Drainase Lingkungan dan Banjir',
                'description' => 'Penilaian sistem drainase lingkungan dan risiko banjir mencakup tujuan pembuangan air limbah dari berbagai sumber (dapur, kamar mandi, tempat cuci, wastafel), kelancaran saluran, kondisi genangan air di sekitar rumah beserta sumbernya, frekuensi dan dampak banjir terhadap rumah dan jamban, serta lama air banjir mengering.',
                'sort_order'  => 6,
                'is_irs'      => true,
                'irs_key'     => 'drainase',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'F',
                'title'       => 'Pengelolaan Air Minum, Masak dan Keperluan Higiene',
                'description' => 'Penilaian sumber dan pengelolaan air untuk kebutuhan rumah tangga mencakup identifikasi sumber air (minum, masak, mencuci, mandi, gosok gigi), wadah penyimpanan, cara pengambilan air, volume pemakaian, ketersediaan air sepanjang tahun, jarak dan waktu akses sumber air, kualitas fisik air, pengolahan air minum (perebusan, filter), serta biaya air bulanan.',
                'sort_order'  => 7,
                'is_irs'      => true,
                'irs_key'     => 'air_minum',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'G',
                'title'       => 'Perilaku Cuci Tangan Pakai Sabun',
                'description' => 'Penilaian perilaku cuci tangan pakai sabun (CTPS) mencakup kebiasaan penggunaan sabun, lokasi tempat cuci tangan, waktu-waktu kritis mencuci tangan (sebelum/sesudah makan, setelah BAB, setelah menceboki anak, dll), kemampuan praktik CTPS yang benar, ketersediaan sabun di jamban, dan ketersediaan air di ruangan jamban.',
                'sort_order'  => 8,
                'is_irs'      => true,
                'irs_key'     => 'phbs',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'H',
                'title'       => 'Kejadian Penyakit Infeksi',
                'description' => 'Penilaian riwayat kejadian penyakit infeksi (diare) dalam keluarga mencakup waktu terakhir anggota keluarga terkena diare dan identifikasi siapa yang terkena berdasarkan kategori usia dan jenis kelamin (bayi/balita, anak-anak, remaja, dewasa).',
                'sort_order'  => 9,
                'is_irs'      => false,
                'irs_key'     => null,
                'auto_fill'   => false,
            ],
            [
                'code'        => 'I',
                'title'       => 'Rumah Sehat',
                'description' => 'Penilaian kondisi rumah sehat melalui observasi langsung meliputi luas ventilasi alamiah (min. 10% luas lantai), keberadaan vektor penyakit (tikus, kecoa), pencahayaan alami/buatan, kualitas udara dalam ruangan, kepadatan hunian (min. 8 m² per ruang tidur), serta kondisi fisik bangunan (kekuatan dinding, jenis lantai, kebocoran atap).',
                'sort_order'  => 10,
                'is_irs'      => true,
                'irs_key'     => 'phbs',
                'auto_fill'   => false,
            ],
            [
                'code'        => 'J',
                'title'       => 'Tempat Mencuci dan Menyimpan Pangan',
                'description' => 'Penilaian melalui observasi langsung terhadap ketersediaan air untuk mencuci pangan dan peralatan makan/masak, serta cara penyimpanan makanan untuk melindungi dari kontaminasi oleh lalat, kecoa, cicak, semut, dan serangga lainnya.',
                'sort_order'  => 11,
                'is_irs'      => false,
                'irs_key'     => null,
                'auto_fill'   => false,
            ],
        ];
    }
}
