import {  useState } from "react";
import { useUser } from "../../hooks";
import { EditProfileForm } from "../UI/EditProfileForm";
import { useCaregiver } from "../../hooks/caregiver/useCaregiver";

export  function Info() {

    const { data:user } = useUser();
   const [activeTab, setActiveTab] = useState(false);

    const { data, isLoading, error } = useCaregiver();
    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error: {error.message}</div>
  return (
     <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                                        Información Personal
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        { label: 'Nombre', value: user?.full_name },
                                        { label: 'Email', value: user?.email },
                                        { label: 'Teléfono', value: data?.phone },
                                        { label: 'CBU', value: data?.cbu || 'No registrado' },
                                        { label: 'Alias Mercado Pago', value: data?.mercado_pago_alias || 'No registrado' },
                                        { label: 'Tarifa por hora', value: data?.hourly_rate ? `$${data?.hourly_rate}/hora` : 'No registrada' },
                                        // { label: 'Turno', value: caregiver.shiftRange },
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
                                  { activeTab && (
                                                    <div>
                                                        <EditProfileForm user={user} />
                                                    </div>
                                                )} 
                            </div>
                             
  )
}
