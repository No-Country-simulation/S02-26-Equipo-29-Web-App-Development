import { useState } from 'react';
import { Documents, Info } from '../../components';

export interface Document {
    id: string;
    name: string;
    uploadDate: string;
    type: string;
}

export interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
}

export const CaregiverInfo: React.FC = () => {

    const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'shifts'>('info');

    const [shifts, ] = useState<Shift[]>([]);

  


    return (
        <div className="h-auto bg-surface px-4 py-8 text-slate-900 border border-slate-200 rounded-3xl shadow-lg">
            <div className="mx-auto max-w-5xl space-y-8">
                

                <div className="flex flex-wrap gap-3">
                    {[
                        { id: 'info', label: 'Mi Información' },
                        { id: 'documents', label: 'Mis Documentos' },
                        { id: 'shifts', label: 'Mis Turnos' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition ${
                                activeTab === tab.id
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    {activeTab === 'info' && (
                       <Info />
                    )}

                 

                    {activeTab === 'documents' && (
                     <Documents  />
                    )}

                    {activeTab === 'shifts' && (
                        <div className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Mis Turnos</p>
                            {shifts.length > 0 ? (
                                <div className="space-y-4">
                                    {shifts.map((shift) => (
                                        <article
                                            key={shift.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
                                        >
                                            <p className="text-sm font-semibold text-slate-900">{shift.date}</p>
                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                
                                                <p>
                                                    <span className="font-semibold">Horario:</span> {shift.startTime} - {shift.endTime}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Ubicación:</span> {shift.location}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Estado:</span>{' '}
                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                                                        {shift.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p>Aca van los Shifts ya realizados</p>
                                    <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                                        No hay turnos asignados
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CaregiverInfo;