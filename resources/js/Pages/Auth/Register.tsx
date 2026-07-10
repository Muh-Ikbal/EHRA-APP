import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#f8fafc' }}>
            <Head title="Daftar — EHRA" />

            {/* Left Side - Clean solid emerald */}
            <div className="hidden lg:flex lg:w-1/2 relative text-white flex-col justify-between overflow-hidden" style={{ backgroundColor: '#059669' }}>
                {/* Subtle decorative pattern */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full" style={{ backgroundColor: '#fff' }}></div>
                    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: '#fff' }}></div>
                </div>

                <div className="p-12 relative z-10 flex flex-col h-full items-center justify-center text-center">
                    {/* Logo - white card so it pops */}
                    <div className="mb-10 bg-white rounded-2xl p-8 shadow-lg">
                        <img
                            src="/assets/images/logo.png"
                            alt="EHRA Logo"
                            className="h-44 w-auto mx-auto"
                        />
                    </div>

                    <p className="text-base max-w-sm text-white/90 font-medium leading-relaxed">
                        Studi Penilaian Risiko Kesehatan Lingkungan untuk mendukung sanitasi yang lebih baik di komunitas Anda.
                    </p>
                </div>

                <div className="p-8 relative z-10 text-center">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} EHRA — Environmental Health Risk Assessment
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-white">
                {/* Logo top-left */}
                <div className="absolute top-8 left-8 sm:left-12">
                    <img src="/assets/images/logo.png" alt="EHRA Logo" className="h-12 w-auto" />
                </div>

                <div className="w-full max-w-md mt-16 lg:mt-0">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru!</h2>
                        <p className="text-sm text-gray-500">
                            Sudah punya akun? <Link href={route('login')} className="font-semibold underline" style={{ color: '#059669' }}>Masuk sekarang</Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 focus:ring-0 placeholder:text-gray-400 font-medium transition-colors"
                                style={{ borderBottomColor: data.name ? '#059669' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#059669'}
                                onBlur={(e) => { if (!data.name) e.target.style.borderBottomColor = '' }}
                                placeholder="Nama Lengkap"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 focus:ring-0 placeholder:text-gray-400 font-medium transition-colors"
                                style={{ borderBottomColor: data.email ? '#059669' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#059669'}
                                onBlur={(e) => { if (!data.email) e.target.style.borderBottomColor = '' }}
                                placeholder="Alamat Email"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 focus:ring-0 placeholder:text-gray-400 font-medium transition-colors"
                                style={{ borderBottomColor: data.password ? '#059669' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#059669'}
                                onBlur={(e) => { if (!data.password) e.target.style.borderBottomColor = '' }}
                                placeholder="Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 focus:ring-0 placeholder:text-gray-400 font-medium transition-colors"
                                style={{ borderBottomColor: data.password_confirmation ? '#059669' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#059669'}
                                onBlur={(e) => { if (!data.password_confirmation) e.target.style.borderBottomColor = '' }}
                                placeholder="Konfirmasi Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-75 transition-colors"
                                style={{ backgroundColor: '#059669' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            >
                                Daftar Sekarang
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

