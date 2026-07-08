import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, User, MapPin, Calendar, FileText, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import dayjs from 'dayjs';
import React from 'react';

interface SurveyResponse {
    id: string;
    respondent_code: string;
    status: string;
    submitted_at: string;
    enumerator: { name: string; email: string };
    village: {
        name: string;
        district: { name: string; city: { name: string; province: { name: string } } }
    };
    answers: Array<{
        question_id: string;
        answer_code?: string;
        answer_value?: string;
        answer_codes?: string[];
    }>;
}

interface IrsResult {
    irs_total: number;
    risk_aspect_category?: {
        category_name: string;
        color: string;
    };
    component_scores?: Record<string, { score: number, label: string }>;
}

interface Section {
    id: string;
    name: string;
    title: string;
    description: string;
    questions: Array<{
        id: string;
        code: string;
        question_text: string;
        question_type: string;
    }>;
}

export default function Show({ auth, response, sections, irsResult }: PageProps<{ response: SurveyResponse; sections: Section[]; irsResult?: IrsResult }>) {
    // Helper to get answer for a specific question
    const getAnswer = (questionId: string) => {
        const answer = response.answers.find(a => a.question_id === questionId);
        if (!answer) return <span className="text-gray-400 italic">Tidak dijawab</span>;

        if (answer.answer_codes && Array.isArray(answer.answer_codes) && answer.answer_codes.length > 0) {
            return <span className="font-medium text-gray-900">{answer.answer_codes.join(', ')}</span>;
        }
        if (answer.answer_value) return <span className="font-medium text-gray-900">{answer.answer_value}</span>;
        if (answer.answer_code) return <span className="font-medium text-gray-900">{answer.answer_code}</span>;

        return <span className="text-gray-400 italic">-</span>;
    };

    const [isRecalculating, setIsRecalculating] = React.useState(false);

    const handleRecalculate = () => {
        setIsRecalculating(true);
        router.post(route('admin.survey-results.recalculate', response.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsRecalculating(false),
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.patch(route('admin.survey-results.updateStatus', response.id), {
            status: e.target.value
        }, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.survey-results.index')} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Hasil Survei</h2>
                </div>
            }
        >
            <Head title={`Detail Survei ${response.respondent_code}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Meta Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Informasi Responden</h3>
                            {response.status === 'approved' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">
                                    <CheckCircle2 size={14} /> Approved
                                </span>
                            ) : response.status === 'reviewed' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200">
                                    <CheckCircle2 size={14} /> Reviewed
                                </span>
                            ) : response.status === 'submitted' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-200">
                                    <CheckCircle2 size={14} /> Submitted
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-bold border border-gray-200">
                                    <Clock size={14} /> Draft
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 font-semibold">Ubah Status Survei</p>
                                <select
                                    value={response.status}
                                    onChange={handleStatusChange}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500 shadow-sm font-medium"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FileText size={16} /> Kode Responden</p>
                                <p className="font-semibold text-gray-900 text-lg">{response.respondent_code}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><MapPin size={16} /> Lokasi Survei</p>
                                <p className="font-medium text-gray-900">{response.village?.name || '-'}</p>
                                <p className="text-sm text-gray-600">Kec. {response.village?.district?.name || '-'}</p>
                                <p className="text-sm text-gray-600">{response.village?.district?.city?.name || '-'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><User size={16} /> Enumerator</p>
                                <p className="font-medium text-gray-900">{response.enumerator?.name || '-'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Calendar size={16} /> Waktu Pelaksanaan</p>
                                <p className="font-medium text-gray-900">
                                    {response.submitted_at ? dayjs(response.submitted_at).format('DD MMMM YYYY, HH:mm') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hasil IRS Desa Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Hasil Perhitungan Bobot IRS Desa</h3>
                            <button
                                onClick={handleRecalculate}
                                disabled={isRecalculating}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                title="Hitung ulang bobot desa secara manual"
                            >
                                <RefreshCw size={14} className={isRecalculating ? 'animate-spin' : ''} />
                                Hitung Ulang
                            </button>
                        </div>
                        {irsResult ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Skor Total Desa</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-extrabold text-gray-900">{irsResult.irs_total}</span>
                                        <span className="text-sm font-medium text-gray-500 mb-1">/ 100</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Kategori Risiko</p>
                                    <span
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-sm"
                                        style={{ backgroundColor: irsResult.risk_aspect_category?.color || '#9ca3af' }}
                                    >
                                        {irsResult.risk_aspect_category?.category_name || 'Belum Terkategori'}
                                    </span>
                                </div>
                                {irsResult.component_scores && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">Skor per Komponen</p>
                                        <ul className="space-y-2">
                                            {Object.entries(irsResult.component_scores).map(([key, comp]) => (
                                                <li key={key} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 truncate mr-2" title={comp.label}>{comp.label}</span>
                                                    <span className="font-semibold text-gray-900">{comp.score}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Perhitungan bobot belum tersedia untuk desa ini.</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Answers */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Action */}
                    <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Detail Jawaban Kuesioner</h3>
                        <Link
                            href={route('admin.survey-results.edit', response.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                            Edit Jawaban Survei
                        </Link>
                    </div>

                    {sections.map((section, sIdx) => (
                        <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50/50 p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">{section.name}: {section.title}</h3>
                            </div>
                            <div className="p-0">
                                <ul className="divide-y divide-gray-100">
                                    {section.questions.map((question) => (
                                        <li key={question.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                                            <p className="text-sm text-gray-600 mb-2 font-medium"><span className="font-bold text-gray-800">{question.code}</span>. {question.question_text}</p>
                                            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm inline-block min-w-[200px]">
                                                {getAnswer(question.id)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
