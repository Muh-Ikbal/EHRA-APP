import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Users, Plus, Trash2, Edit, Save, CheckCircle2, Shield, MapPin, ChevronLeft, ChevronRight, CheckSquare, Filter, RotateCcw } from 'lucide-react';

const VILLAGE_DISPLAY_LIMIT = 50;
const TABLE_VILLAGE_LIMIT = 4;

export default function Index({ enumerators, villages, versions, filters, flash }: any) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
    const [searchVillage, setSearchVillage] = useState('');
    const [showAllVillages, setShowAllVillages] = useState(false);
    const [expandedUserVillages, setExpandedUserVillages] = useState<Record<string, boolean>>({});

    const toggleUserVillages = (userId: string) => {
        setExpandedUserVillages(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    // List of cities derived from villages
    const cities = React.useMemo(() => {
        const map = new Map<string, string>();
        villages?.forEach((v: any) => {
            const city = v.district?.city;
            if (city?.id && city?.name) {
                map.set(city.id, city.name);
            }
        });
        return Array.from(map.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [villages]);

    // List of districts filtered by selected city
    const districts = React.useMemo(() => {
        const map = new Map<string, string>();
        villages?.forEach((v: any) => {
            if (selectedCityId && v.district?.city_id !== selectedCityId) return;
            const dist = v.district;
            if (dist?.id && dist?.name) {
                map.set(dist.id, dist.name);
            }
        });
        return Array.from(map.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [villages, selectedCityId]);

    // Filter villages based on city, district, and strict search query
    const filteredVillages = React.useMemo(() => {
        return (villages || []).filter((v: any) => {
            // 1. Filter by City
            if (selectedCityId && v.district?.city_id !== selectedCityId) {
                return false;
            }

            // 2. Filter by District
            if (selectedDistrictId && v.district_id !== selectedDistrictId) {
                return false;
            }

            // 3. Strict search query
            const query = searchVillage.trim().toLowerCase();
            if (!query) return true;

            const vName = (v.name || '').toLowerCase();
            const distName = (v.district?.name || '').toLowerCase();
            const cityName = (v.district?.city?.name || '').toLowerCase();

            // Match village name
            if (vName.includes(query)) return true;
            // Match district name
            if (distName.includes(query)) return true;
            // Match city name:
            // If single word query (e.g. "konawe"), must match exact city name so "konawe selatan" won't match.
            // If multi-word query (e.g. "konawe selatan"), checks if city name includes it.
            if (query.includes(' ')) {
                if (cityName.includes(query)) return true;
            } else {
                if (cityName === query) return true;
            }

            return false;
        });
    }, [villages, selectedCityId, selectedDistrictId, searchVillage]);

    const isFiltering = !!(selectedCityId || selectedDistrictId || searchVillage.trim().length > 0);
    const displayedVillages = (isFiltering || showAllVillages)
        ? filteredVillages
        : filteredVillages.slice(0, VILLAGE_DISPLAY_LIMIT);
    const hiddenCount = filteredVillages.length - displayedVillages.length;

    const resetFilters = () => {
        setSelectedCityId('');
        setSelectedDistrictId('');
        setSearchVillage('');
        setShowAllVillages(false);
    };

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        version_id: '',
        village_ids: [] as string[],
    });

    const startEdit = (enumerator: any) => {
        setIsCreating(false);
        setEditingId(enumerator.id);
        resetFilters();
        const initialVersionId = enumerator.assigned_villages?.[0]?.pivot?.version_id || '';
        setData({
            name: enumerator.name,
            email: enumerator.email,
            password: '',
            version_id: initialVersionId,
            village_ids: enumerator.assigned_villages?.map((v: any) => v.id) || [],
        });
        clearErrors();
    };

    const startCreate = () => {
        setEditingId(null);
        setIsCreating(true);
        resetFilters();

        // Find active version as default
        const activeVersion = versions?.find((v: any) => v.is_active) || versions?.[0];

        reset();
        setData('version_id', activeVersion?.id || '');
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsCreating(false);
        resetFilters();
        reset();
        clearErrors();
    };

    const toggleVillage = (villageId: string) => {
        setData('village_ids',
            data.village_ids.includes(villageId)
                ? data.village_ids.filter(id => id !== villageId)
                : [...data.village_ids, villageId]
        );
    };

    const filteredVillageIds = filteredVillages.map((v: any) => v.id);
    const selectedFilteredCount = filteredVillages.filter((v: any) => data.village_ids.includes(v.id)).length;
    const allFilteredSelected = filteredVillages.length > 0 && selectedFilteredCount === filteredVillages.length;
    const someFilteredSelected = selectedFilteredCount > 0;

    const selectAllFiltered = () => {
        const set = new Set([...data.village_ids, ...filteredVillageIds]);
        setData('village_ids', Array.from(set));
    };

    const deselectAllFiltered = () => {
        const filteredSet = new Set(filteredVillageIds);
        setData('village_ids', data.village_ids.filter(id => !filteredSet.has(id)));
    };

    const clearAllSelected = () => {
        setData('village_ids', []);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.enumerators.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(route('admin.enumerators.store'), {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                },
            });
        }
    };

    const deleteEnumerator = (id: string) => {
        if (confirm('Yakin ingin menghapus akun enumerator ini?')) {
            router.delete(route('admin.enumerators.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <Users className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
                            Manajemen Akun Enumerator
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Kelola akun dan wilayah tugas enumerator</p>
                    </div>
                </div>
            }
        >
            <Head title="Enumerator - Manajemen" />

            <div className="max-w-7xl mx-auto pb-12 space-y-6">

                {!isCreating && !editingId && (
                    <div className="flex justify-end">
                        <button
                            onClick={startCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors w-full sm:w-auto shrink-0 shadow-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> Tambah Enumerator
                        </button>
                    </div>
                )}

                {flash?.success && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-2">
                        <span className="font-medium">{flash.error}</span>
                    </div>
                )}

                {(isCreating || editingId) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {editingId ? <Edit size={18} className="text-emerald-600" /> : <Plus size={18} className="text-emerald-600" />}
                            {editingId ? 'Edit Akun & Tugas Enumerator' : 'Buat Akun Enumerator Baru'}
                        </h3>
                        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Kiri: Data Akun */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                    <Shield size={16} /> Informasi Akun
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                        required
                                    />
                                    {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {editingId && <span className="text-gray-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                        required={!editingId}
                                        minLength={8}
                                    />
                                    {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Versi Kuesioner</label>
                                    <select
                                        value={data.version_id}
                                        onChange={e => setData('version_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                        required
                                    >
                                        <option value="">-- Pilih Versi --</option>
                                        {versions?.map((v: any) => (
                                            <option key={v.id} value={v.id}>
                                                {v.version_code} - {v.title || 'Tanpa Judul'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.version_id && <p className="text-rose-500 text-xs mt-1">{errors.version_id}</p>}
                                </div>
                            </div>

                            {/* Kanan: Wilayah Tugas */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin size={16} className="text-emerald-600" /> Wilayah Tugas (Desa/Kelurahan)
                                    </h4>
                                    {isFiltering && (
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 hover:underline transition-colors"
                                            title="Reset semua filter kota, kecamatan, dan pencarian"
                                        >
                                            <RotateCcw size={12} />
                                            Reset Filter
                                        </button>
                                    )}
                                </div>

                                {/* Filter Hierarkis: Kabupaten/Kota & Kecamatan */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                            <Filter size={12} className="text-emerald-600" /> Kab / Kota
                                        </label>
                                        <select
                                            value={selectedCityId}
                                            onChange={e => {
                                                setSelectedCityId(e.target.value);
                                                setSelectedDistrictId('');
                                            }}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-xs py-1.5 bg-white shadow-2xs"
                                        >
                                            <option value="">-- Semua Kab / Kota --</option>
                                            {cities.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            Kecamatan
                                        </label>
                                        <select
                                            value={selectedDistrictId}
                                            onChange={e => setSelectedDistrictId(e.target.value)}
                                            disabled={!selectedCityId && districts.length === 0}
                                            className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-xs py-1.5 bg-white shadow-2xs disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">-- Semua Kecamatan --</option>
                                            {districts.map((d: any) => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Pencarian Teks Strict */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Cari desa, kecamatan, atau kota..."
                                        value={searchVillage}
                                        onChange={e => setSearchVillage(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-xs py-2 shadow-2xs"
                                    />
                                    <div className="flex items-center justify-between text-xs px-1 mt-1.5">
                                        <span className="text-gray-500">
                                            {isFiltering ? (
                                                <>Ditemukan: <span className="font-bold text-emerald-700">{filteredVillages.length}</span> desa</>
                                            ) : (
                                                <>Tersedia: <span className="font-bold text-gray-700">{villages.length}</span> desa</>
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {filteredVillages.length > 0 && !allFilteredSelected && (
                                                <button
                                                    type="button"
                                                    onClick={selectAllFiltered}
                                                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
                                                >
                                                    <CheckSquare size={12} />
                                                    Pilih Semua {isFiltering ? `(${filteredVillages.length})` : ''}
                                                </button>
                                            )}
                                            {someFilteredSelected && (
                                                <button
                                                    type="button"
                                                    onClick={deselectAllFiltered}
                                                    className="font-medium text-gray-500 hover:text-rose-600 px-2 py-0.5 transition-colors"
                                                >
                                                    Batal Pilih ({selectedFilteredCount})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {data.village_ids.length > 0 && (
                                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5">
                                        <div className="flex items-center justify-between text-xs mb-1.5 pb-1 border-b border-emerald-100">
                                            <span className="font-semibold text-emerald-800">
                                                {data.village_ids.length} desa dipilih
                                            </span>
                                            <button
                                                type="button"
                                                onClick={clearAllSelected}
                                                className="text-xs text-rose-500 hover:text-rose-700 font-medium hover:underline"
                                            >
                                                Kosongkan Pilihan
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                            {villages
                                                .filter((v: any) => data.village_ids.includes(v.id))
                                                .map((v: any) => (
                                                    <span
                                                        key={v.id}
                                                        className="inline-flex items-center gap-1 bg-white text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs"
                                                    >
                                                        {v.full_name || v.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleVillage(v.id)}
                                                            className="text-emerald-500 hover:text-emerald-800 ml-0.5 font-bold"
                                                            title="Hapus"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {displayedVillages.map((village: any) => (
                                            <label key={village.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={data.village_ids.includes(village.id)}
                                                    onChange={() => toggleVillage(village.id)}
                                                    className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{village.full_name || village.name}</span>
                                            </label>
                                        ))}
                                        {filteredVillages.length === 0 && (
                                            <p className="text-sm text-gray-500 col-span-2">
                                                {villages.length === 0 ? 'Belum ada data desa.' : 'Desa tidak ditemukan dengan filter saat ini.'}
                                            </p>
                                        )}
                                    </div>
                                    {!isFiltering && hiddenCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllVillages(true)}
                                            className="mt-3 w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-800 py-2 border border-dashed border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                                        >
                                            Tampilkan {hiddenCount} desa lainnya...
                                        </button>
                                    )}
                                    {!isFiltering && showAllVillages && filteredVillages.length > VILLAGE_DISPLAY_LIMIT && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllVillages(false)}
                                            className="mt-3 w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-700 py-2 border border-dashed border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Sembunyikan — tampilkan {VILLAGE_DISPLAY_LIMIT} pertama saja
                                        </button>
                                    )}
                                </div>
                                {errors.village_ids && <p className="text-rose-500 text-xs mt-1">{errors.village_ids}</p>}
                            </div>

                            <div className="col-span-1 lg:col-span-2 flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} /> Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Nama Enumerator</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Wilayah Tugas</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {enumerators.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const assigned = user.assigned_villages || [];
                                                const isExpanded = !!expandedUserVillages[user.id];
                                                const visible = isExpanded ? assigned : assigned.slice(0, TABLE_VILLAGE_LIMIT);
                                                const hiddenCount = assigned.length - TABLE_VILLAGE_LIMIT;

                                                if (assigned.length === 0) {
                                                    return <span className="text-gray-400 italic text-xs">Belum ada tugas</span>;
                                                }

                                                return (
                                                    <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                                                        {visible.map((v: any) => (
                                                            <span
                                                                key={v.id}
                                                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-xs font-semibold"
                                                            >
                                                                {v.full_name || v.name}
                                                            </span>
                                                        ))}
                                                        {assigned.length > TABLE_VILLAGE_LIMIT && (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleUserVillages(user.id)}
                                                                className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                                                title={!isExpanded ? assigned.slice(TABLE_VILLAGE_LIMIT).map((v: any) => v.full_name || v.name).join(', ') : 'Sembunyikan'}
                                                            >
                                                                {isExpanded ? 'Tutup' : `+${hiddenCount} lainnya`}
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteEnumerator(user.id)}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {enumerators.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                            Belum ada akun enumerator. Silakan buat baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {enumerators.last_page > 1 && (
                        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-gray-500">
                                Menampilkan <span className="font-bold text-gray-900">{enumerators.from || 0}</span> - <span className="font-bold text-gray-900">{enumerators.to || 0}</span> dari <span className="font-bold text-gray-900">{enumerators.total}</span> enumerator
                            </div>
                            <div className="flex flex-wrap justify-center gap-1">
                                {enumerators.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-emerald-700 text-white font-bold'
                                                : link.url
                                                    ? 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
                                                    : 'text-gray-300 cursor-not-allowed bg-gray-50 border border-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
