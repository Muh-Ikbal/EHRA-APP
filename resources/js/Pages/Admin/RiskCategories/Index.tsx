import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ShieldAlert, Plus, Trash2, Edit, Save, CheckCircle2 } from 'lucide-react';

export default function Index({ categories, filters, flash }: any) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form for new/edit
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_name: '',
        lower_bound: '',
        upper_bound: '',
        color: '#000000',
    });

    const startEdit = (category: any) => {
        setIsCreating(false);
        setEditingId(category.id);
        setData({
            category_name: category.category_name,
            lower_bound: category.lower_bound,
            upper_bound: category.upper_bound,
            color: category.color,
        });
        clearErrors();
    };

    const startCreate = () => {
        setEditingId(null);
        setIsCreating(true);
        reset();
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsCreating(false);
        reset();
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.risk-categories.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(route('admin.risk-categories.store'), {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                },
            });
        }
    };

    const deleteCategory = (id: number) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            router.delete(route('admin.risk-categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <ShieldAlert className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
                            Kategori Aspek Risiko
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Kelola standar batas nilai (interval) dan warna kategori risiko EHRA</p>
                    </div>
                </div>

            }
        >
            <Head title="Kategori Risiko - Manajemen" />

            <div className="max-w-7xl mx-auto pb-12 space-y-6">

                {!isCreating && !editingId && (
                    <div className="flex justify-end">
                        <button
                            onClick={startCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors w-full sm:w-auto shrink-0 shadow-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> Tambah Kategori
                        </button>
                    </div>
                )}

                {flash?.success && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {(isCreating || editingId) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {editingId ? <Edit size={18} className="text-emerald-600" /> : <Plus size={18} className="text-emerald-600" />}
                            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={data.category_name}
                                    onChange={e => setData('category_name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                    placeholder="Contoh: Sangat Tinggi"
                                    required
                                />
                                {errors.category_name && <p className="text-rose-500 text-xs mt-1">{errors.category_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batas Bawah (Lower)</label>
                                <input
                                    type="number"
                                    value={data.lower_bound}
                                    onChange={e => setData('lower_bound', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                    required
                                />
                                {errors.lower_bound && <p className="text-rose-500 text-xs mt-1">{errors.lower_bound}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batas Atas (Upper)</label>
                                <input
                                    type="number"
                                    value={data.upper_bound}
                                    onChange={e => setData('upper_bound', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                    required
                                />
                                {errors.upper_bound && <p className="text-rose-500 text-xs mt-1">{errors.upper_bound}</p>}
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={data.color}
                                            onChange={e => setData('color', e.target.value)}
                                            className="h-9 w-12 rounded border-gray-300 cursor-pointer"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={data.color}
                                            readOnly
                                            className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm font-mono text-gray-500"
                                        />
                                    </div>
                                    {errors.color && <p className="text-rose-500 text-xs mt-1">{errors.color}</p>}
                                </div>
                            </div>
                            <div className="lg:col-span-5 flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
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
                                    <Save size={16} /> Simpan
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
                                    <th className="px-6 py-4">Nama Kategori</th>
                                    <th className="px-6 py-4 text-center">Interval Nilai</th>
                                    <th className="px-6 py-4">Warna (Peta)</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.data.map((cat: any) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {cat.category_name}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {cat.lower_bound} - {cat.upper_bound}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                                                    style={{ backgroundColor: cat.color }}
                                                ></div>
                                                <span className="font-mono text-xs text-gray-500 uppercase">{cat.color}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                            Belum ada data kategori. Silakan tambahkan.
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
