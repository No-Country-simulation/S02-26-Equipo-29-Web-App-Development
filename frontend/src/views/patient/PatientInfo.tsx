
import { useState } from 'react';
import { Documents, Info } from '../../components';
import { Shifts } from '../../components/shifts/Shifts';
import { Header } from '../../components/UI/Headers';
import { useShifts } from "../../hooks/patient/useShifts";
  
  export interface Document {
      id: string;
      name: string;
      uploadDate: string;
      type: string;
  }
  
export const PatientInfo: React.FC = () => {

      const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'shifts'>('info');
  
      const { isLoading } = useShifts();

      if (isLoading) {
          return (
              <>
                  <Header 
                    title="Mi Perfil" 
                    description="Información personal y documentos médicos" 
                  />

                  <div className="h-auto bg-background px-4 py-8 border border-border rounded-3xl shadow-lg animate-pulse">
                      <div className="mx-auto max-w-5xl space-y-8">
                          <div className="flex flex-wrap gap-3">
                              {Array.from({ length: 3 }).map((_, i) => (
                                  <div key={i} className="h-10 w-32 rounded-2xl bg-border" />
                              ))}
                          </div>

                          <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
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
          <Header 
            title="Mi Perfil" 
            description="Información personal y documentos médicos" 
          />

          <div className="h-auto bg-background px-4 py-8 text-slate-900 border border-slate-200 rounded-3xl shadow-lg">
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
          </>
      );
  }; 
