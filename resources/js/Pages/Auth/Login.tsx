import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen font-sans bg-gray-50">
            <Head title="Masuk — EHRA" />

            {/* Left Side - Dark gradient to match logo */}
            <div className="hidden lg:flex lg:w-1/2 relative text-white flex-col justify-between overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 30%, #0f3043 60%, #134a3f 100%)' }}>
                {/* Subtle decorative circles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #2196F3, transparent)' }}></div>
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #4CAF50, transparent)' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #00BCD4, transparent)' }}></div>
                </div>

                {/* Decorative wave lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,65 Q15,55 30,65 T60,65 T100,60" fill="none" stroke="#4CAF50" strokeWidth="0.3" />
                        <path d="M0,72 Q20,62 40,72 T80,70 T100,68" fill="none" stroke="#2196F3" strokeWidth="0.3" />
                        <path d="M0,80 Q25,70 50,80 T100,78" fill="none" stroke="#00BCD4" strokeWidth="0.3" />
                    </svg>
                </div>

                <div className="p-12 relative z-10 flex flex-col h-full items-center justify-center text-center">
                    {/* Logo - displayed in a card */}
                    <div className="mb-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
                        <img
                            src="/assets/images/logo.png"
                            alt="EHRA Logo"
                            className="h-44 w-auto mx-auto drop-shadow-lg"
                        />
                    </div>

                    <p className="text-base max-w-sm text-gray-300 font-medium leading-relaxed">
                        Studi Penilaian Risiko Kesehatan Lingkungan untuk mendukung sanitasi yang lebih baik di komunitas Anda.
                    </p>
                </div>

                <div className="p-8 relative z-10 text-center">
                    <p className="text-xs text-gray-500">
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
                        <p className="text-sm text-gray-500">
                            Belum punya akun? <Link href={route('register')} className="font-semibold underline" style={{ color: '#1a6b4a' }}>Daftar sekarang</Link>, gratis dan hanya butuh beberapa detik.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 focus:ring-0 placeholder:text-gray-400 font-medium transition-colors"
                                style={{ borderBottomColor: data.email ? '#1a6b4a' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#1a6b4a'}
                                onBlur={(e) => { if (!data.email) e.target.style.borderBottomColor = '' }}
                                placeholder="Alamat Email"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
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
                                style={{ borderBottomColor: data.password ? '#1a6b4a' : undefined }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#1a6b4a'}
                                onBlur={(e) => { if (!data.password) e.target.style.borderBottomColor = '' }}
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1A1A1A] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-75 transition-colors"
                            >
                                Masuk Sekarang
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
