import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Users, Plus, Edit, Trash2, CheckCircle2, Shield, XCircle, Search } from 'lucide-react';

export default function Index({ users, filters, flash }: any) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    const startCreate = () => {
        setEditingId(null);
        setIsCreating(true);
        reset();
        clearErrors();
    };

    const startEdit = (user: any) => {
        setIsCreating(false);
        setEditingId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        clearErrors();
    };

    const cancelForm = () => {
        setIsCreating(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.users.update', editingId), {
                onSuccess: () => cancelForm(),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => cancelForm(),
            });
        }
    };

    const deleteUser = (id: string) => {
        if (confirm('Yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const toggleActive = (id: string) => {
        router.post(route('admin.users.toggleActive', id), {}, {
            preserveScroll: true
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search: searchTerm }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <Users className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
                            Manajemen Pengguna
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Kelola seluruh pengguna dan role (Admin & Enumerator)</p>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="max-w-7xl mx-auto pb-12 space-y-6">
                
                {!isCreating && !editingId && (
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="rounded-lg border-gray-300 focus:border-emerald-500 text-sm w-full sm:w-64 shadow-sm"
                            />
                            <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-200">
                                <Search size={18} />
                            </button>
                        </form>

                        <button
                            onClick={startCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors w-full sm:w-auto shrink-0 shadow-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> Tambah Pengguna
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
                        <XCircle size={18} />
                        <span className="font-medium">{flash.error}</span>
                    </div>
                )}

                {(isCreating || editingId) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {editingId ? <Edit size={18} className="text-emerald-600"/> : <Plus size={18} className="text-emerald-600"/>}
                            {editingId ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
                        </h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Valid</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId && <span className="text-gray-400 font-normal">(Isi jika ingin mengubah)</span>}</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Peran</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 text-sm"
                                    required
                                >
                                    <option value="admin">Administrator (Akses Penuh)</option>
                                    <option value="enumerator">Enumerator (Akses Aplikasi Survei Mobile)</option>
                                </select>
                                {errors.role && <p className="text-rose-500 text-xs mt-1">{errors.role}</p>}
                            </div>

                            <div className="md:col-span-2 pt-4 border-t border-gray-100 flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    Simpan Data
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
                                    <th className="px-6 py-4">Nama Pengguna</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-center">Status Login</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${!user.is_active ? 'bg-gray-50/80 opacity-75' : ''}`}>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                    <Shield size={14} /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                    <Users size={14} /> Enumerator
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleActive(user.id)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                                    user.is_active ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`}
                                                title={user.is_active ? "Nonaktifkan Login" : "Aktifkan Login"}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                        user.is_active ? 'translate-x-5' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                            <div className="mt-1 text-[10px] font-semibold text-gray-500 uppercase">
                                                {user.is_active ? 'Aktif' : 'Non-Aktif'}
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
                                                onClick={() => deleteUser(user.id)}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada pengguna yang ditambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {users.links && users.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-center gap-1">
                            {users.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || ''}
                                    className={`px-3 py-1 text-xs rounded-md border ${
                                        link.active 
                                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold' 
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
