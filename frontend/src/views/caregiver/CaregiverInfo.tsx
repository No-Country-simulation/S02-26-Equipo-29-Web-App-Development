import { useState } from 'react';
import { Documents, Info } from '../../components';
import { Shifts } from '../../components/shifts/Shifts';

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

    // const [shifts, ] = useState<Shift[]>([]);

  


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
                        <Shifts />
                    )}
                </section>
            </div>
        </div>
    );
};

export default CaregiverInfo;