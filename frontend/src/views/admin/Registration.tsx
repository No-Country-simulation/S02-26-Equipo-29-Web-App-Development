import { useEffect, useState, useMemo } from "react";
import { User, UserCogIcon, FileCheck, FileX, Info, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import type { Caregiver, Patient } from "../../types";
import { useRegistrations, useUpdateProfile } from "../../hooks";
import { toast } from "sonner";
import { getStatusColor, translateStatus } from "../../utils/status";
import { takeFirstLetters } from "../../utils/firstLetters";



export function Registration() {
  const [selectedUserType, setSelectedUserType] = useState<"caregiver" | "patient">("caregiver");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const { data: registration, isLoading} = useRegistrations();

  const selectedItem = useMemo(() => {
    const list = selectedUserType === "caregiver" ? registration?.caregivers : registration?.patients;
    return list?.find((item) => item.profile_id === selectedProfileId) || null;
  }, [registration, selectedUserType, selectedProfileId]);

  useEffect(() => {
    if (!selectedProfileId && registration) {
      const currentListSelected = selectedUserType === "caregiver" ? registration.caregivers : registration.patients;
      if (currentListSelected && currentListSelected.length > 0) {
        const firstId = currentListSelected[0].profile_id || null;
        if (firstId) {
          queueMicrotask(() => {
            setSelectedProfileId(firstId);
          });
        }
      }
    }
  }, [registration, selectedUserType, selectedProfileId]);

  const handleSwitchUserType = (type: "caregiver" | "patient") => {
    setSelectedUserType(type);
    setSelectedProfileId(null); // Reset to trigger auto-selection for new type
  }


  const updateProfileMutation = useUpdateProfile();

  const handleChangeStatus = async (status: string, profile_id: string | undefined) => {
    if (!profile_id) return;
    try {
      await updateProfileMutation.mutateAsync({
        id: profile_id,
        role: selectedUserType === "caregiver" ? "CAREGIVER" : "PATIENT",
        data: { status }
      });
      toast.success("Estado actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el estado");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background p-5">
   
        <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">

        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
         Administrar Usuarios
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Verifica los usuarios registrados en el sistema
        </p>
      </header>

      <section className="mt-5 rounded-3xl border border-border bg-surface p-6 shadow-lg">
       
       {/* Sección de usuarios Cuidadores y Pacientes */}
        <div className="flex gap-8 border-b border-border">
          <div
            className={`flex items-center gap-2 cursor-pointer pb-2 border-b-2 -mb-px transition-colors ${
              selectedUserType === "caregiver"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-primary/70"
            }`}
            onClick={() => handleSwitchUserType("caregiver")}
          >
            <UserCogIcon className="h-6 w-6" />
            <p>Cuidadores</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">
              {registration?.caregivers?.length ?? 0}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 cursor-pointer pb-2 border-b-2 -mb-px transition-colors ${
              selectedUserType === "patient"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-primary/70"
            }`}
            onClick={() => handleSwitchUserType("patient")}
          >
            <User className="h-6 w-6" />
            <p>Pacientes</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">
              {registration?.patients?.length ?? 0}
            </p>
          </div>
        </div>

        <div>
          {/* Seccion de  tabla y documentos */}
          <div className="rounded-2xl p-2 justify-between mt-5 grid grid-cols-3 gap-5">
            {/* Tabla */}

            {selectedUserType === "caregiver" ? (
              <>
                <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1 col-span-3 md:col-span-3 lg:col-span-2 overflow-x-scroll ">
                  <table className="min-w-full divide-y divide-border text-sm ">
                    <thead className="bg-background text-left text-text-secondary whitespace-nowrap">
                      <tr>
                        <th className="px-4 py-3 font-medium">Aplicante</th>
                        <th className="px-4 py-3 font-medium">
                          Fecha de Registro
                        </th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
                      {registration?.caregivers?.map((caregiver: Caregiver) => (
                        <tr
                          onClick={() => setSelectedProfileId(caregiver.profile_id || null)}
                          key={caregiver.profile_id}
                          className={`hover:bg-background hover:cursor-pointer ${
                            selectedProfileId === caregiver.profile_id
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                              {takeFirstLetters(caregiver.full_name)}
                            </div>
                            <div className="flex flex-col">
                              <p className="font-medium">
                                {caregiver.full_name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {caregiver?.profile_id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {formatDate(caregiver.created_at ?? "")}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                caregiver.status ?? "",
                              )}`}
                            >
                              {translateStatus(caregiver.status ?? "")}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                              Revisar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1 col-span-3 md:col-span-3 lg:col-span-2 overflow-x-scroll ">
                  <table className="min-w-full divide-y divide-border text-sm ">
                    <thead className="bg-background text-left text-text-secondary whitespace-nowrap">
                      <tr>
                        <th className="px-4 py-3 font-medium">Aplicante</th>
                        <th className="px-4 py-3 font-medium">
                          Fecha de Registro
                        </th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
                      {registration?.patients.map((patient: Patient) => (
                        <tr
                          onClick={() => setSelectedProfileId(patient.profile_id || null)}
                          key={patient.profile_id}
                          className={`hover:bg-background hover:cursor-pointer ${
                            selectedProfileId === patient.profile_id
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                              {takeFirstLetters(patient.full_name)}
                            </div>
                            <div className="flex flex-col">
                              <p className="font-medium">{patient.full_name}</p>
                              <p className="text-xs text-text-secondary">
                                {patient.profile_id}
                              </p>
                            </div>
                          </td>
                        
                          <td className="px-4 py-4">{formatDate(patient.created_at as string)}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                patient.status as string,
                              )}`}
                            >
                              {translateStatus(patient.status as string)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                              Revisar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Panel de Detalles y Documentos */}
            <div className="h-[80vh] col-span-3 lg:col-span-1 border border-border rounded-3xl p-6 sticky top-0 bg-surface/50 backdrop-blur-md shadow-inner overflow-y-auto">
              {selectedItem ? (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-focus flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-primary/10">
                      {takeFirstLetters(selectedItem?.full_name || "")}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedItem?.full_name}</p>
                      <p className="text-text-secondary text-xs font-mono opacity-60">ID: {selectedItem?.profile_id}</p>
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <div>
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <FileCheck className="h-5 w-5" />
                      <h3 className="font-semibold text-sm uppercase tracking-wider">Documentación</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Documento Frontal */}
                      <div className="group relative">
                        <p className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                          <Info className="h-3 w-3" /> DNI - Parte Frontal
                        </p>
                        <div className="aspect-video w-full overflow-hidden rounded-2xl border-2 border-border/50 bg-background/50 hover:border-primary/50 transition-all cursor-zoom-in">
                          {selectedItem?.front_dni ? (
                            <img
                              key={`front-${selectedItem.profile_id}-${selectedItem.front_dni}`}
                              src={selectedItem?.front_dni}
                              alt="DNI Frontal"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary/30 p-4 text-center">
                              <FileX className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">No cargado</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documento Trasero */}
                      <div className="group relative">
                        <p className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                          <Info className="h-3 w-3" /> DNI - Parte Trasera
                        </p>
                        <div className="aspect-video w-full overflow-hidden rounded-2xl border-2 border-border/50 bg-background/50 hover:border-primary/50 transition-all cursor-zoom-in">
                          {selectedItem?.back_dni ? (
                            <img
                              key={`back-${selectedItem.profile_id}-${selectedItem.back_dni}`}
                              src={selectedItem?.back_dni}
                              alt="DNI Trasero"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary/30 p-4 text-center">
                              <FileX className="h-8 w-8 mb-2 opacity-20" />
                              <p className="text-xs">No cargado</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-5 w-5" />
                      <h3 className="font-semibold text-sm uppercase tracking-wider">Estado de Validación</h3>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-background/40 border border-border/50">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="status" className="text-xs text-text-secondary font-medium uppercase px-1">
                            Cambiar Estado
                          </label>
                          <div className="relative group">
                            <select 
                              onChange={(e) => handleChangeStatus(e.target.value, selectedItem?.profile_id)} 
                              defaultValue={selectedItem?.status} 
                              className="w-full appearance-none cursor-pointer border-2 border-border/50 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            >
                              <option value="pending">Pendiente de Revisión</option>
                              <option value="under_review">En Evaluación</option>
                              <option value="approved">Aprobado / Verificado</option>
                              <option value="rejected">Rechazado</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary group-hover:text-primary transition-colors">
                              <Eye className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                          {selectedItem?.status === 'approved' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {selectedItem?.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                          {selectedItem?.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                          {selectedItem?.status === 'under_review' && <AlertCircle className="h-5 w-5 text-blue-500" />}
                          <p className="text-xs font-medium">
                            {selectedItem?.status === 'approved' && "El usuario está listo para operar."}
                            {selectedItem?.status === 'rejected' && "El usuario ha sido rechazado."}
                            {selectedItem?.status === 'pending' && "Esperando revisión inicial."}
                            {selectedItem?.status === 'under_review' && "Se están validando los datos."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs text-text-secondary/60 text-center italic">
                      Última actualización: {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-text-secondary">
                  Selecciona un usuario para ver detalles
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
