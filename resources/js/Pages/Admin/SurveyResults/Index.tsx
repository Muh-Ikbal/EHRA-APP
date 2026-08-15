import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, MapPin, Activity, ArrowRight, Search, X } from 'lucide-react';
import { useState } from 'react';

interface VillageData {
    id: string;
    name: string;
    district_name: string;
    total_surveys: number;
    irs_result?: {
        irs_total: number;
        category_name: string;
        color: string;
    };
}

interface QuestionnaireVersion {
    id: string;
    version_code: string;
    title: string;
}

interface PaginationData {
    data: VillageData[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index({
    auth,
    villages,
    versions = [],
    filters = {},
}: PageProps<{ villages: PaginationData; versions?: QuestionnaireVersion[]; filters: any }>) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [versionId, setVersionId] = useState(filters.version_id || '');

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

        router.get(route('admin.survey-results.index'), queryParams, {
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
        router.get(route('admin.survey-results.index'), {}, { preserveState: true, replace: true });
    };

    const getVillageUrl = (villageId: string) => {
        const params: any = { villageId };
        if (versionId) params.version_id = versionId;
        if (status) params.status = status;
        return route('admin.survey-results.village', params);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Hasil Survei</h2>}
        >
            <Head title="Hasil Survei per Desa" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header & Filters Card */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Daftar Hasil Survei per Desa/Kelurahan</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Pilih desa untuk melihat rincian seluruh hasil survei dari responden di wilayah tersebut.
                        </p>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama desa/kecamatan..."
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
                                <th className="px-6 py-4">Desa/Kelurahan</th>
                                <th className="px-6 py-4">Kecamatan</th>
                                <th className="px-6 py-4">Total Survei</th>
                                <th className="px-6 py-4">Skor IRS Desa</th>
                                <th className="px-6 py-4">Kategori Risiko</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {villages.data && villages.data.length > 0 ? (
                                villages.data.map((village) => (
                                    <tr key={village.id} className="hover:bg-emerald-50/20 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-emerald-600 shrink-0" />
                                                <span>{village.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            Kec. {village.district_name}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                                                {village.total_surveys} Survei
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {village.irs_result ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Activity size={14} className="text-emerald-600" />
                                                    <span>{village.irs_result.irs_total}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 font-normal italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {village.irs_result ? (
                                                <span
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-2xs whitespace-nowrap"
                                                    style={{ backgroundColor: village.irs_result.color }}
                                                >
                                                    {village.irs_result.category_name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Belum Dihitung</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={getVillageUrl(village.id)}
                                                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm group-hover:translate-x-0.5 whitespace-nowrap"
                                            >
                                                Lihat Hasil Survei <ArrowRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="text-gray-300 mb-4" />
                                            <p className="text-base font-bold text-gray-700">Belum ada hasil survei</p>
                                            <p className="text-sm text-gray-400 mt-1">Data survei per desa akan tampil di sini setelah enumerator mengirimkannya.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Responsive Cards */}
                <div className="block md:hidden p-4 space-y-3 bg-gray-50/30">
                    {villages.data && villages.data.length > 0 ? (
                        villages.data.map((village) => (
                            <div key={village.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
                                            <MapPin size={16} className="text-emerald-600 shrink-0" />
                                            <span>{village.name}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Kecamatan {village.district_name}</p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 shrink-0">
                                        {village.total_surveys} Survei
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                                    <span className="text-gray-500 font-medium">Skor & Kategori IRS:</span>
                                    {village.irs_result ? (
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-extrabold text-gray-900">{village.irs_result.irs_total}</span>
                                            <span
                                                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs"
                                                style={{ backgroundColor: village.irs_result.color }}
                                            >
                                                {village.irs_result.category_name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Belum Dihitung</span>
                                    )}
                                </div>

                                <Link
                                    href={getVillageUrl(village.id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                >
                                    <span>Lihat Hasil Survei</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-sm font-bold text-gray-700">Belum ada hasil survei</p>
                            <p className="text-xs text-gray-400 mt-1">Data survei per desa akan tampil di sini setelah enumerator mengirimkannya.</p>
                        </div>
                    )}
                </div>

                {/* Village Pagination */}
                {villages.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                        <div className="text-xs text-gray-500">
                            Menampilkan desa ke <span className="font-bold text-gray-900">{villages.from || 0}</span> - <span className="font-bold text-gray-900">{villages.to || 0}</span> dari <span className="font-bold text-gray-900">{villages.total}</span> desa tersurvei
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {villages.links.map((link, i) => (
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
        </AuthenticatedLayout>
    );
}
