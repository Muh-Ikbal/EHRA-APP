import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, FileText, Settings, Menu, Bell, Map, PieChart, MapPin } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
        { name: 'Mulai Survei', href: route('survey.conduct'), icon: Users, active: route().current('survey.*') },
        { name: 'Manajemen Lokasi', href: route('admin.locations.index'), icon: MapPin, active: route().current('admin.locations.*') },
        { name: 'Manajemen Kuesioner', href: route('admin.questionnaires.index'), icon: FileText, active: route().current('admin.questionnaires.*') },
        { name: 'Manajemen Survei', href: '#', icon: FileText, active: false },
        { name: 'Peta Risiko', href: '#', icon: Map, active: false },
        { name: 'Laporan EHRA', href: '#', icon: PieChart, active: false },
        { name: 'Enumerator', href: '#', icon: Users, active: false },
        { name: 'Pengaturan', href: '#', icon: Settings, active: false },
    ];

    return (
        <div className="flex h-screen bg-[#f4f7fb] font-sans">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                            <Map size={24} strokeWidth={2.5} />
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                EHRA
                            </span>
                        )}
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                    item.active
                                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                title={!sidebarOpen ? item.name : undefined}
                            >
                                <Icon size={20} className={item.active ? 'text-blue-600' : 'text-gray-400'} />
                                {sidebarOpen && <span className="text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shrink-0"
                        >
                            <Menu size={20} />
                        </button>
                        {header && (
                            <div className="text-gray-800 hidden sm:block flex-1">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent focus:border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-semibold text-gray-700 leading-tight">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500">Admin</div>
                                    </div>
                                    <svg
                                        className="h-4 w-4 text-gray-400 hidden md:block"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
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
                <main className="flex-1 overflow-y-auto bg-[#f4f7fb] p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
