import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FileText, MapPin, Activity, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';

export default function Dashboard({ stats, riskDistribution, recentSurveys, surveyProgress }: any) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-bold text-gray-800">
                    Dashboard Overview
                </h2>
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
                        <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 relative z-10 backdrop-blur-sm">
                            <Activity size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-white/80 mb-1">Indeks Risiko</p>
                            <h3 className="text-2xl font-bold text-white">{stats.average_risk_name}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Area */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-gray-800">Progress Survei EHRA</h3>
                            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg text-gray-600 focus:ring-emerald-500 focus:border-emerald-500 py-1.5 px-3">
                                <option>Bulan Ini</option>
                                <option>Bulan Lalu</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full flex items-end gap-2 text-xs text-gray-400">
                            {surveyProgress.map((p: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full relative rounded-t-lg overflow-hidden bg-gray-50 flex items-end h-[200px]" title={`${p.value} Survei`}>
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-300"
                                            style={{ height: `${p.height}%`, background: `#059669` }}
                                        ></div>
                                    </div>
                                    <span className="font-medium">{p.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Risk Distribution */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Distribusi Risiko</h3>
                            <div className="space-y-4">
                                {riskDistribution.map((item: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="text-gray-600 font-medium flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                {item.name}
                                            </span>
                                            <span className="text-gray-800 font-bold">{item.pct}% <span className="text-gray-400 font-normal text-xs">({item.count})</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Desa Suka Maju selesai</p>
                                        <p className="text-xs text-gray-500">Kuota 40/40 terpenuhi • 2 jam lalu</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Enumerator Budi login</p>
                                        <p className="text-xs text-gray-500">Mulai survei Kec. Kota • 3 jam lalu</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Laporan mingguan di-generate</p>
                                        <p className="text-xs text-gray-500">Sistem otomatis • Kemarin</p>
                                    </div>
                                </div>
                            </div>
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
