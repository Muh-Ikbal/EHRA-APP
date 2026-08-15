import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, Eye, CheckCircle2, Clock, Trash2, Search, X, ArrowLeft, MapPin, Activity } from 'lucide-react';
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
    version?: {
        id: string;
        version_code: string;
        title: string;
    };
}

interface VillageInfo {
    id: string;
    name: string;
    district_name: string;
    city_name: string;
    province_name: string;
}

interface IrsResultInfo {
    irs_total: number;
    category_name: string;
    color: string;
}

interface QuestionnaireVersion {
    id: string;
    version_code: string;
    title: string;
}

interface PaginationData {
    data: SurveyResponse[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function VillageResponses({
    auth,
    village,
    irsResult,
    responses,
    versions = [],
    filters = {},
}: PageProps<{
    village: VillageInfo;
    irsResult?: IrsResultInfo;
    responses: PaginationData;
    versions?: QuestionnaireVersion[];
    filters: any;
}>) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [versionId, setVersionId] = useState(filters.version_id || '');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleFilter = (newFilters: { search?: string; status?: string; version_id?: string }) => {
        const queryParams: any = {
            search: newFilters.search !== undefined ? newFilters.search : search,
            status: newFilters.status !== undefined ? newFilters.status : status,
            version_id: newFilters.version_id !== undefined ? newFilters.version_id : versionId,
        };

        Object.keys(queryParams).forEach((key) => {
            if (!queryParams[key]) {
                delete queryParams[key];
            }
        });

        router.get(route('admin.survey-results.village', { villageId: village.id }), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setVersionId('');
        router.get(route('admin.survey-results.village', { villageId: village.id }), {}, { preserveState: true, replace: true });
    };

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
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.survey-results.index', versionId ? { version_id: versionId } : {})}
                        className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                        title="Kembali ke Daftar Desa"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-lg sm:text-xl text-gray-800 leading-tight">
                            Hasil Survei Desa {village.name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Kec. {village.district_name}, {village.city_name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Hasil Survei ${village.name}`} />

            <div className="space-y-6">
                {/* Active Version Filter Indicator */}
                {versionId && versions.find(v => v.id === versionId) && (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs border border-emerald-200">
                        <div className="flex items-center gap-2 font-medium">
                            <span className="font-bold px-2 py-0.5 bg-emerald-700 text-white rounded-md text-[11px]">
                                {versions.find(v => v.id === versionId)?.version_code}
                            </span>
                            <span>Filter Versi Aktif: <strong>{versions.find(v => v.id === versionId)?.title}</strong></span>
                        </div>
                    </div>
                )}
                {/* Village Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">{village.name}</h3>
                                <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                                    Desa / Kelurahan
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
                                Kecamatan {village.district_name} • {village.city_name}, {village.province_name}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex-1 md:flex-initial bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 rounded-xl text-center min-w-[100px]">
                            <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total Survei</div>
                            <div className="text-base sm:text-lg font-extrabold text-gray-900">{responses.total}</div>
                        </div>

                        {irsResult ? (
                            <div className="flex-1 md:flex-initial bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 rounded-xl min-w-[130px]">
                                <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                                    <Activity size={12} className="text-emerald-600" /> Skor IRS Desa
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                                    <span className="text-base sm:text-lg font-extrabold text-gray-900">{irsResult.irs_total}</span>
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-md font-bold text-white shadow-2xs"
                                        style={{ backgroundColor: irsResult.color }}
                                    >
                                        {irsResult.category_name}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 md:flex-initial bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 rounded-xl text-center min-w-[130px]">
                                <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Skor IRS Desa</div>
                                <div className="text-xs font-semibold text-gray-400 mt-1 italic">Belum Dihitung</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Container Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header & Filters */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Daftar Responden Survei</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Menampilkan hasil data survei individu di {village.name}.
                            </p>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kode responden/enum..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                            </form>

                            {/* Questionnaire Version Filter */}
                            <select
                                value={versionId}
                                onChange={(e) => {
                                    setVersionId(e.target.value);
                                    handleFilter({ version_id: e.target.value });
                                }}
                                className="text-xs rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2 pl-3 pr-8 bg-white font-medium text-gray-700 cursor-pointer w-full sm:w-auto"
                            >
                                <option value="">Semua Versi Kuisioner</option>
                                {versions.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.version_code} - {v.title}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilter({ status: e.target.value });
                                }}
                                className="text-xs rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2 pl-3 pr-8 bg-white font-medium text-gray-700 cursor-pointer w-full sm:w-auto"
                            >
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="approved">Approved</option>
                            </select>

                            {/* Reset Filter Button */}
                            {(search || status || versionId) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                                    title="Reset Filter"
                                >
                                    <X size={14} /> Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Kode Responden</th>
                                    <th className="px-6 py-4">Versi Kuisioner</th>
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
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200 whitespace-nowrap">
                                                    {res.version?.version_code || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">
                                                {res.enumerator?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
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
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.survey-results.show', res.id)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-2xs"
                                                    >
                                                        <Eye size={16} /> Detail
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(res.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-2xs"
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
                                                <p className="text-base font-bold text-gray-700">Tidak ada hasil survei</p>
                                                <p className="text-sm text-gray-400 mt-1">Belum ada survei yang sesuai dengan kriteria filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Responsive Cards */}
                    <div className="block md:hidden p-4 space-y-3 bg-gray-50/30">
                        {responses.data.length > 0 ? (
                            responses.data.map((res) => (
                                <div key={res.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-bold text-gray-900 text-base">
                                                {res.respondent_code}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Enumerator: <span className="font-semibold text-gray-700">{res.enumerator?.name || '-'}</span>
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200 shrink-0">
                                            {res.version?.version_code || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                                        <span className="text-gray-400 font-medium">
                                            {res.submitted_at ? dayjs(res.submitted_at).format('DD MMM YYYY, HH:mm') : '-'}
                                        </span>
                                        <div>
                                            {res.status === 'approved' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-bold border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Approved
                                                </span>
                                            ) : res.status === 'reviewed' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-bold border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Reviewed
                                                </span>
                                            ) : res.status === 'submitted' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[11px] font-bold border border-amber-200">
                                                    <CheckCircle2 size={12} /> Submitted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 rounded-md text-[11px] font-bold border border-gray-200">
                                                    <Clock size={12} /> Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <Link
                                            href={route('admin.survey-results.show', res.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs active:scale-[0.98]"
                                        >
                                            <Eye size={14} /> Detail
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(res.id)}
                                            className="px-3 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors active:scale-[0.98]"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-sm font-bold text-gray-700">Tidak ada hasil survei</p>
                                <p className="text-xs text-gray-400 mt-1">Belum ada survei yang sesuai dengan kriteria filter.</p>
                            </div>
                        )}
                    </div>

                    {/* Responses Pagination */}
                    {responses.last_page > 1 && (
                        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                            <div className="text-xs text-gray-500 text-center sm:text-left">
                                Menampilkan survei ke <span className="font-bold text-gray-900">{responses.from || 0}</span> - <span className="font-bold text-gray-900">{responses.to || 0}</span> dari <span className="font-bold text-gray-900">{responses.total}</span> survei
                            </div>
                            <div className="flex flex-wrap justify-center gap-1">
                                {responses.links.map((link, i) => (
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

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
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
