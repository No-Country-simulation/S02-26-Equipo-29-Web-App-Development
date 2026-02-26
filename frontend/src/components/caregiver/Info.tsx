import {  useState } from "react";
import { useCaregiver, useUser } from "../../hooks";
import { EditProfileForm } from "../UI/EditProfileForm";
import { usePatient } from "../../hooks/patient/usePatient";

export  function Info() {
    const { data: user } = useUser();
    const [activeTab, setActiveTab] = useState(false);
    
    // ✅ Llamar hooks siempre al nivel superior
    const { data: patientData, isLoading: patientLoading, error: patientError, refetch: refetchPatient } = usePatient();
    const { data: caregiverData, isLoading: caregiverLoading, error: caregiverError, refetch: refetchCaregiver } = useCaregiver();
    
    // Determinar qué datos mostrar según el rol
    // const roleData = user?.role === "CAREGIVER" ? caregiverData : patientData;
    const isLoading = user?.role === "CAREGIVER" ? caregiverLoading : patientLoading;
    const error = user?.role === "CAREGIVER" ? caregiverError : patientError;
    const refetch = user?.role === "CAREGIVER" ? refetchCaregiver : refetchPatient;
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleUpdateSuccess = () => {
        refetch();
        setActiveTab(false);
    };


  return (
     <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                                        Información Personal
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    { user?.role === "CAREGIVER" &&
                                    
                                    [
                                        { label: 'Nombre', value: user?.full_name || 'No registrado' },
                                        { label: 'Email', value: user?.email || 'No registrado' },
                                        { label: 'Teléfono', value: caregiverData?.phone || 'No registrado' },
                                        { label: 'CBU', value: caregiverData?.cbu || 'No registrado' },
                                        { label: 'Alias Mercado Pago', value: caregiverData?.mercado_pago_alias || 'No registrado' },
                                        { label: 'Tarifa por hora', value: caregiverData?.hourly_rate ? `$${caregiverData?.hourly_rate}/hora` : 'No registrada' },
                                        // { label: 'Turno', value: caregiverData?.shiftRange },
                                    ].map((item) => (
                                        <article key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                                            <p className="text-base font-medium text-slate-900">{item.value}</p>
                                        </article>
                                    ))}

                                    { user?.role === "PATIENT" &&
                                    
                                    [
                                        { label: 'Nombre', value: user?.full_name || 'No registrado' },
                                        { label: 'DNI', value: patientData?.dni || 'No registrado' },
                                        { label: 'Dirección', value: patientData?.address || 'No registrada' },
                                        { label: 'Notas', value: patientData?.notes || 'No registradas' },
                                        
                                    ].map((item) => (
                                        <article key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                                            <p className="text-base font-medium text-slate-900">{item.value}</p>
                                        </article>
                                    ))}
                                </div>
                                <button onClick={() => setActiveTab(!activeTab)} className="w-full rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-hover sm:w-auto">
                                    Editar Perfil
                                </button>
                                                                    {activeTab && (
                                                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                                                            <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl">
                                                                                <button
                                                                                    onClick={() => setActiveTab(false)}
                                                                                    className="absolute right-4 top-4 rounded-full border border-border px-3 py-1 text-sm text-text-secondary transition hover:text-text-primary"
                                                                                >
                                                                                    Cerrar
                                                                                </button>
                                                                                <EditProfileForm user={user} handleUpdateSuccess={handleUpdateSuccess} />
                                                                            </div>
                                                                        </div>
                                                                    )}
                            </div>
                             
  )
}
