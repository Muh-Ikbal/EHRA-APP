import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Users, Plus, Trash2, Edit, Save, CheckCircle2, Shield, MapPin } from 'lucide-react';

export default function Index({ enumerators, villages, versions, filters, flash }: any) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchVillage, setSearchVillage] = useState('');

    const filteredVillages = villages.filter((v: any) => {
        const name = (v.full_name || v.name || '').toLowerCase();
        return name.includes(searchVillage.toLowerCase());
    });

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
        setSearchVillage('');
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
        setSearchVillage('');

        // Find active version as default
        const activeVersion = versions?.find((v: any) => v.is_active) || versions?.[0];

        reset();
        setData('version_id', activeVersion?.id || '');
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsCreating(false);
        setSearchVillage('');
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
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                    <MapPin size={16} /> Wilayah Tugas (Desa/Kelurahan)
                                </h4>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Cari desa / kecamatan / kota..."
                                        value={searchVillage}
                                        onChange={e => setSearchVillage(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm mb-2 shadow-sm"
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {filteredVillages.map((village: any) => (
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
                                                {villages.length === 0 ? 'Belum ada data desa.' : 'Desa tidak ditemukan.'}
                                            </p>
                                        )}
                                    </div>
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
                                            <div className="flex flex-wrap gap-1">
                                                {user.assigned_villages?.map((v: any) => (
                                                    <span key={v.id} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
                                                        {v.full_name || v.name}
                                                    </span>
                                                ))}
                                                {(!user.assigned_villages || user.assigned_villages.length === 0) && (
                                                    <span className="text-gray-400 italic text-xs">Belum ada tugas</span>
                                                )}
                                            </div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
