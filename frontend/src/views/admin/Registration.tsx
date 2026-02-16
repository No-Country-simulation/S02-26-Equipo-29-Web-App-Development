import {  useEffect, useState } from "react";
import { User, UserCogIcon } from "lucide-react";
import { useCaregivers } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import type { Caregiver, Patient } from "../../types";

const patients: Patient[] = [
  {
    id: "P-01",
    full_name: "María López",
    role: "patient",
    email: "maria@example.com",
    credentials: "12345678-9",
    status: "pending",
    notes: "",
    created_at: "2022-01-01",
    front_dni: "https://placehold.co/600x400/png",
    back_dni: "https://placehold.co/600x400/png",
  },
  {
    id: "P-02",
    full_name: "Juan Fernández",
    role: "patient",
    email: "juan@example.com",
    credentials: "12345678-9",
    status: "under_review",
    notes: "",
    created_at: "2022-01-01",
    front_dni: "https://placehold.co/600x400/png",
    back_dni: "https://placehold.co/600x400/png",
  },
  {
    id: "P-03",
    full_name: "María López",
    role: "patient",
    email: "maria2@example.com",
    credentials: "12345678-9",
    status: "approved",
    notes: "",
    created_at: "2022-01-01",
    front_dni: "https://placehold.co/600x400/png",
    back_dni: "https://placehold.co/600x400/png",
  },
  {
    id: "P-04",
    full_name: "Juan Fernández",
    role: "patient",
    email: "juan2@example.com",
    credentials: "12345678-9",
    status: "rejected",
    notes: "",
    created_at: "2022-01-01",
    front_dni: "https://placehold.co/600x400/png",
    back_dni: "https://placehold.co/600x400/png",
  },
];

enum CaregiverDocumentType {
  DNI_FRONT = 'dni_front',
  DNI_BACK = 'dni_back',
  CRIMINAL_RECORD = 'criminal_record',
  CERTIFICATE = 'certificate',
  CONTRACT = 'contract',
}

export function Registration() {
  const [selectedUserType, setSelectedUserType] = useState<"caregiver" | "patient">(
    "caregiver",
  );
  const [selectedItem,setSelectedItem]=useState<Caregiver | Patient | null>(null)
  const {data:caregivers,isLoading}=useCaregivers()


  useEffect(() => {    
    if (selectedUserType === "caregiver" && caregivers) {
      setSelectedItem(caregivers?.[0] || null)
    } else if (selectedUserType === "patient") {
        setSelectedItem(patients[0])
    }
  }, [caregivers, selectedUserType])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "under_review":
        return "bg-blue-500/10 text-blue-500";
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "under_review":
        return "En Revisión";
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";

    }
  };

  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <div className="bg-background p-5">
      <header className="p-5 rounded-3xl border border-border bg-surface  shadow-lg">
        <h1 className="text-2xl font-bold ">Administrar Usuarios</h1>
        <p className="text-gray-400">
          Verifica los usuarios registrados en el sistema
        </p>
      </header>

      <section className="mt-5 rounded-3xl border border-border bg-surface p-6 shadow-lg">
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
            <p className="bg-primary/10 text-primary rounded-full px-2">15</p>
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
            <p className="bg-primary/10 text-primary rounded-full px-2">15</p>
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
                        <th className="px-4 py-3 font-medium">Credenciales</th>
                        <th className="px-4 py-3 font-medium">
                          Fecha de Registro
                        </th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
                      {caregivers?.map((caregiver) => (
                        <tr
                            onClick={() => setSelectedItem(caregiver)}
                          key={caregiver.profile_id}
                          className={`hover:bg-background hover:cursor-pointer ${
                            (selectedItem as Caregiver)?.profile_id === caregiver.profile_id
                              ? "bg-primary/5"
                              : ""
                          }`}

                        >
                          <td
                 
                           className="px-4 py-4 flex items-center gap-2">
                            <img
                              src={caregiver.front_dni || "https://placehold.co/100x100"}
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="font-medium">{caregiver.full_name}</p>
                              <p className="text-xs text-text-secondary">
                                {caregiver?.profile_id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">{caregiver.credentials}</td>
                          <td className="px-4 py-4">{formatDate(caregiver.created_at)}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                caregiver.status,
                              )}`}
                            >
                              {translateStatus(caregiver.status)}
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
                        <th className="px-4 py-3 font-medium">Credenciales</th>
                        <th className="px-4 py-3 font-medium">
                          Fecha de Registro
                        </th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
                      {patients.map((patient, index) => (
                        <tr
                           onClick={() => setSelectedItem(patient)}
                          key={index}
                          className={`hover:bg-background hover:cursor-pointer ${selectedItem?.id === patient.id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-4 py-4 flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="font-medium">{patient.full_name}</p>
                              <p className="text-xs text-text-secondary">
                                {patient.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">{patient.credentials}</td>
                          <td className="px-4 py-4">{patient.created_at}</td>
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
                {console.log(selectedItem)}
                <img
                    src={selectedItem?.front_dni || "https://placehold.co/100x100"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                />
                <p className="font-bold">{selectedItem.full_name}</p>
                {/* <p className="text-text-secondary/50 text-xs">id: {selectedItem?}</p> */}

                <p className="mt-5  text-text-secondary">
                    Verificación de documentos
                </p>
                <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-text-secondary">Parte delantera</p>
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
                <div className="flex justify-evenly gap-2 mt-5">
                    <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                    Aceptar
                    </button>
                    <button className="cursor-pointer hover:bg-danger hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                    Rechazar
                    </button>
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
