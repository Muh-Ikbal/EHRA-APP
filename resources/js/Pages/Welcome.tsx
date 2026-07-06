import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, MapPin, Activity, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// We will use real data from backend passed via mapData prop.

function MapController({ geoData, selectedKabupaten }: { geoData: any, selectedKabupaten: string }) {
    const map = useMap();

    useEffect(() => {
        if (!geoData) return;

        if (!selectedKabupaten) {
            // Zoom back to default Sultra view
            map.setView([-4.14491, 122.174605], 7);
            return;
        }

        const features = geoData.features.filter((f: any) => f.properties?.WADMKK === selectedKabupaten);
        if (features.length > 0) {
            const layer = L.geoJSON(features);
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [20, 20] });
            }
        }
    }, [geoData, selectedKabupaten, map]);

    return null;
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    mapData = {},
}: PageProps<{ laravelVersion: string; phpVersion: string; mapData?: Record<string, any> }>) {
    const [geoData, setGeoData] = useState<any>(null);
    const [selectedKabupaten, setSelectedKabupaten] = useState<string>('');
    const [kabupatenList, setKabupatenList] = useState<string[]>([]);

    useEffect(() => {
        fetch('/data/sultra.geojson')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
                if (data && data.features) {
                    const uniqueKabupaten = Array.from(new Set(data.features.map((f: any) => f.properties?.WADMKK))).filter(Boolean) as string[];
                    setKabupatenList(uniqueKabupaten.sort());
                }
            })
            .catch(err => console.error("Error loading geojson", err));
    }, []);

    const styleFeature = (feature: any) => {
        const desaName = feature?.properties?.WADMKD || '';
        const villageData = mapData[desaName];

        return {
            fillColor: villageData ? villageData.color : '#e5e7eb',
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.6
        };
    };

    const getRiskLabelText = (riskStr: string) => {
        if (!riskStr) return 'Belum Dianalisis';
        return riskStr.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const onEachFeature = (feature: any, layer: any) => {
        const { WADMKC, WADMKD } = feature.properties;
        const villageData = mapData[WADMKD];
        const riskLabel = villageData ? getRiskLabelText(villageData.risk) : 'Belum Dianalisis';
        const riskColor = villageData ? villageData.color : '#cbd5e1'; // slate-300 for unanalyzed
        const respondentsInfo = villageData
            ? `<p class="text-xs text-gray-500 m-0 mb-2">Responden: ${villageData.total_respondents} (Skor: ${villageData.irs_total})</p>`
            : `<p class="text-xs text-gray-400 m-0 mb-2 italic">Belum ada data survei</p>`;

        const tooltipContent = `
            <div class="font-sans min-w-[150px] p-1">
                <h4 class="font-bold text-gray-900 m-0 mb-1">${WADMKD || 'Unknown'}</h4>
                <p class="text-xs text-gray-500 m-0 mb-1">Kec. ${WADMKC || 'Unknown'}</p>
                ${respondentsInfo}
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${riskColor}"></span>
                    <span class="text-sm font-medium text-gray-700">${riskLabel}</span>
                </div>
            </div>
        `;

        layer.bindPopup(tooltipContent, {
            // sticky: true,
            className: 'bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-xl p-2'
        });

        layer.on({
            mouseover: (e: any) => {
                const target = e.target;
                target.setStyle({
                    weight: 2,
                    color: '#1e293b',
                    dashArray: '',
                    fillOpacity: 0.8
                });
                target.bringToFront();
            },
            mouseout: (e: any) => {
                const target = e.target;
                // To safely reset style, we should use the layer's original style or the GeoJSON resetStyle function.
                // However, directly calling the style function again is easier:
                target.setStyle(styleFeature(feature));
            }
        });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans antialiased text-gray-900">
                {/* Navbar */}
                <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-zinc-900/80 dark:border-zinc-800 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                    EHRA App
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content (Dashboard Overview) */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Publik</h1>
                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-2xl">
                            Ringkasan dan progres pelaksanaan survei EHRA (Environmental Health Risk Assessment) yang dapat diakses oleh masyarakat umum.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Stat 1 */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 relative z-10">
                                    <FileText size={26} strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Survei</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">1,248</h3>
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 relative z-10">
                                    <MapPin size={26} strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Desa Tersurvei</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">86 <span className="text-base font-medium text-gray-400">/ 124</span></h3>
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 dark:bg-rose-900/10 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
                                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 relative z-10">
                                    <AlertTriangle size={26} strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Risiko Tinggi</p>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">12</h3>
                                        <span className="text-sm font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300 px-2.5 py-0.5 rounded-full">14%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat 4 */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-md border border-transparent text-white flex items-center gap-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 relative z-10 backdrop-blur-sm border border-white/10">
                                    <Activity size={26} strokeWidth={2} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-indigo-100 mb-1">Indeks Risiko Rata-rata</p>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">Sedang</h3>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Peta Persebaran Risiko Lingkungan</h3>
                                <select
                                    className="bg-gray-50 dark:bg-zinc-800 border-none text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 py-2 px-4 cursor-pointer"
                                    value={selectedKabupaten}
                                    onChange={(e) => setSelectedKabupaten(e.target.value)}
                                >
                                    <option value="">Semua Kabupaten / Kota</option>
                                    {kabupatenList.map(kab => (
                                        <option key={kab} value={kab}>{kab}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 relative z-0">
                                <MapContainer center={[-4.14491, 122.174605]} zoom={7} scrollWheelZoom={false} className="h-full w-full bg-[#f8fafc] dark:bg-[#09090b]">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    />
                                    {geoData && (
                                        <GeoJSON
                                            data={geoData}
                                            style={styleFeature}
                                            onEachFeature={onEachFeature}
                                        />
                                    )}
                                    <MapController geoData={geoData} selectedKabupaten={selectedKabupaten} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Chart Area */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 lg:col-span-2">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progress Survei EHRA</h3>
                                    <select className="bg-gray-50 dark:bg-zinc-800 border-none text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 py-2 px-4 cursor-pointer">
                                        <option>Bulan Ini</option>
                                        <option>Bulan Lalu</option>
                                        <option>Tahun Ini</option>
                                    </select>
                                </div>
                                <div className="h-[280px] w-full flex items-end gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {[40, 60, 45, 80, 50, 90, 70, 65, 85, 100].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                            <div className="w-full relative rounded-t-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-end h-[240px]">
                                                <div
                                                    className="w-full bg-blue-500 group-hover:bg-blue-600 dark:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors rounded-t-md relative"
                                                    style={{ height: `${h}%` }}
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs transition-opacity whitespace-nowrap pointer-events-none">
                                                        {h}%
                                                    </div>
                                                </div>
                                            </div>
                                            <span>T{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Distribusi Risiko</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Sangat Tinggi</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">5%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5">
                                                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Tinggi</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">14%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5">
                                                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Sedang</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">45%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5">
                                                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Kurang Berisiko</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">26%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5">
                                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '26%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Tidak Berisiko</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">10%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5">
                                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Aktivitas Terbaru</h3>
                                    <div className="space-y-5">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Desa Suka Maju selesai</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kuota 40/40 terpenuhi • 2 jam lalu</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Enumerator Budi login</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Mulai survei Kec. Kota • 3 jam lalu</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Laporan mingguan di-generate</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Sistem otomatis • Kemarin</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Placeholder */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-10">
                            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Status Survei per Desa</h3>
                                <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40">Lihat Semua Data</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                                        <tr>
                                            <th className="px-6 py-4">Kelurahan/Desa</th>
                                            <th className="px-6 py-4">Kecamatan</th>
                                            <th className="px-6 py-4">Progress Survei</th>
                                            <th className="px-6 py-4">Status Risiko Lingkungan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-5 font-semibold text-gray-900 dark:text-white">Mekar Jaya</td>
                                            <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-medium">Suka Karya</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 max-w-[120px]">
                                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">40/40 (100%)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-md text-xs font-bold border border-rose-200 dark:border-rose-800/50 shadow-sm">Tinggi</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-5 font-semibold text-gray-900 dark:text-white">Suka Maju</td>
                                            <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-medium">Suka Karya</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 max-w-[120px]">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">24/40 (60%)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-200 dark:border-amber-800/50 shadow-sm">Sedang</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-5 font-semibold text-gray-900 dark:text-white">Tirta Jaya</td>
                                            <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-medium">Suka Karya</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 max-w-[120px]">
                                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">4/40 (10%)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-bold border border-gray-200 dark:border-zinc-700 shadow-sm">Belum Dianalisis</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} EHRA App. All rights reserved.
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
