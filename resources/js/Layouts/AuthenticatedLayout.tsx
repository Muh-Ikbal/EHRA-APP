import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, FileText, Settings, Menu, Bell, Map, PieChart, MapPin, ShieldAlert, LogOut, UserCircle, ChevronLeft, ChevronDown, Shield } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Default open on desktop
    useState(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    });

    const menuGroups = [
        {
            title: 'Utama',
            roles: ['admin', 'enumerator'],
            items: [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
            ]
        },
        {
            title: 'Menu Survei',
            roles: ['admin', 'enumerator'],
            items: [
                { name: 'Mulai Survei', href: route('survey.conduct'), icon: Users, active: route().current('survey.*') },
                { name: 'Hasil Survei', href: route('admin.survey-results.index'), icon: PieChart, active: route().current('admin.survey-results.*') },
            ]
        },
        {
            title: 'Manajemen Data',
            roles: ['admin'],
            items: [
                { name: 'Manajemen Pengguna', href: route('admin.users.index'), icon: Shield, active: route().current('admin.users.*') },
                { name: 'Manajemen Kuesioner', href: route('admin.questionnaires.index'), icon: FileText, active: route().current('admin.questionnaires.*') },
                { name: 'Manajemen Lokasi', href: route('admin.locations.index'), icon: MapPin, active: route().current('admin.locations.*') },
                { name: 'Kategori Risiko', href: route('admin.risk-categories.index'), icon: ShieldAlert, active: route().current('admin.risk-categories.*') },
                { name: 'Akun Enumerator', href: route('admin.enumerators.index'), icon: Users, active: route().current('admin.enumerators.*') },
            ]
        }
    ];

    const visibleGroups = menuGroups.filter(group => group.roles.includes(user.role));

    return (
        <div className="flex h-screen font-sans" style={{ backgroundColor: '#f8fafc' }}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Clean White */}
            <aside
                className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed inset-y-0 left-0 z-50 lg:relative lg:z-0
                    ${sidebarOpen ? 'w-[260px]' : 'w-[260px] lg:w-[72px]'}
                    flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col
                    bg-white border-r border-gray-200/80
                `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3 w-full">
                        <img src="/assets/images/ehra-logo.png" alt="EHRA Logo" className="w-9 h-9 object-contain shrink-0" />
                        {sidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight">
                                    EHRA
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-tight">
                                    Admin Panel
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
                    {visibleGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            {sidebarOpen && (
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
                                    {group.title}
                                </p>
                            )}
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                            ${item.active
                                                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                            }`}
                                        title={!sidebarOpen ? item.name : undefined}
                                    >
                                        {item.active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: '#059669' }} />
                                        )}
                                        <Icon size={19} className={`shrink-0 ${item.active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        {sidebarOpen && <span className="text-[13px]">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer - User Info */}
                {sidebarOpen && (
                    <div className="px-3 pb-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#059669' }}>
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-700 truncate">{user.name}</p>
                                <p className="text-[10px] text-gray-400">Administrator</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-20"
                >
                    <ChevronLeft size={14} className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shrink-0 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        {header && (
                            <div className="text-gray-800 hidden sm:block flex-1">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#059669' }}></span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-100 mx-1 hidden md:block"></div>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#059669' }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-semibold text-gray-700 leading-tight">
                                            {user.name}
                                        </div>
                                        <div className="text-[11px] text-gray-400">Admin</div>
                                    </div>
                                    <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ backgroundColor: '#f8fafc' }}>
                    {header && (
                        <div className="text-gray-800 sm:hidden mb-4">
                            {header}
                        </div>
                    )}
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
