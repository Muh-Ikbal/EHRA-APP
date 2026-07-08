import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, Eye, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useState } from 'react';

interface SurveyResponse {
    id: string;
    respondent_code: string;
    status: string;
    submitted_at: string;
    enumerator: {
        name: string;
    };
    village: {
        name: string;
    };
}

interface PaginationData {
    data: SurveyResponse[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ auth, responses, filters }: PageProps<{ responses: PaginationData; filters: any }>) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setDeleting(true);
        router.delete(route('admin.survey-results.destroy', deleteId), {
            onFinish: () => {
                setDeleting(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Hasil Survei</h2>}
        >
            <Head title="Hasil Survei" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Daftar Survei Masuk</h3>
                        <p className="text-sm text-gray-500 mt-1">Menampilkan data hasil survei EHRA dari para enumerator.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Kode Responden</th>
                                <th className="px-6 py-4">Desa/Kelurahan</th>
                                <th className="px-6 py-4">Enumerator</th>
                                <th className="px-6 py-4">Waktu Submit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responses.data.length > 0 ? (
                                responses.data.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {res.respondent_code}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {res.village?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {res.enumerator?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {res.submitted_at ? dayjs(res.submitted_at).format('DD MMM YYYY, HH:mm') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {res.status === 'approved' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">
                                                    <CheckCircle2 size={14} /> Approved
                                                </span>
                                            ) : res.status === 'reviewed' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200">
                                                    <CheckCircle2 size={14} /> Reviewed
                                                </span>
                                            ) : res.status === 'submitted' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-200">
                                                    <CheckCircle2 size={14} /> Submitted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-bold border border-gray-200">
                                                    <Clock size={14} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.survey-results.show', res.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm"
                                                >
                                                    <Eye size={16} /> Detail
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(res.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="text-gray-300 mb-4" />
                                            <p className="text-base font-medium">Belum ada hasil survei</p>
                                            <p className="text-sm mt-1">Data survei akan muncul di sini setelah enumerator mengirimkannya.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {responses.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <div className="text-sm text-gray-500">
                            Menampilkan <span className="font-medium text-gray-900">{responses.data.length}</span> dari <span className="font-medium text-gray-900">{responses.total}</span> data
                        </div>
                        <div className="flex gap-1">
                            {responses.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                        link.active 
                                            ? 'bg-emerald-700 text-white' 
                                            : link.url 
                                                ? 'text-gray-600 hover:bg-gray-100' 
                                                : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 size={20} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Hapus Data Survei?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Data survei ini akan dihapus secara permanen beserta seluruh jawabannya. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
