import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, useMap } from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface RiskCategory {
    name: string;
    color: string;
    lower_bound: number;
    upper_bound: number;
}

interface VillageData {
    risk: string;
    color: string;
    irs_total: number;
    total_respondents: number;
    village_name: string;
    district_name: string;
    city_name: string;
    kemendagri_code: string;
    component_scores: Record<string, { label: string; score: number }>;
}

interface WelcomeProps {
    laravelVersion: string;
    phpVersion: string;
    mapData?: Record<string, VillageData>;
    riskCategories?: RiskCategory[];
    cityList?: string[];
    version? : {id:string; version_code:string; title:string};
    selectedVersionId?: string | null;
}

function MapController({ geoData, selectedKabupaten }: { geoData: any; selectedKabupaten: string }) {
    const map = useMap();
    useEffect(() => {
        if (!geoData) return;
        if (!selectedKabupaten) { map.setView([-4.14491, 122.174605], 7); return; }
        const features = geoData.features.filter((f: any) => f.properties?.WADMKK === selectedKabupaten);
        if (features.length > 0) {
            const layer = L.geoJSON(features);
            const bounds = layer.getBounds();
            if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [geoData, selectedKabupaten, map]);
    return null;
}

function getPolygonCentroid(feature: any): [number, number] | null {
    try {
        const coords = feature.geometry.type === 'MultiPolygon'
            ? feature.geometry.coordinates[0][0]
            : feature.geometry.coordinates[0];
        let latSum = 0, lngSum = 0;
        coords.forEach((c: number[]) => { lngSum += c[0]; latSum += c[1]; });
        return [latSum / coords.length, lngSum / coords.length];
    } catch { return null; }
}

export default function Welcome({
    auth, mapData = {}, riskCategories = [], cityList = [], versions = [], selectedVersionId = null
}: PageProps<WelcomeProps>) {
    const [geoData, setGeoData] = useState<any>(null);
    const [selectedKabupaten, setSelectedKabupaten] = useState<string>('');
    const [selectedRow, setSelectedRow] = useState<string | null>(null);

    const handleVersionChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        router.get('/', {version: e.target.value}, {preserveState:true})
    }

    useEffect(() => {
        fetch('/data/sultra.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Error loading geojson", err));
    }, []);

    const getVillageData = (props: any): VillageData | null => {
        if (!props) return null;
        const key = `${props.WADMKK || ''}_${props.WADMKC || ''}_${props.WADMKD || ''}`.toUpperCase();
        return mapData[key] || null;
    };

    const styleFeature = (feature: any) => ({
        fillColor: getVillageData(feature?.properties)?.color || '#e5e7eb',
        weight: 1, opacity: 1, color: 'white', dashArray: '3', fillOpacity: 0.5,
    });

    const onEachFeature = (feature: any, layer: any) => {
        const vd = getVillageData(feature.properties);
        const name = feature.properties?.WADMKD || 'Unknown';
        const kec = feature.properties?.WADMKC || '';
        const risk = vd ? vd.risk : 'Belum Dianalisis';
        const info = vd ? `Responden: ${vd.total_respondents} | IRS: ${vd.irs_total}` : 'Belum ada data';
        layer.bindPopup(`<div style="font-family:sans-serif;min-width:140px"><b>${name}</b><br/><small>Kec. ${kec}</small><br/><small>${info}</small><br/><small style="color:${vd?.color || '#999'}">● ${risk}</small></div>`);
        layer.on({
            mouseover: (e: any) => { e.target.setStyle({ weight: 2, color: '#0f172a', dashArray: '', fillOpacity: 0.8 }); e.target.bringToFront(); },
            mouseout: (e: any) => { e.target.setStyle(styleFeature(feature)); },
        });
    };

    // Filtered data by selected kabupaten
    const filteredMapData = useMemo(() => {
        if (!selectedKabupaten) return mapData;
        return Object.fromEntries(
            Object.entries(mapData).filter(([, v]) => v.city_name === selectedKabupaten)
        );
    }, [mapData, selectedKabupaten]);

    // Village markers with centroids
    const villageMarkers = useMemo(() => {
        if (!geoData) return [];
        const markers: { pos: [number, number]; data: VillageData }[] = [];
        geoData.features.forEach((f: any) => {
            const vd = getVillageData(f.properties);
            if (!vd) return;
            if (selectedKabupaten && f.properties?.WADMKK !== selectedKabupaten) return;
            const centroid = getPolygonCentroid(f);
            if (centroid) markers.push({ pos: centroid, data: vd });
        });
        return markers;
    }, [geoData, mapData, selectedKabupaten]);

    // Aggregate component scores across filtered villages
    const componentAggregates = useMemo(() => {
        const agg: Record<string, { label: string; totalScore: number; count: number }> = {};
        Object.values(filteredMapData).forEach(v => {
            if (!v.component_scores) return;
            Object.entries(v.component_scores).forEach(([key, comp]) => {
                if (!agg[key]) agg[key] = { label: comp.label, totalScore: 0, count: 0 };
                agg[key].totalScore += comp.score;
                agg[key].count += 1;
            });
        });
        return agg;
    }, [filteredMapData]);

    // Split components into two groups for the two bar charts
    const facilityKeys = ['air_minum', 'air_limbah', 'persampahan', 'drainase'];
    const behaviorKeys = ['phbs'];

    const makeBarData = (keys: string[]) => {
        const labels: string[] = [];
        const values: number[] = [];
        const colors = ['#26a269', '#1c71d8', '#e5a50a', '#c64600', '#613583', '#e01b24'];
        keys.forEach(k => {
            const comp = componentAggregates[k];
            if (comp) {
                labels.push(comp.label);
                values.push(comp.count > 0 ? Math.round(comp.totalScore / comp.count * 100) / 100 : 0);
            }
        });
        // If no facility/behavior keys match, show all available
        if (labels.length === 0) {
            Object.entries(componentAggregates).forEach(([, comp]) => {
                labels.push(comp.label);
                values.push(comp.count > 0 ? Math.round(comp.totalScore / comp.count * 100) / 100 : 0);
            });
        }
        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderRadius: 4,
                barThickness: 28,
            }],
        };
    };

    // Pie chart data - risk distribution
    const pieData = useMemo(() => {
        const counts: Record<string, { count: number; color: string }> = {};
        Object.values(filteredMapData).forEach(v => {
            if (!counts[v.risk]) counts[v.risk] = { count: 0, color: v.color };
            counts[v.risk].count += 1;
        });
        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts).map(c => c.count),
                backgroundColor: Object.values(counts).map(c => c.color),
                borderWidth: 2,
                borderColor: '#fff',
            }],
        };
    }, [filteredMapData]);

    const barOptions = (title: string) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, font: { size: 12, weight: 'bold' as const }, color: '#1e293b' },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 45 } },
        },
    });

    const pieOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const, labels: { font: { size: 10 }, padding: 8, usePointStyle: true } },
            title: { display: true, text: 'DETAIL DISTRIBUSI RISIKO', font: { size: 12, weight: 'bold' as const }, color: '#1e293b' },
        },
    };

    // Table data sorted by IRS
    const tableData = useMemo(() => {
        return Object.entries(filteredMapData)
            .sort((a, b) => (b[1].irs_total || 0) - (a[1].irs_total || 0));
    }, [filteredMapData]);

    const riskBadgeStyle = (color: string) => ({
        backgroundColor: color, color: '#fff', padding: '2px 10px',
        borderRadius: '4px', fontSize: '11px', fontWeight: 700, display: 'inline-block',
        textTransform: 'uppercase' as const, letterSpacing: '0.5px',
    });

    return (
        <>
            <Head title="Dashboard EHRA" />
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                {/* Navbar */}
                <nav className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 shadow-sm z-50 relative" style={{
                    backgroundColor: '#059669',
                }}>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
                        <Activity size={20} color="#fff" className="flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <span className="text-white text-sm sm:text-base font-bold tracking-tight truncate">
                            EHRA <span className="font-normal opacity-80 hidden sm:inline">Dashboard Publik</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-white text-[11px] sm:text-[13px] font-semibold no-underline px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white/15 hover:bg-white/20 transition-colors whitespace-nowrap">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-white text-[11px] sm:text-[13px] font-semibold no-underline px-2 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="text-[#059669] text-[11px] sm:text-[13px] font-semibold no-underline px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr_320px] gap-0 lg:h-[calc(100vh-48px-240px)] min-h-[500px] lg:min-h-0">
                    {/* Left Sidebar */}
                    <div style={{
                        backgroundColor: '#fff', borderRight: '1px solid #e2e8e0', padding: '16px',
                        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
                    }}>
                        <div style={{marginBottom:'16px'}}>
                            <label style={{fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                                Versi Kuiseioner
                            </label>
                            <select
                                value={selectedVersionId || ''}
                                onChange={handleVersionChange}
                                style={{
                                    width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px',
                                    fontSize: '13px', fontWeight: 500, backgroundColor: '#fff', cursor: 'pointer',
                                }}
                            >
                                {versions.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.version_code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                                Pilih Kabupaten / Kota Sultra
                            </label>
                            <select
                                value={selectedKabupaten}
                                onChange={e => setSelectedKabupaten(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px',
                                    fontSize: '13px', fontWeight: 500, backgroundColor: '#fff', cursor: 'pointer',
                                }}
                            >
                                <option value="">Seluruh Wilayah</option>
                                {cityList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                        </div>
                        

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px' }}>
                            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>
                                Legenda Risiko Sanitasi (IRS)
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {riskCategories.map((cat, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            backgroundColor: cat.color, border: '2px solid rgba(0,0,0,0.1)',
                                            flexShrink: 0,
                                        }} />
                                        <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px' }}>
                            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>
                                Ringkasan Data
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: '#6b7280' }}>Total Desa Tersurvei</span>
                                    <span style={{ fontWeight: 700, color: '#059669' }}>{Object.keys(filteredMapData).length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: '#6b7280' }}>Total Responden</span>
                                    <span style={{ fontWeight: 700, color: '#059669' }}>
                                        {Object.values(filteredMapData).reduce((s, v) => s + (v.total_respondents || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Center */}
                    <div className="relative h-[400px] lg:h-auto lg:min-h-full">
                        <MapContainer center={[-4.14491, 122.174605]} zoom={7} scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', backgroundColor: '#e8f0ec' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {geoData && (
                                <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
                            )}
                            {villageMarkers.map((m, i) => (
                                <CircleMarker key={i} center={m.pos} radius={8}
                                    pathOptions={{
                                        fillColor: m.data.color, fillOpacity: 0.9,
                                        color: '#fff', weight: 2,
                                    }}
                                />
                            ))}
                            <MapController geoData={geoData} selectedKabupaten={selectedKabupaten} />
                        </MapContainer>
                    </div>

                    {/* Right Panel - Table */}
                    <div style={{
                        backgroundColor: '#fff', borderLeft: '1px solid #e2e8e0', borderTop: '1px solid #e2e8e0',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    }} className="lg:border-t-0">
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#059669', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                Matriks Desa/Kelurahan Skala Mikro
                            </h3>
                            <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0' }}>
                                Klik baris tabel untuk melihat detail
                            </p>
                        </div>
                        <div className="overflow-x-auto overflow-y-auto flex-1">
                            <table style={{ width: '100%', minWidth: '400px', fontSize: '12px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Kode</th>
                                        <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Nama Desa / Kelurahan</th>
                                        <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Status IRS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map(([key, data], idx) => (
                                        <tr key={idx}
                                            onClick={() => setSelectedRow(key)}
                                            style={{
                                                cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                                                backgroundColor: selectedRow === key ? '#f0fdf4' : (idx % 2 === 0 ? '#fff' : '#fafbfa'),
                                                transition: 'background-color 0.15s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = selectedRow === key ? '#f0fdf4' : (idx % 2 === 0 ? '#fff' : '#fafbfa'))}
                                        >
                                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>
                                                {data.kemendagri_code || '-'}
                                            </td>
                                            <td style={{ padding: '8px 10px' }}>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{data.village_name}</div>
                                                <div style={{ fontSize: '10px', color: '#9ca3af' }}>Kec. {data.district_name}</div>
                                            </td>
                                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                                <span style={riskBadgeStyle(data.color)}>{data.risk}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {tableData.length === 0 && (
                                        <tr>
                                            <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
                                                Belum ada data survei
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bottom Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 pb-4 bg-[#f8fafc] h-auto lg:h-[240px]">
                    {/* Chart 1 - Facility Sanitation */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '14px', border: '1px solid #e2e8e0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ height: '200px' }}>
                            <Bar data={makeBarData(facilityKeys)} options={barOptions('KOMPONEN 1: KETERSEDIAAN FASILITAS SANITASI (%)')} />
                        </div>
                    </div>

                    {/* Chart 2 - Hygiene Behavior */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '14px', border: '1px solid #e2e8e0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ height: '200px' }}>
                            <Bar data={makeBarData(behaviorKeys)} options={barOptions('KOMPONEN 2: PERILAKU HIGIENE & STBM (%)')} />
                        </div>
                    </div>

                    {/* Chart 3 - Pie Chart */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '14px', border: '1px solid #e2e8e0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ height: '200px' }}>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
