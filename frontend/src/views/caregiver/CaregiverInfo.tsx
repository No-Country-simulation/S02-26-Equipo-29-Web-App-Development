import { useState } from 'react';
import { Documents, Info } from '../../components';
import { Shifts } from '../../components/shifts/Shifts';
import { Header } from "../../components/UI/Headers";
import { useUser } from '../../hooks';
import { useCaregiverShifts } from '../../hooks/caregiver/useCaregiver';
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
    const { data: user, isLoading: isUserLoading } = useUser();
    const { data: shifts, isLoading: isShiftsLoading } = useCaregiverShifts();
    const isLoading = isUserLoading || isShiftsLoading;

    const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'shifts'>('info');

    if (isLoading) {
        return (
            <>
                <Header user={user} shifts={shifts} />

                <div className="h-auto w-full rounded-3xl border border-border bg-surface px-4 py-8 shadow-lg animate-pulse">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-10 w-32 rounded-2xl bg-border" />
                            ))}
                        </div>

                        <section className="rounded-3xl border border-border bg-background p-6 shadow-lg">
                            <div className="h-7 w-56 rounded-xl bg-border mb-2" />
                            <div className="h-4 w-40 rounded-xl bg-border mb-6" />

                            <div className="grid gap-4 sm:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-3 w-24 rounded-xl bg-border" />
                                        <div className="h-10 w-full rounded-2xl bg-border" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
        
        <Header user={user} shifts={shifts} />

        <div className="h-auto w-full rounded-3xl border border-slate-200 bg-surface px-4 py-8 text-slate-900 shadow-lg">

            <div className="space-y-8">
                

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
        </>
    );
};

export default CaregiverInfo;