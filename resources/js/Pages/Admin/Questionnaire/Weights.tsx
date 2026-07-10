import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PieChart, ArrowLeft, Plus, Trash2, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

export default function Weights({ version, components, questions, weights, flash }: any) {
    const [activeTab, setActiveTab] = useState(components.length > 0 ? components[0].id : null);
    
    // For new weight form
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        irs_component_id: activeTab || '',
        question_id: '',
        risk_condition: '',
        weight: '',
    });

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        setData({ ...data, irs_component_id: id, question_id: '', risk_condition: '', weight: '' });
        clearErrors();
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data, question_id: e.target.value, risk_condition: '' });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.questionnaires.weights.store', version.id), {
            onSuccess: () => reset('question_id', 'risk_condition', 'weight'),
        });
    };

    const deleteWeight = (id: string) => {
        if (confirm('Yakin ingin menghapus aturan bobot ini?')) {
            router.delete(route('admin.questionnaires.weights.destroy', id));
        }
    };

    // Filter weights for current active tab
    const currentWeights = weights.filter((w: any) => w.irs_component_id === activeTab);
    
    // Get questions that belong to the active tab component
    const currentQuestions = questions.filter((q: any) => q.irs_component_id === activeTab);

    // Get selected question to populate risk_condition options
    const selectedQuestion = currentQuestions.find((q: any) => q.id === data.question_id);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.questionnaires.index')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Kembali"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                                <PieChart className="text-indigo-600" />
                                Manajemen Bobot IRS
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Versi: {version.title}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Bobot IRS - Manajemen Kuesioner" />

            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-x-auto">
                    <div className="flex items-center gap-2 min-w-max">
                        {components.map((comp: any) => (
                            <button
                                key={comp.id}
                                onClick={() => handleTabChange(comp.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === comp.id 
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                {comp.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {activeTab && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-indigo-600" />
                                    Tambah Aturan Baru
                                </h3>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                                        <select
                                            value={data.question_id}
                                            onChange={handleQuestionChange}
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 text-sm"
                                            required
                                        >
                                            <option value="">-- Pilih Pertanyaan --</option>
                                            {currentQuestions.map((q: any) => (
                                                <option key={q.id} value={q.id}>{q.code} - {q.text.substring(0, 50)}...</option>
                                            ))}
                                        </select>
                                        {errors.question_id && <p className="text-rose-500 text-xs mt-1">{errors.question_id}</p>}
                                        {currentQuestions.length === 0 && (
                                            <p className="text-amber-600 text-xs mt-2 flex items-start gap-1">
                                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                Belum ada pertanyaan pilihan ganda yang terkait dengan pilar ini.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Risiko (Pilihan Jawaban)</label>
                                        <select
                                            value={data.risk_condition}
                                            onChange={e => setData('risk_condition', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 text-sm disabled:bg-gray-100"
                                            required
                                            disabled={!data.question_id}
                                        >
                                            <option value="">-- Pilih Jawaban --</option>
                                            {selectedQuestion?.options.map((opt: any) => (
                                                <option key={opt.id} value={opt.value}>{opt.value} - {opt.label}</option>
                                            ))}
                                        </select>
                                        {errors.risk_condition && <p className="text-rose-500 text-xs mt-1">{errors.risk_condition}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Bobot (Weight)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.weight}
                                            onChange={e => setData('weight', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 text-sm"
                                            placeholder="Misal: 2.50"
                                            required
                                        />
                                        {errors.weight && <p className="text-rose-500 text-xs mt-1">{errors.weight}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.question_id}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={18} /> Simpan Aturan
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800">Daftar Aturan Bobot</h3>
                                    <p className="text-sm text-gray-500">Nilai indeks yang akan ditambahkan jika responden memilih kondisi tertentu.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 w-1/2">Pertanyaan Terkait</th>
                                                <th className="px-6 py-4">Kondisi (Jawaban)</th>
                                                <th className="px-6 py-4 text-center">Bobot</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {currentWeights.map((w: any) => {
                                                const relatedQuestion = currentQuestions.find((q: any) => q.id === w.question_id);
                                                return (
                                                    <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-800">{relatedQuestion?.code || 'N/A'}</div>
                                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2" title={relatedQuestion?.text}>
                                                                {relatedQuestion?.text || 'Pertanyaan tidak ditemukan'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-block px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md text-xs font-semibold border border-rose-100">
                                                                Jika = "{w.risk_condition}"
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                                +{parseFloat(w.weight).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => deleteWeight(w.id)}
                                                                className="text-rose-400 hover:text-rose-600 transition-colors"
                                                                title="Hapus Aturan"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {currentWeights.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                                        Belum ada aturan bobot untuk pilar ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
