import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronRight, ChevronLeft, Send, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Conduct({ version, auth, assignedVillages = [] }: any) {
    // Initialize state from localStorage if available
    const [answers, setAnswers] = useState<Record<string, any>>(() => {
        const saved = localStorage.getItem('ehra_survey_answers');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved answers", e);
            }
        }
        return {};
    });

    const [currentSectionIdx, setCurrentSectionIdx] = useState(() => {
        const saved = localStorage.getItem('ehra_survey_section');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Auto-select if only 1 village, or load from localStorage
    const [selectedVillageId, setSelectedVillageId] = useState<string>(() => {
        const saved = localStorage.getItem('ehra_survey_village');
        if (saved) return saved;
        return assignedVillages.length === 1 ? assignedVillages[0].id : '';
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('ehra_survey_answers', JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        localStorage.setItem('ehra_survey_section', currentSectionIdx.toString());
    }, [currentSectionIdx]);

    useEffect(() => {
        localStorage.setItem('ehra_survey_village', selectedVillageId);
    }, [selectedVillageId]);

    const sections = version.sections || [];
    const currentSection = sections[currentSectionIdx];

    // Flatten all questions to process skip logic easily
    const allQuestions = useMemo(() => {
        let qlist: any[] = [];
        sections.forEach((s: any) => {
            qlist = [...qlist, ...(s.questions || [])];
        });
        return qlist;
    }, [sections]);

    // Auto-fill Identity questions based on selected village
    useEffect(() => {
        if (!selectedVillageId || allQuestions.length === 0) return;
        
        const village = assignedVillages.find((v: any) => v.id === selectedVillageId);
        if (!village) return;

        setAnswers(prev => {
            const newAnswers = { ...prev };
            let hasChanges = false;
            
            allQuestions.forEach((q: any) => {
                if (q.code === 'ID.1' && village.district?.city?.province?.kemendagri_code) {
                    if (newAnswers[q.id] !== village.district.city.province.kemendagri_code) {
                        newAnswers[q.id] = village.district.city.province.kemendagri_code;
                        hasChanges = true;
                    }
                }
                if (q.code === 'ID.2' && village.district?.city?.kemendagri_code) {
                    if (newAnswers[q.id] !== village.district.city.kemendagri_code) {
                        newAnswers[q.id] = village.district.city.kemendagri_code;
                        hasChanges = true;
                    }
                }
                if (q.code === 'ID.3' && village.district?.kemendagri_code) {
                    if (newAnswers[q.id] !== village.district.kemendagri_code) {
                        newAnswers[q.id] = village.district.kemendagri_code;
                        hasChanges = true;
                    }
                }
                if (q.code === 'ID.4' && village.kemendagri_code) {
                    if (newAnswers[q.id] !== village.kemendagri_code) {
                        newAnswers[q.id] = village.kemendagri_code;
                        hasChanges = true;
                    }
                }
            });

            return hasChanges ? newAnswers : prev;
        });
    }, [selectedVillageId, assignedVillages, allQuestions]);

    // Calculate which questions are visible based on skip logic
    const visibleQuestionIds = useMemo(() => {
        const visibleIds = new Set<string>();
        let skipTargetCode: string | null = null;

        for (const q of allQuestions) {
            // If we are currently skipping, check if this question is the target
            if (skipTargetCode) {
                if (q.code === skipTargetCode) {
                    skipTargetCode = null; // Resume showing questions
                } else {
                    continue; // Skip this question
                }
            }

            visibleIds.add(q.id);

            // Check if this question triggers a skip
            const answer = answers[q.id];
            if (answer && q.skip_logic && typeof q.skip_logic === 'object') {
                // If it's single choice, answer is a string
                // If it's multi choice, answer is an array
                if (Array.isArray(answer)) {
                    for (const a of answer) {
                        if (q.skip_logic[a]) {
                            skipTargetCode = q.skip_logic[a];
                            break;
                        }
                    }
                } else {
                    if (q.skip_logic[answer]) {
                        skipTargetCode = q.skip_logic[answer];
                    }
                }
            }
        }
        return visibleIds;
    }, [allQuestions, answers]);

    // Handle answer change
    const handleChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // Multi-choice toggle
    const toggleMultiChoice = (questionId: string, value: string) => {
        setAnswers(prev => {
            const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
            if (current.includes(value)) {
                return { ...prev, [questionId]: current.filter((v: string) => v !== value) };
            } else {
                return { ...prev, [questionId]: [...current, value] };
            }
        });
    };

    const handleNext = () => {
        if (currentSectionIdx < sections.length - 1) {
            setCurrentSectionIdx(currentSectionIdx + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentSectionIdx > 0) {
            setCurrentSectionIdx(currentSectionIdx - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = () => {
        if (!selectedVillageId) {
            alert('Harap pilih Lokasi Survei (Desa/Kelurahan) terlebih dahulu di bagian paling atas.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!confirm('Kirim survei ini? Data tidak dapat diubah setelah dikirim.')) return;
        
        setIsSubmitting(true);
        
        // Filter answers to only include visible questions
        const filteredAnswers: Record<string, any> = {};
        for (const id of visibleQuestionIds) {
            if (answers[id] !== undefined && answers[id] !== '') {
                filteredAnswers[id] = answers[id];
            }
        }

        router.post(route('survey.store', version.id), { 
            village_id: selectedVillageId,
            answers: filteredAnswers 
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
                // Clear localStorage on success
                localStorage.removeItem('ehra_survey_answers');
                localStorage.removeItem('ehra_survey_section');
                localStorage.removeItem('ehra_survey_village');
            },
            onError: () => setIsSubmitting(false),
        });
    };

    // Calculate Progress
    const progressPercentage = ((currentSectionIdx + 1) / sections.length) * 100;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Pelaksanaan Survei</h2>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">
                        {version.version_code}
                    </span>
                </div>
            }
        >
            <Head title="Pelaksanaan Survei" />

            <div className="max-w-4xl mx-auto pb-12">
                {/* Progress Bar */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
                        <span>Bagian {currentSectionIdx + 1} dari {sections.length}</span>
                        <span className="text-emerald-700">{Math.round(progressPercentage)}% Selesai</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Village Selection Box */}
                {assignedVillages.length === 0 ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 mb-6">
                        <AlertCircle className="mx-auto mb-2" size={32} />
                        <h3 className="font-bold text-lg">Tidak Ada Tugas Desa</h3>
                        <p className="mt-1">Anda belum ditugaskan untuk melakukan survei di desa manapun. Silakan hubungi admin.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <MapPin size={18} className="text-emerald-700" />
                            Lokasi Survei (Desa / Kelurahan) <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={selectedVillageId}
                            onChange={(e) => setSelectedVillageId(e.target.value)}
                            disabled={assignedVillages.length === 1}
                            className="w-full rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm disabled:bg-gray-50 disabled:text-gray-500 font-medium"
                        >
                            <option value="">-- Pilih Lokasi Desa/Kelurahan --</option>
                            {assignedVillages.map((village: any) => (
                                <option key={village.id} value={village.id}>
                                    {village.full_name || village.name}
                                </option>
                            ))}
                        </select>
                        {assignedVillages.length === 1 && (
                            <p className="text-xs text-gray-500 mt-2">Anda hanya ditugaskan di 1 desa, lokasi ini telah dipilih otomatis.</p>
                        )}
                    </div>
                )}

                {/* Section Content */}
                {currentSection && assignedVillages.length > 0 && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                                <AlertCircle size={200} />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-2 relative z-10">{currentSection.code}. {currentSection.title}</h2>
                            {currentSection.description && (
                                <p className="text-emerald-100 text-lg relative z-10">{currentSection.description}</p>
                            )}
                        </div>

                        {currentSection.questions?.map((q: any) => {
                            if (!visibleQuestionIds.has(q.id)) return null;

                            return (
                                <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all hover:shadow-md">
                                    <div className="flex gap-4">
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-bold text-lg border border-emerald-100">
                                                {q.code}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {q.question_text}
                                                {q.is_required && <span className="text-rose-500 ml-1">*</span>}
                                            </h3>
                                            
                                            {q.is_observation && (
                                                <span className="inline-block mt-1 mb-4 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                                                    Lihat Lapangan (Pengamatan)
                                                </span>
                                            )}

                                            <div className="mt-4">
                                                {/* Single Choice */}
                                                {q.question_type === 'single_choice' && (
                                                    <div className="space-y-2">
                                                        {q.options?.map((opt: any) => (
                                                            <label 
                                                                key={opt.id} 
                                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === opt.option_value ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'}`}
                                                            >
                                                                <input 
                                                                    type="radio" 
                                                                    name={q.id} 
                                                                    value={opt.option_value}
                                                                    checked={answers[q.id] === opt.option_value}
                                                                    onChange={() => handleChange(q.id, opt.option_value)}
                                                                    className="w-5 h-5 text-emerald-700 border-gray-300 focus:ring-emerald-500"
                                                                />
                                                                <span className="flex-1 text-gray-700 font-medium">{opt.option_label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Multi Choice */}
                                                {q.question_type === 'multi_choice' && (
                                                    <div className="space-y-2">
                                                        {q.options?.map((opt: any) => {
                                                            const isChecked = (answers[q.id] || []).includes(opt.option_value);
                                                            return (
                                                                <label 
                                                                    key={opt.id} 
                                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}`}
                                                                >
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={isChecked}
                                                                        onChange={() => toggleMultiChoice(q.id, opt.option_value)}
                                                                        className="w-5 h-5 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                                    />
                                                                    <span className="flex-1 text-gray-700 font-medium">{opt.option_label}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Text Input */}
                                                {q.question_type === 'text' && (
                                                    <input 
                                                        type="text" 
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                                        className={`w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 p-4 shadow-sm ${['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code) ? 'bg-gray-50 text-gray-600 font-bold' : ''}`}
                                                        placeholder={['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code) ? "Terisi otomatis" : "Ketik jawaban di sini..."}
                                                        readOnly={['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code)}
                                                    />
                                                )}

                                                {/* Number Input */}
                                                {q.question_type === 'number' && (
                                                    <input 
                                                        type="number" 
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                                        className={`w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 p-4 shadow-sm text-lg ${['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code) ? 'bg-gray-50 text-gray-600 font-bold' : ''}`}
                                                        placeholder={['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code) ? "" : "0"}
                                                        readOnly={['ID.1', 'ID.2', 'ID.3', 'ID.4'].includes(q.code)}
                                                    />
                                                )}
                                                
                                                {/* Date Input */}
                                                {q.question_type === 'date' && (
                                                    <input 
                                                        type="date" 
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                                        className="w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 p-4 shadow-sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between">
                    <button 
                        onClick={handlePrev}
                        disabled={currentSectionIdx === 0}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} /> Sebelumnya
                    </button>

                    {currentSectionIdx < sections.length - 1 ? (
                        <button 
                            onClick={handleNext}
                            className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Selanjutnya <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? 'Memproses...' : (
                                <>
                                    <Send size={20} /> Kirim Survei Final
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
