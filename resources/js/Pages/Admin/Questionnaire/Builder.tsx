import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Save, Plus, Trash2, ArrowLeft, GripVertical, Settings2, HelpCircle, Layers, ShieldAlert } from 'lucide-react';

// Generates a temporary ID for new items before they hit the server
const generateTempId = () => `new-${Math.random().toString(36).substr(2, 9)}`;

export default function Builder({ version }: { version: any }) {
    const [activeTab, setActiveTab] = useState('components');
    const [isSaving, setIsSaving] = useState(false);

    // Deep clone the initial state so we can edit it freely
    const [data, setData] = useState({
        irsComponents: version.irs_components || [],
        sections: version.sections || [],
    });

    // Helper: Add IRS Component
    const addComponent = () => {
        setData(prev => ({
            ...prev,
            irsComponents: [...prev.irsComponents, { id: generateTempId(), key: '', label: '', is_active: true }]
        }));
    };

    // Helper: Add Section
    const addSection = () => {
        setData(prev => ({
            ...prev,
            sections: [...prev.sections, { 
                id: generateTempId(), code: '', title: '', description: '', 
                is_irs_component: false, irs_component_id: '', questions: [] 
            }]
        }));
    };

    // Helper: Add Question
    const addQuestion = (sectionIdx: number) => {
        const newSections = [...data.sections];
        newSections[sectionIdx].questions.push({
            id: generateTempId(), code: '', question_text: '', question_type: 'single_choice',
            is_required: true, is_observation: false, options: [], skip_logic: null
        });
        setData({ ...data, sections: newSections });
    };

    const addOption = (sectionIdx: number, questionIdx: number) => {
        const newSections = [...data.sections];
        newSections[sectionIdx].questions[questionIdx].options.push({
            id: generateTempId(), option_value: '', option_label: '', 
            is_risk_flag: false
        });
        setData({ ...data, sections: newSections });
    };

    // Helper: Delete Item
    const deleteItem = (type: string, ...indices: number[]) => {
        if (!confirm('Hapus item ini?')) return;
        const [sIdx, qIdx, oIdx] = indices;
        
        if (type === 'component') {
            const newComps = [...data.irsComponents];
            newComps.splice(sIdx, 1);
            setData({ ...data, irsComponents: newComps });
        } else if (type === 'section') {
            const newSections = [...data.sections];
            newSections.splice(sIdx, 1);
            setData({ ...data, sections: newSections });
        } else if (type === 'question') {
            const newSections = [...data.sections];
            newSections[sIdx].questions.splice(qIdx, 1);
            setData({ ...data, sections: newSections });
        } else if (type === 'option') {
            const newSections = [...data.sections];
            newSections[sIdx].questions[qIdx].options.splice(oIdx, 1);
            setData({ ...data, sections: newSections });
        }
    };

    // Helper: Update Item Data
    const updateItem = (val: any, field: string, ...indices: number[]) => {
        const [sIdx, qIdx, oIdx] = indices;
        
        if (qIdx === undefined) {
            // Update Section
            const newSections = [...data.sections];
            newSections[sIdx] = { ...newSections[sIdx], [field]: val };
            setData({ ...data, sections: newSections });
        } else if (oIdx === undefined) {
            // Update Question
            const newSections = [...data.sections];
            newSections[sIdx].questions[qIdx] = { ...newSections[sIdx].questions[qIdx], [field]: val };
            setData({ ...data, sections: newSections });
        } else {
            // Update Option
            const newSections = [...data.sections];
            newSections[sIdx].questions[qIdx].options[oIdx] = { ...newSections[sIdx].questions[qIdx].options[oIdx], [field]: val };
            setData({ ...data, sections: newSections });
        }
    };

    const updateComponent = (idx: number, field: string, val: any) => {
        const newComps = [...data.irsComponents];
        newComps[idx] = { ...newComps[idx], [field]: val };
        setData({ ...data, irsComponents: newComps });
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(route('admin.questionnaires.builder.save', version.id), data, {
            onSuccess: () => setIsSaving(false),
            onError: () => setIsSaving(false),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.get(route('admin.questionnaires.index'))}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Builder Kuesioner</h2>
                            <p className="text-sm text-gray-500">{version.title} ({version.version_code})</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? 'Menyimpan...' : 'Simpan Kuesioner'}
                    </button>
                </div>
            }
        >
            <Head title={`Builder - ${version.version_code}`} />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-6">
                        <button 
                            onClick={() => setActiveTab('components')}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'components' ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <ShieldAlert size={18} />
                            Komponen IRS
                        </button>
                        <button 
                            onClick={() => setActiveTab('editor')}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Layers size={18} />
                            Editor Kuesioner
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    
                    {/* --- TAB: COMPONENTS --- */}
                    {activeTab === 'components' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Komponen Penilaian Risiko (IRS)</h3>
                                    <p className="text-sm text-gray-500">Definisikan pilar-pilar penilaian sanitasi (contoh: Air Minum, Jamban).</p>
                                </div>
                                <button onClick={addComponent} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                    <Plus size={16} /> Tambah Pilar
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.irsComponents.map((comp, idx) => (
                                    <div key={comp.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                        <div className="pt-2 text-gray-400 cursor-move">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Key (Unik)</label>
                                                <input type="text" value={comp.key} onChange={e => updateComponent(idx, 'key', e.target.value)} className="w-full text-sm rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="contoh: air_minum" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Label Tampilan</label>
                                                <input type="text" value={comp.label} onChange={e => updateComponent(idx, 'label', e.target.value)} className="w-full text-sm rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="contoh: Sumber Air Minum" />
                                            </div>
                                        </div>
                                        <button onClick={() => deleteItem('component', idx)} className="pt-2 text-rose-400 hover:text-rose-600">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                                {data.irsComponents.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-sm">Belum ada komponen IRS. Tambahkan komponen baru.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- TAB: EDITOR --- */}
                    {activeTab === 'editor' && (
                        <div className="space-y-6">
                            {data.sections.map((section, sIdx) => (
                                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Section Header */}
                                    <div className="bg-gray-50 border-b border-gray-200 p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 shrink-0">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kode</label>
                                                <input type="text" value={section.code} onChange={e => updateItem(e.target.value, 'code', sIdx)} className="w-full text-sm rounded-lg border-gray-300 focus:border-emerald-500 font-bold" placeholder="A" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Bagian</label>
                                                <input type="text" value={section.title} onChange={e => updateItem(e.target.value, 'title', sIdx)} className="w-full text-sm rounded-lg border-gray-300 focus:border-emerald-500 font-bold" placeholder="Informasi Umum" />
                                            </div>
                                            <div className="w-48 shrink-0">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pilar IRS (Opsional)</label>
                                                <select 
                                                    value={section.irs_component_id || ''} 
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setData(prev => {
                                                            const newSections = [...prev.sections];
                                                            newSections[sIdx] = { ...newSections[sIdx], irs_component_id: val, is_irs_component: !!val };
                                                            return { ...prev, sections: newSections };
                                                        });
                                                    }} 
                                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-emerald-500"
                                                >
                                                    <option value="">-- Bukan Penilaian --</option>
                                                    {data.irsComponents.map(c => (
                                                        <option key={c.id} value={c.id}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button onClick={() => deleteItem('section', sIdx)} className="mt-6 text-rose-400 hover:text-rose-600 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Questions List */}
                                    <div className="p-5 space-y-6">
                                        {section.questions.map((question, qIdx) => (
                                            <div key={question.id} className="border border-gray-200 rounded-xl bg-white flex overflow-hidden shadow-sm relative group">
                                                {/* Drag handle */}
                                                <div className="w-8 bg-gray-50 border-r border-gray-100 flex items-center justify-center text-gray-400 cursor-move">
                                                    <GripVertical size={16} />
                                                </div>
                                                
                                                <div className="flex-1 p-5">
                                                    <div className="flex gap-4 items-start mb-4">
                                                        <div className="w-16 shrink-0">
                                                            <input type="text" value={question.code} onChange={e => updateItem(e.target.value, 'code', sIdx, qIdx)} className="w-full text-sm rounded border-gray-300 px-2 py-1.5 focus:border-emerald-500" placeholder="A.1" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <textarea value={question.question_text} onChange={e => updateItem(e.target.value, 'question_text', sIdx, qIdx)} rows={2} className="w-full text-sm rounded border-gray-300 focus:border-emerald-500" placeholder="Tulis pertanyaan..." />
                                                        </div>
                                                        <div className="w-40 shrink-0">
                                                            <select value={question.question_type} onChange={e => updateItem(e.target.value, 'question_type', sIdx, qIdx)} className="w-full text-sm rounded border-gray-300 focus:border-emerald-500 bg-gray-50">
                                                                <option value="single_choice">Pilihan Ganda (1)</option>
                                                                <option value="multi_choice">Pilihan Ganda (&gt;1)</option>
                                                                <option value="text">Teks Bebas</option>
                                                                <option value="number">Angka</option>
                                                                <option value="date">Tanggal</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={() => deleteItem('question', sIdx, qIdx)} className="text-gray-400 hover:text-rose-600 mt-1">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>

                                                    {/* Additional Settings */}
                                                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={question.is_required} onChange={e => updateItem(e.target.checked, 'is_required', sIdx, qIdx)} className="rounded border-gray-300 text-emerald-700 focus:ring-emerald-500" />
                                                            Wajib Diisi
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={question.is_observation} onChange={e => updateItem(e.target.checked, 'is_observation', sIdx, qIdx)} className="rounded border-gray-300 text-emerald-700 focus:ring-emerald-500" />
                                                            <span className="flex items-center gap-1">Pengamatan Lapangan <HelpCircle size={14} className="text-gray-400" title="Ditanyakan bukan ke responden, tapi diamati oleh enumerator" /></span>
                                                        </label>
                                                    </div>

                                                    {/* Options for Choice Types */}
                                                    {['single_choice', 'multi_choice'].includes(question.question_type) && (
                                                        <div className="pl-6 border-l-2 border-emerald-100 space-y-3 mt-4">
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pilihan Jawaban & Risiko</h4>
                                                            {question.options.map((opt: any, oIdx: number) => (
                                                                <div key={opt.id} className="flex gap-3 items-start bg-white">
                                                                    <input type="text" value={opt.option_value} onChange={e => updateItem(e.target.value, 'option_value', sIdx, qIdx, oIdx)} className="w-16 text-sm rounded border-gray-300 py-1.5 focus:border-emerald-500" placeholder="Kode" />
                                                                    <input type="text" value={opt.option_label} onChange={e => updateItem(e.target.value, 'option_label', sIdx, qIdx, oIdx)} className="flex-1 text-sm rounded border-gray-300 py-1.5 focus:border-emerald-500" placeholder="Label jawaban..." />
                                                                    
                                                                    {/* Risk Setting */}
                                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${opt.is_risk_flag ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-200'}`}>
                                                                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                                                                            <input type="checkbox" checked={opt.is_risk_flag} onChange={e => updateItem(e.target.checked, 'is_risk_flag', sIdx, qIdx, oIdx)} className="rounded text-rose-500 focus:ring-rose-500 border-gray-300" />
                                                                            <span className={opt.is_risk_flag ? 'text-rose-700' : 'text-gray-500'}>Beresiko</span>
                                                                        </label>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded">
                                                                        <span className="text-xs text-gray-500 font-medium">Loncat ke:</span>
                                                                        <input 
                                                                            type="text" 
                                                                            value={question.skip_logic?.[opt.option_value] || ''} 
                                                                            onChange={e => {
                                                                                const val = e.target.value;
                                                                                const newLogic = { ...(question.skip_logic || {}) };
                                                                                if (val) {
                                                                                    newLogic[opt.option_value] = val;
                                                                                } else {
                                                                                    delete newLogic[opt.option_value];
                                                                                }
                                                                                updateItem(Object.keys(newLogic).length > 0 ? newLogic : null, 'skip_logic', sIdx, qIdx);
                                                                            }} 
                                                                            className="w-16 text-xs rounded border-gray-300 py-0.5 px-2 focus:border-emerald-500" 
                                                                            placeholder="Kode Q" 
                                                                        />
                                                                    </div>

                                                                    <button onClick={() => deleteItem('option', sIdx, qIdx, oIdx)} className="mt-1.5 text-gray-400 hover:text-rose-600">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button onClick={() => addOption(sIdx, qIdx)} className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-2 hover:text-emerald-800">
                                                                <Plus size={14} /> Tambah Opsi
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <button onClick={() => addQuestion(sIdx)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm">
                                            <Plus size={16} /> Tambah Pertanyaan di Bagian {section.code || 'Ini'}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button onClick={addSection} className="w-full py-4 bg-gray-50 border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-400 transition-colors flex items-center justify-center gap-2">
                                <Plus size={20} /> Tambah Bagian Baru (Section)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
