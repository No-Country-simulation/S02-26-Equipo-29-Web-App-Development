import { useEffect, useState } from "react";
import { User, UserCogIcon } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import type { Caregiver, Patient } from "../../types";
import { useRegistrations } from "../../hooks";
import { api } from "../../lib/axios/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getStatusColor, translateStatus } from "../../utils/status";
import { takeFirstLetters } from "../../utils/firstLetters";



export function Registration() {
  const queryClient = useQueryClient();
  const [selectedUserType, setSelectedUserType] = useState<
    "caregiver" | "patient"
  >("caregiver");
  const [selectedItem, setSelectedItem] = useState<Caregiver | Patient | null>(
    null,
  );
  const { data: registration, isLoading} = useRegistrations();

  useEffect(() => {
    if (selectedUserType === "caregiver" && registration?.caregivers) {
      setSelectedItem(registration.caregivers[0] || null);
    } else if (selectedUserType === "patient" && registration?.patients) {
      setSelectedItem(registration.patients[0] || null);
    }
  }, [registration, selectedUserType]);


  const handleChangeStatus = async (status: string, profile_id: string | undefined) => {
    try {
      if (selectedUserType === "caregiver") {
        await api.put(`/caregivers/${profile_id}`, { status });
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Estado cambiado correctamente");
      }
    } catch {
      toast.error("Error al cambiar el estado");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(selectedItem)
  return (
    <div className="bg-background p-5">
      <header className="p-5 rounded-3xl border border-border bg-surface  shadow-lg">
        <h1 className="text-2xl font-bold ">Administrar Usuarios</h1>
        <p className="text-gray-400">
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
            onClick={() => setSelectedUserType("caregiver")}
          >
            <UserCogIcon className="h-6 w-6" />
            <p>Cuidadores</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">
              {registration?.caregivers?.length}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 cursor-pointer pb-2 border-b-2 -mb-px transition-colors ${
              selectedUserType === "patient"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-primary/70"
            }`}
            onClick={() => setSelectedUserType("patient")}
          >
            <User className="h-6 w-6" />
            <p>Pacientes</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">
              {registration?.patients?.length}
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
                          onClick={() => setSelectedItem(caregiver)}
                          key={caregiver.profile_id}
                          className={`hover:bg-background hover:cursor-pointer ${
                            (selectedItem as Caregiver)?.profile_id ===
                            caregiver.profile_id
                              ? "bg-primary/5"
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
                      {registration?.patients.map((patient) => (
                        <tr
                          onClick={() => setSelectedItem(patient)}
                          key={patient.id}
                          className={`hover:bg-background hover:cursor-pointer ${
                            selectedItem?.id === patient.id
                              ? "bg-primary/5"
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
                                {patient.id}
                              </p>
                            </div>
                          </td>
                        
                          <td className="px-4 py-4">{formatDate(patient.created_at)}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                patient.status,
                              )}`}
                            >
                              {translateStatus(patient.status)}
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

            {/* Documentos */}
            <div className="h-[80vh] col-span-3 lg:col-span-1 border border-border rounded-2xl p-2 sticky top-0 overflow-y-scroll">
              {selectedItem ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    {takeFirstLetters(selectedItem?.full_name)}
                  </div>
                  <p className="font-bold">{selectedItem.full_name}</p>
                  {/* <p className="text-text-secondary/50 text-xs">id: {selectedItem?}</p> */}

                  <p className="mt-5  text-text-secondary">
                    Verificación de documentos
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-text-secondary">
                      Parte delantera
                    </p>
                    <div className="w-[200px] h-[100px] overflow-hidden rounded">
                      {selectedItem?.front_dni ? (
                        <img
                          src={selectedItem?.front_dni}
                          alt={selectedItem.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                          No document uploaded
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-text-secondary">Parte trasera</p>
                    <div className="w-[200px] h-[100px] overflow-hidden rounded">
                      {selectedItem?.back_dni ? (
                        <img
                          src={selectedItem?.back_dni}
                          alt={selectedItem.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                          No document uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-text-secondary">Notas</p>
                    <textarea className="w-full h-20 border border-border rounded-2xl p-2"></textarea>
                  </div>
                  <div className="flex  items-center gap-2 mt-5">
                    <label htmlFor="status">Estado</label>
                    <select onChange={(e) => handleChangeStatus(e.target.value, selectedItem?.profile_id)} value={selectedItem?.status} className="cursor-pointer border border-border rounded-2xl p-2 ">
                      {["pending", "approved", "rejected","under_review"].map((status) => (
                        <option key={status} value={status} >
                          {translateStatus(status)} 
                        </option>
                      ))}
                    </select>
                  </div>
                </>
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
