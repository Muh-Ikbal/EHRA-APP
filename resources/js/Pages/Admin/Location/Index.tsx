import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapPin, Plus, Edit3, Trash2, ChevronRight, CheckCircle2, Info, Layers } from 'lucide-react';

export default function Index({ level, parentId, locations, breadcrumbs, flash }: any) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'kabupaten',
        geojson: null as File | null,
        kemendagri_code: '',
        status: 'desa',
        strata: '',
        centroid_lat: '',
        centroid_lng: '',
        level: level,
        province_id: parentId,
        city_id: parentId,
        district_id: parentId,
        _method: 'post',
    });

    const openModal = (item: any = null) => {
        clearErrors();
        if (item) {
            setEditItem(item);
            setData({
                ...data,
                name: item.name,
                type: item.type || 'kabupaten',
                status: item.status || 'desa',
                strata: item.strata || '',
                centroid_lat: item.centroid_lat || '',
                centroid_lng: item.centroid_lng || '',
                kemendagri_code: item.kemendagri_code || '',
                level: level,
                province_id: parentId,
                city_id: parentId,
                district_id: parentId,
                _method: 'post',
            });
        } else {
            setEditItem(null);
            reset('name', 'type', 'geojson', 'status', 'strata', 'centroid_lat', 'centroid_lng');
            setData({
                ...data,
                name: '',
                type: 'kabupaten',
                status: 'desa',
                strata: '',
                centroid_lat: '',
                centroid_lng: '',
                kemendagri_code: '',
                level: level,
                province_id: parentId,
                city_id: parentId,
                district_id: parentId,
                _method: 'post',
            });
        }
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem
            ? route('admin.locations.update', editItem.id)
            : route('admin.locations.store');

        post(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteLocation = (id: string) => {
        if (
            confirm(
                'Yakin ingin menghapus lokasi ini? Seluruh data yang terkait di bawahnya (seperti kecamatan/desa) juga akan terhapus secara permanen.'
            )
        ) {
            router.delete(route('admin.locations.destroy', id), {
                data: { level },
            });
        }
    };

    const getLevelConfig = () => {
        switch (level) {
            case 'province':
                return {
                    label: 'Provinsi',
                    nextLevel: 'city',
                    nextLevelLabel: 'Kabupaten/Kota',
                    itemLabel: 'Provinsi',
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    placeholder: 'misal: Sulawesi Tenggara',
                };
            case 'city':
                return {
                    label: 'Kabupaten / Kota',
                    nextLevel: 'district',
                    nextLevelLabel: 'Kecamatan',
                    itemLabel: 'Kabupaten/Kota',
                    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
                    placeholder: 'misal: Kota Kendari / Kabupaten Konawe',
                };
            case 'district':
                return {
                    label: 'Kecamatan',
                    nextLevel: 'village',
                    nextLevelLabel: 'Desa/Kelurahan',
                    itemLabel: 'Kecamatan',
                    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
                    placeholder: 'misal: Abeli',
                };
            case 'village':
                return {
                    label: 'Desa / Kelurahan',
                    nextLevel: null,
                    nextLevelLabel: null,
                    itemLabel: 'Desa/Kelurahan',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    placeholder: 'misal: Anggalomelai',
                };
            default:
                return {
                    label: 'Wilayah',
                    nextLevel: null,
                    nextLevelLabel: null,
                    itemLabel: 'Wilayah',
                    badgeBg: 'bg-gray-100 text-gray-800 border-gray-200',
                    placeholder: '',
                };
        }
    };

    const levelConfig = getLevelConfig();

    // Get parent names from breadcrumbs for display
    const currentParentName =
        breadcrumbs && breadcrumbs.length > 1
            ? breadcrumbs[breadcrumbs.length - 1]?.name
            : '';
    const fullHierarchyText =
        breadcrumbs && breadcrumbs.length > 0
            ? breadcrumbs.map((b: any) => b.name).join(' ➔ ')
            : 'Semua Provinsi';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                                <MapPin className="text-emerald-700" />
                                Manajemen Lokasi
                            </h2>
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${levelConfig.badgeBg}`}
                            >
                                Level: {levelConfig.label}
                            </span>
                        </div>

                        {/* Breadcrumbs Navigation */}
                        <div className="flex items-center flex-wrap gap-1 mt-2 text-xs sm:text-sm">
                            <Link
                                href={route('admin.locations.index', { level: 'province' })}
                                className={`${
                                    level === 'province'
                                        ? 'font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md'
                                        : 'text-emerald-700 hover:text-emerald-800 hover:underline font-medium'
                                } transition-colors`}
                            >
                                Semua Provinsi
                            </Link>

                            {breadcrumbs.map((b: any, idx: number) => {
                                if (idx === 0) return null; // skip root
                                const isLast = idx === breadcrumbs.length - 1;
                                return (
                                    <React.Fragment key={idx}>
                                        <ChevronRight size={14} className="text-gray-400" />
                                        <Link
                                            href={route('admin.locations.index', {
                                                level: b.level,
                                                parent_id: b.parent_id,
                                            })}
                                            className={`${
                                                isLast
                                                    ? 'font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md'
                                                    : 'text-emerald-700 hover:text-emerald-800 hover:underline font-medium'
                                            } transition-colors max-w-[180px] truncate`}
                                            title={b.name}
                                        >
                                            {b.name}
                                        </Link>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Manajemen Lokasi - ${levelConfig.label}`} />

            <div className="space-y-4 mb-6">
                {/* Level Context & Flow Guidance Card */}
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layers size={18} className="text-emerald-700" />
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                Data Tingkat {levelConfig.label}
                                {currentParentName && (
                                    <span className="text-emerald-700 font-bold ml-1">
                                        (di {currentParentName})
                                    </span>
                                )}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500">
                            Hierarki Aktif: <span className="font-medium text-gray-700">{fullHierarchyText}</span>
                        </p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah {levelConfig.itemLabel} Baru</span>
                    </button>
                </div>

                {/* Helper hint */}
                {levelConfig.nextLevel && (
                    <div className="px-4 py-2 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                        <Info size={14} className="shrink-0 text-emerald-600" />
                        <span>
                            <strong>Petunjuk Alur:</strong> Klik pada nama <strong>{levelConfig.itemLabel}</strong> di tabel bawah untuk masuk dan mengelola daftar <strong>{levelConfig.nextLevelLabel}</strong> di wilayah tersebut.
                        </span>
                    </div>
                )}
            </div>

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={18} />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nama {levelConfig.itemLabel}</th>
                                {level === 'city' && <th className="px-6 py-4">Tipe Wilayah</th>}
                                {level === 'village' && <th className="px-6 py-4">Status & Strata</th>}
                                {level === 'village' && <th className="px-6 py-4">Koordinat (Lat, Lng)</th>}
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {locations && locations.length > 0 ? (
                                locations.map((loc: any) => (
                                    <tr key={loc.id} className="hover:bg-emerald-50/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            {levelConfig.nextLevel ? (
                                                <Link
                                                    href={route('admin.locations.index', {
                                                        level: levelConfig.nextLevel,
                                                        parent_id: loc.id,
                                                    })}
                                                    className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-2 group-hover:translate-x-0.5"
                                                >
                                                    <span>{loc.name}</span>
                                                    <ChevronRight size={14} className="text-emerald-500 opacity-70 group-hover:opacity-100" />
                                                </Link>
                                            ) : (
                                                <span className="font-bold text-gray-800">{loc.name}</span>
                                            )}
                                        </td>

                                        {/* City Type Column */}
                                        {level === 'city' && (
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold capitalize shadow-2xs ${
                                                        loc.type === 'kota'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                    }`}
                                                >
                                                    {loc.type === 'kota' ? 'Kota' : 'Kabupaten'}
                                                </span>
                                            </td>
                                        )}

                                        {/* Village Status Column */}
                                        {level === 'village' && (
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase w-max ${
                                                            loc.status === 'perkotaan'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        }`}
                                                    >
                                                        {loc.status}
                                                    </span>
                                                    {loc.strata && (
                                                        <span className="text-gray-500 text-xs font-medium">
                                                            Strata: {loc.strata}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        )}

                                        {/* Village Centroid Lat/Lng */}
                                        {level === 'village' && (
                                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                                {loc.centroid_lat ? `${loc.centroid_lat}, ${loc.centroid_lng}` : '-'}
                                            </td>
                                        )}

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openModal(loc)}
                                                    className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 text-xs sm:text-sm"
                                                >
                                                    <Edit3 size={15} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteLocation(loc.id)}
                                                    className="text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 text-xs sm:text-sm"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={level === 'city' || level === 'village' ? 4 : 2} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <MapPin size={40} className="text-gray-300 mb-3" />
                                            <p className="text-base font-bold text-gray-700">Belum ada data {levelConfig.itemLabel}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Klik tombol <strong>"Tambah {levelConfig.itemLabel} Baru"</strong> di atas untuk menambahkan data.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-8 border border-gray-100">
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                        {editItem ? `Edit ${levelConfig.itemLabel}` : `Tambah ${levelConfig.itemLabel} Baru`}
                                    </h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${levelConfig.badgeBg}`}>
                                        {levelConfig.label}
                                    </span>
                                </div>
                                {currentParentName && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Wilayah Induk: <strong className="text-emerald-700">{currentParentName}</strong>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={submit} className="p-5 sm:p-6 space-y-4">
                            {/* Hierarchy Info Box */}
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Tingkat Pengisian:</span> {levelConfig.label}
                                {currentParentName && (
                                    <span> dalam <strong>{currentParentName}</strong></span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                    Nama {levelConfig.itemLabel} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={levelConfig.placeholder}
                                    className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {level === 'province' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Kode Kemendagri
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kemendagri_code}
                                        onChange={(e) => setData('kemendagri_code', e.target.value)}
                                        placeholder="misal: 74"
                                        className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                    />
                                </div>
                            )}

                            {level === 'district' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Kode Kemendagri
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kemendagri_code}
                                        onChange={(e) => setData('kemendagri_code', e.target.value)}
                                        placeholder="misal: 74.71.01"
                                        className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                    />
                                </div>
                            )}

                            {level === 'city' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                            Kode Kemendagri
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            placeholder="misal: 74.71"
                                            className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                            Tipe Wilayah <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 font-medium"
                                        >
                                            <option value="kabupaten">Kabupaten</option>
                                            <option value="kota">Kota</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {level === 'village' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                            Kode Kemendagri
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            placeholder="misal: 74.71.01.1001"
                                            className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 font-medium"
                                            >
                                                <option value="pedesaan">Pedesaan</option>
                                                <option value="perkotaan">Perkotaan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                                Strata (Opsional)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="5"
                                                value={data.strata}
                                                onChange={(e) => setData('strata', e.target.value)}
                                                placeholder="1 - 5"
                                                className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                                Latitude (Opsional)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.centroid_lat}
                                                onChange={(e) => setData('centroid_lat', e.target.value)}
                                                placeholder="-4.0123"
                                                className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                                Longitude (Opsional)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.centroid_lng}
                                                onChange={(e) => setData('centroid_lng', e.target.value)}
                                                placeholder="122.512"
                                                className="w-full text-xs sm:text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-50 transition-colors shadow-xs"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
