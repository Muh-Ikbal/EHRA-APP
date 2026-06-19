import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FileText, MapPin, Activity, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
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
                {/* Stats Grid - Compact & Bright */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 relative z-10">
                            <FileText size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Survei</p>
                            <h3 className="text-2xl font-bold text-gray-800">1,248</h3>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 relative z-10">
                            <MapPin size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Desa Tersurvei</p>
                            <h3 className="text-2xl font-bold text-gray-800">86 <span className="text-sm font-normal text-gray-400">/ 124</span></h3>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 relative z-10">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 mb-1">Risiko Tinggi</p>
                            <h3 className="text-2xl font-bold text-gray-800">12 <span className="text-sm font-normal text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full ml-1">14%</span></h3>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-sm border border-transparent text-white flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 relative z-10 backdrop-blur-sm">
                            <Activity size={24} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-white/80 mb-1">Indeks Risiko</p>
                            <h3 className="text-2xl font-bold text-white">Sedang</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Area */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-gray-800">Progress Survei EHRA</h3>
                            <select className="bg-gray-50 border-none text-sm rounded-lg text-gray-600 focus:ring-blue-500 py-1.5 px-3">
                                <option>Bulan Ini</option>
                                <option>Bulan Lalu</option>
                            </select>
                        </div>
                        {/* Placeholder for Chart */}
                        <div className="h-[250px] w-full flex items-end gap-2 text-xs text-gray-400">
                            {/* Mock Bars */}
                            {[40, 60, 45, 80, 50, 90, 70, 65, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full relative rounded-t-sm overflow-hidden bg-gray-100 flex items-end h-[200px]">
                                        <div 
                                            className="w-full bg-blue-500 group-hover:bg-blue-600 transition-colors rounded-t-sm" 
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                    <span>T{i+1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Status/Activities */}
                    <div className="space-y-6">
                        {/* Risk Distribution Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Distribusi Risiko</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">Sangat Tinggi</span>
                                        <span className="text-gray-800 font-bold">5%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">Tinggi</span>
                                        <span className="text-gray-800 font-bold">14%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '14%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">Sedang</span>
                                        <span className="text-gray-800 font-bold">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-amber-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">Kurang Berisiko</span>
                                        <span className="text-gray-800 font-bold">26%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '26%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">Tidak Berisiko</span>
                                        <span className="text-gray-800 font-bold">10%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
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
                                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
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

                {/* Table Placeholder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800">Status Survei per Desa</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Lihat Semua</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Kelurahan/Desa</th>
                                    <th className="px-6 py-3">Kecamatan</th>
                                    <th className="px-6 py-3">Progress</th>
                                    <th className="px-6 py-3">Status Risiko</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-800">Mekar Jaya</td>
                                    <td className="px-6 py-4 text-gray-600">Suka Karya</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-emerald-600">40/40</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold border border-rose-100">Tinggi</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Detail</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-800">Suka Maju</td>
                                    <td className="px-6 py-4 text-gray-600">Suka Karya</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">24/40</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold border border-amber-100">Sedang</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Detail</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-800">Tirta Jaya</td>
                                    <td className="px-6 py-4 text-gray-600">Suka Karya</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">4/40</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">Belum Dianalisis</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Detail</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
