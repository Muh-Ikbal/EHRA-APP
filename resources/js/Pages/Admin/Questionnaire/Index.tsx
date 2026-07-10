import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FileText, Plus, CheckCircle, Circle, Edit3, Trash2, PieChart, Copy, Pencil } from 'lucide-react';

interface Version {
    id: string;
    version_code: string;
    title: string;
    description: string;
    valid_from: string;
    valid_until: string | null;
    is_active: boolean;
    created_at: string;
    creator?: {
        name: string;
    };
}

export default function Index({ versions }: { versions: Version[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editVersion, setEditVersion] = useState<Version | null>(null);
    const [duplicating, setDuplicating] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        version_code: '',
        title: '',
        description: '',
        valid_from: '',
        valid_until: '',
    });

    const editForm = useForm({
        version_code: '',
        title: '',
        description: '',
        valid_from: '',
        valid_until: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.questionnaires.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const openEdit = (version: Version) => {
        editForm.setData({
            version_code: version.version_code,
            title: version.title,
            description: version.description || '',
            valid_from: version.valid_from ? version.valid_from.split('T')[0] : '',
            valid_until: version.valid_until ? version.valid_until.split('T')[0] : '',
        });
        setEditVersion(version);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editVersion) return;
        editForm.put(route('admin.questionnaires.update', editVersion.id), {
            onSuccess: () => setEditVersion(null),
        });
    };

    const toggleActive = (id: string) => {
        if (confirm('Aktifkan versi ini? Versi lain akan dinonaktifkan.')) {
            router.post(route('admin.questionnaires.toggleActive', id));
        }
    };

    const deleteVersion = (id: string) => {
        if (confirm('Hapus versi kuesioner ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('admin.questionnaires.destroy', id));
        }
    };

    const duplicateVersion = (id: string) => {
        setDuplicating(id);
        router.post(route('admin.questionnaires.duplicate', id), {}, {
            onFinish: () => setDuplicating(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-emerald-700 w-5 h-5 sm:w-5 sm:h-5" />
                        Manajemen Kuesioner
                    </h2>
                </div>
            }
        >
            <Head title="Manajemen Kuesioner" />

            <div className="space-y-6">
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors w-full sm:w-auto shrink-0 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Versi Baru
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Kode Versi</th>
                                    <th className="px-6 py-4">Judul</th>
                                    <th className="px-6 py-4">Masa Berlaku</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {versions.map((version) => (
                                    <tr key={version.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {version.version_code}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{version.title}</p>
                                            <p className="text-xs text-gray-500">{version.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(version.valid_from).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} s/d {version.valid_until ? new Date(version.valid_until).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Seterusnya'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {version.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                                                    <CheckCircle size={14} /> Aktif
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => toggleActive(version.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full text-xs font-semibold border border-gray-200 transition-colors"
                                                >
                                                    <Circle size={14} /> Set Aktif
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(version)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    title="Edit Versi"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => duplicateVersion(version.id)}
                                                    disabled={duplicating === version.id}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                                    title="Duplikasi Kuesioner"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => router.get(route('admin.questionnaires.weights.index', version.id))}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                >
                                                    <PieChart size={14} /> Bobot
                                                </button>
                                                <button
                                                    onClick={() => router.get(route('admin.questionnaires.builder.edit', version.id))}
                                                    className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                                                >
                                                    <Edit3 size={14} /> Builder
                                                </button>
                                                {!version.is_active && (
                                                    <button
                                                        onClick={() => deleteVersion(version.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {versions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada versi kuesioner. Buat versi baru untuk memulai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Create Version */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Buat Versi Kuesioner Baru</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Versi</label>
                                <input type="text" value={data.version_code} onChange={(e) => setData('version_code', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Contoh: EHRA-2026" required />
                                {errors.version_code && <p className="text-rose-500 text-xs mt-1">{errors.version_code}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Contoh: Kuesioner EHRA 2026-2029" required />
                                {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Dari</label>
                                    <input type="date" value={data.valid_from} onChange={(e) => setData('valid_from', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" required />
                                    {errors.valid_from && <p className="text-rose-500 text-xs mt-1">{errors.valid_from}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sampai (Opsional)</label>
                                    <input type="date" value={data.valid_until} onChange={(e) => setData('valid_until', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
                                <button type="submit" disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Version */}
            {editVersion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Edit Versi Kuesioner</h3>
                            <button onClick={() => setEditVersion(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                        </div>
                        <form onSubmit={submitEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Versi</label>
                                <input type="text" value={editForm.data.version_code} onChange={(e) => editForm.setData('version_code', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" required />
                                {editForm.errors.version_code && <p className="text-rose-500 text-xs mt-1">{editForm.errors.version_code}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" required />
                                {editForm.errors.title && <p className="text-rose-500 text-xs mt-1">{editForm.errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Dari</label>
                                    <input type="date" value={editForm.data.valid_from} onChange={(e) => editForm.setData('valid_from', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" required />
                                    {editForm.errors.valid_from && <p className="text-rose-500 text-xs mt-1">{editForm.errors.valid_from}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sampai (Opsional)</label>
                                    <input type="date" value={editForm.data.valid_until} onChange={(e) => editForm.setData('valid_until', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditVersion(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
                                <button type="submit" disabled={editForm.processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50">
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
