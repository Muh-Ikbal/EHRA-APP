import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { FileText, MapPin, Activity, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({
    stats,
    riskDistribution,
    recentSurveys,
    surveyProgress,
    availableYears = [],
    selectedYear = '',
    availableVersions = [],
    selectedVersionId = '',
}: any) {
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        const query: any = {};
        if (year) query.year = year;
        if (selectedVersionId) query.version_id = selectedVersionId;
        router.get(route('dashboard'), query, { preserveState: true, replace: true });
    };

    const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const version_id = e.target.value;
        const query: any = {};
        if (selectedYear) query.year = selectedYear;
        if (version_id) query.version_id = version_id;
        router.get(route('dashboard'), query, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Dashboard Overview
                    </h2>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                        <Calendar size={16} className="text-emerald-600 shrink-0" />
                        <label htmlFor="year-filter" className="text-xs font-semibold text-gray-500 shrink-0">Tahun Survei:</label>
                        <select
                            id="year-filter"
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0 py-0 pl-1 pr-6 cursor-pointer"
                        >
                            <option value="">Semua Tahun</option>
                            {availableYears.map((year: number) => (
                                <option key={year} value={year}>
                                    Tahun {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 relative z-10">
                            <FileText size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Survei</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.total_surveys}</h3>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 relative z-10">
                            <MapPin size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Desa Tersurvei</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.surveyed_villages} <span className="text-sm font-normal text-gray-400">/ {stats.total_villages}</span></h3>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 relative z-10">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Risiko Tinggi</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.high_risk_count} <span className="text-sm font-normal text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full ml-1">{stats.high_risk_percentage}%</span></h3>
                        </div>
                    </div>

                    {/* Stat 4 - Green gradient */}
                    <div className="rounded-2xl p-5 shadow-sm border border-transparent text-white flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow" style={{ background: '#059669' }}>
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 relative  backdrop-blur-sm">
                            <Activity size={24} />
                        </div>
                        <div className="relative ">
                            <p className="text-sm font-medium text-white/80 mb-1">Indeks Risiko</p>
                            <h3 className="text-2xl font-bold text-white">{stats.average_risk_name}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Area */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-gray-800">
                                Progress Survei EHRA {selectedYear ? `(${selectedYear})` : ''}
                            </h3>
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg text-gray-600 focus:ring-emerald-500 focus:border-emerald-500 py-1.5 px-3 cursor-pointer"
                            >
                                <option value="">Semua Tahun</option>
                                {availableYears.map((year: number) => (
                                    <option key={year} value={year}>
                                        Tahun {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="h-[250px] w-full flex items-end gap-0.5 sm:gap-1 text-xs text-gray-400">
                            {surveyProgress.map((p: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full max-w-[24px] sm:max-w-[32px] relative rounded-t-md bg-gray-50 flex items-end h-[185px]" title={`${p.value} Survei`}>
                                        <div
                                            className="w-full rounded-t-md transition-all duration-300 relative flex justify-center group-hover:brightness-110"
                                            style={{ height: `${p.height}%`, background: `#059669` }}
                                        >
                                            <span className={`absolute -top-5 text-[11px] font-bold pointer-events-none whitespace-nowrap transition-colors ${p.value > 0 ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                {p.value}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-medium text-gray-500 text-[11px] mt-1.5 truncate">{p.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Risk Distribution Pie Chart */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <h3 className="text-base font-bold text-gray-800">Distribusi Risiko</h3>
                                <select
                                    value={selectedVersionId}
                                    onChange={handleVersionChange}
                                    className="bg-gray-50 border border-gray-200 text-xs rounded-lg text-gray-700 focus:ring-emerald-500 focus:border-emerald-500 py-1 px-2.5 cursor-pointer max-w-[180px] truncate"
                                    title="Filter Versi Kuisioner"
                                >
                                    <option value="">Semua Versi</option>
                                    {availableVersions.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.version_code}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {riskDistribution && riskDistribution.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[190px] h-[190px] my-2 relative">
                                        <Pie
                                            data={{
                                                labels: riskDistribution.map((item: any) => item.name),
                                                datasets: [
                                                    {
                                                        data: riskDistribution.map((item: any) => item.count),
                                                        backgroundColor: riskDistribution.map((item: any) => item.color || '#cccccc'),
                                                        borderColor: '#ffffff',
                                                        borderWidth: 2,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context: any) => {
                                                                const label = context.label || '';
                                                                const value = context.raw || 0;
                                                                const dataset = context.chart.data.datasets[0].data;
                                                                const total = dataset.reduce((a: number, b: number) => a + b, 0);
                                                                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                                                                return ` ${label}: ${pct}% (${value} Desa)`;
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Custom Legend */}
                                    <div className="w-full space-y-2 mt-4 pt-3 border-t border-gray-100">
                                        {riskDistribution.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600 font-medium flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                                    <span className="truncate max-w-[140px]" title={item.name}>{item.name}</span>
                                                </span>
                                                <span className="text-gray-800 font-bold">
                                                    {item.pct}% <span className="text-gray-400 font-normal text-[11px]">({item.count})</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-400 text-sm">
                                    Belum ada data distribusi risiko
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <h3 className="text-base font-bold text-gray-800">Survei Terbaru</h3>
                        <button className="text-sm font-semibold hover:text-emerald-700 transition-colors" style={{ color: '#1a5c3a' }}>Lihat Semua</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3.5">Tanggal</th>
                                    <th className="px-6 py-3.5">Kelurahan/Desa</th>
                                    <th className="px-6 py-3.5">Kecamatan</th>
                                    <th className="px-6 py-3.5">Enumerator</th>
                                    <th className="px-6 py-3.5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentSurveys.map((survey: any) => (
                                    <tr key={survey.id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{survey.date}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{survey.village_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{survey.district_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{survey.enumerator_name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold border border-emerald-100">
                                                {survey.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentSurveys.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada survei.</td>
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
