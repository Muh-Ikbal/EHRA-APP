import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapPin, Plus, Edit3, Trash2, ChevronRight, FileJson, CheckCircle2 } from 'lucide-react';

export default function Index({ level, parentId, locations, breadcrumbs, flash }: any) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'kabupaten',
        geojson: null as File | null,
        kemendagri_code : '',
        status: 'desa',
        strata: '',
        centroid_lat: '',
        centroid_lng: '',
        level: level,
        province_id: parentId,
        city_id: parentId,
        district_id: parentId,
        _method: 'post'
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
                _method: 'post' // inertia workaround for file uploads with PUT
            });
        } else {
            setEditItem(null);
            reset('name', 'type', 'geojson', 'status', 'strata', 'centroid_lat', 'centroid_lng');
            setData('_method', 'post');
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
            }
        });
    };

    const deleteLocation = (id: string) => {
        if (confirm('Yakin ingin menghapus lokasi ini? Seluruh data yang terkait di bawahnya (seperti kecamatan/desa) juga akan terhapus secara permanen.')) {
            router.delete(route('admin.locations.destroy', id), {
                data: { level }
            });
        }
    };

    const getNextLevel = () => {
        if (level === 'province') return 'city';
        if (level === 'city') return 'district';
        if (level === 'district') return 'village';
        return null;
    };
    const nextLevel = getNextLevel();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <MapPin className="text-emerald-700" />
                            Manajemen Lokasi
                        </h2>
                        
                        {/* Breadcrumbs */}
                        <div className="flex items-center flex-wrap gap-1 mt-2 text-sm">
                            <Link 
                                href={route('admin.locations.index', { level: 'province' })}
                                className={`${level === 'province' ? 'font-bold text-gray-800' : 'text-emerald-700 hover:text-emerald-800'} transition-colors`}
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
                                            href={route('admin.locations.index', { level: b.level, parent_id: b.parent_id })}
                                            className={`${isLast ? 'font-bold text-gray-800' : 'text-emerald-700 hover:text-emerald-800'} transition-colors max-w-[150px] truncate`}
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
            <Head title="Manajemen Lokasi Survei" />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => openModal()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-sm w-full sm:w-auto shrink-0"
                >
                    <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> Tambah Data
                </button>
            </div>

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span className="font-medium">{flash.success}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nama Wilayah</th>
                                {level === 'city' && <th className="px-6 py-4">Tipe & GeoJSON</th>}
                                {level === 'village' && <th className="px-6 py-4">Status & Strata</th>}
                                {level === 'village' && <th className="px-6 py-4">Kordinat (Lat, Lng)</th>}
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {locations.map((loc: any) => (
                                <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {nextLevel ? (
                                            <Link 
                                                href={route('admin.locations.index', { level: nextLevel, parent_id: loc.id })}
                                                className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-2"
                                            >
                                                {loc.name} <ChevronRight size={14} className="opacity-50" />
                                            </Link>
                                        ) : (
                                            <span className="font-bold text-gray-800">{loc.name}</span>
                                        )}
                                    </td>
                                    
                                    {level === 'city' && (
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase w-max">
                                                    {loc.type}
                                                </span>
                                                {loc.geojson_path && (
                                                    <a href={`/storage/${loc.geojson_path}`} target="_blank" className="text-emerald-600 hover:text-emerald-800 text-xs inline-flex items-center gap-1">
                                                        <FileJson size={12} /> Ada File GeoJSON
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    )}

                                    {level === 'village' && (
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase w-max ${loc.status === 'kelurahan' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                    {loc.status}
                                                </span>
                                                <span className="text-gray-500 text-xs">Strata: {loc.strata}</span>
                                            </div>
                                        </td>
                                    )}

                                    {level === 'village' && (
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            {loc.centroid_lat ? `${loc.centroid_lat}, ${loc.centroid_lng}` : '-'}
                                        </td>
                                    )}

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => openModal(loc)}
                                                className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
                                            >
                                                <Edit3 size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={() => deleteLocation(loc.id)}
                                                className="text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {locations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada data di tingkat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-8">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editItem ? 'Edit Data' : 'Tambah Data Baru'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wilayah</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {level === 'province' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kemendagri</label>
                                        <input
                                            type="text"
                                            min="0"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                        />
                                    </div>
                                </>
                            )}

                            {level === 'district' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kemendagri</label>
                                        <input
                                            type="text"
                                            min="0"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                        />
                                    </div>
                                </>
                            )}
                            {level === 'city' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kemendagri</label>
                                        <input
                                            type="text"
                                            min="0"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                        >
                                            <option value="kabupaten">Kabupaten</option>
                                            <option value="kota">Kota</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">File GeoJSON (Peta Batas)</label>
                                        <input
                                            type="file"
                                            accept=".json,.geojson"
                                            onChange={(e) => setData('geojson', e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Format didukung: .json, .geojson. Kosongkan jika tidak ingin mengubah.</p>
                                        {errors.geojson && <p className="text-rose-500 text-xs mt-1">{errors.geojson}</p>}
                                    </div>
                                </>
                            )}

                            {level === 'village' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kemendagri</label>
                                        <input
                                            type="text"
                                            min="0"
                                            value={data.kemendagri_code}
                                            onChange={(e) => setData('kemendagri_code', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                            >
                                                <option value="pedesaan">Pedesaan</option>
                                                <option value="perkotaan">Perkotaan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Strata (Opsional)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="5"
                                                value={data.strata}
                                                onChange={(e) => setData('strata', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (Opsional)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.centroid_lat}
                                                onChange={(e) => setData('centroid_lat', e.target.value)}
                                                placeholder="-4.0123"
                                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (Opsional)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.centroid_lng}
                                                onChange={(e) => setData('centroid_lng', e.target.value)}
                                                placeholder="122.512"
                                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
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
