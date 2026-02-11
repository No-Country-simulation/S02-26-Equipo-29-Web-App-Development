import { useState } from "react";
import { User, UserCogIcon } from "lucide-react";

export function Registration() {
  const [selectedUser, setSelectedUser] = useState<"caregiver" | "patient">(
    "caregiver",
  );

  const caregivers = [
    {
      id: "C-01",
      name: "María López",
      credentials: "12345678-9",
      status: "Pendiente",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "C-02",
      name: "Juan Fernández",
      credentials: "12345678-9",
      status: "En Revisión",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "C-03",
      name: "María López",
      credentials: "12345678-9",
      status: "Aprobado",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "C-04",
      name: "Juan Fernández",
      credentials: "12345678-9",
      status: "Rechazado",
      notes: "",
      date: "2022-01-01",
    },
  ];

  const patients = [
    {
      id: "P-01",
      name: "María López",
      credentials: "12345678-9",
      status: "Pendiente",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "P-02",
      name: "Juan Fernández",
      credentials: "12345678-9",
      status: "En Revisión",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "P-03",
      name: "María López",
      credentials: "12345678-9",
      status: "Aprobado",
      notes: "",
      date: "2022-01-01",
    },
    {
      id: "P-04",
      name: "Juan Fernández",
      credentials: "12345678-9",
      status: "Rechazado",
      notes: "",
      date: "2022-01-01",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-500/10 text-yellow-500";
      case "En Revisión":
        return "bg-blue-500/10 text-blue-500";
      case "Aprobado":
        return "bg-green-500/10 text-green-500";
      case "Rechazado":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };
  return (
    <>
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <h1 className="text-2xl font-bold ">Administrar Usuarios</h1>
        <p className="text-gray-400">
          Verifica los usuarios registrados en el sistema
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex gap-8 border-b border-border">
          <div
            className={`flex items-center gap-2 cursor-pointer pb-2 border-b-2 -mb-px transition-colors ${
              selectedUser === "caregiver"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-primary/70"
            }`}
            onClick={() => setSelectedUser("caregiver")}
          >
            <UserCogIcon className="h-6 w-6" />
            <p>Cuidadores</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">15</p>
          </div>

          <div
            className={`flex items-center gap-2 cursor-pointer pb-2 border-b-2 -mb-px transition-colors ${
              selectedUser === "patient"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-primary/70"
            }`}
            onClick={() => setSelectedUser("patient")}
          >
            <User className="h-6 w-6" />
            <p>Pacientes</p>
            <p className="bg-primary/10 text-primary rounded-full px-2">15</p>
          </div>
        </div>

        <div>
          {/* Seccion de cuidadores */}
          <div className="rounded-2xl p-2 justify-between mt-5 grid grid-cols-3 gap-5">
            {/* Tabla */}

            {selectedUser === "caregiver" ? (
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
                      {caregivers.map((caregiver, index) => (
                        <tr
                          key={index}
                          className="hover:bg-background hover:cursor-pointer"
                        >
                          <td className="px-4 py-4 flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="font-medium">{caregiver.name}</p>
                              <p className="text-xs text-text-secondary">
                                {caregiver.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">{caregiver.credentials}</td>
                          <td className="px-4 py-4">{caregiver.date}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                caregiver.status,
                              )}`}
                            >
                              {caregiver.status}
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
                          key={index}
                          className="hover:bg-background hover:cursor-pointer"
                        >
                          <td className="px-4 py-4 flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-xs text-text-secondary">
                                {patient.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">{patient.credentials}</td>
                          <td className="px-4 py-4">{patient.date}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full ${getStatusColor(
                                patient.status,
                              )}`}
                            >
                              {patient.status}
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
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold">Juan Fernandez</p>
              <p className="text-text-secondary/50 text-xs">id: 12345678-9</p>

              <p className="mt-5  text-text-secondary">
                Verficicación de documentos
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm text-text-secondary">Parte delantera</p>
                <img src="/delantera.jpg" alt="" className="w-[80%] h-auto" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm text-text-secondary">Parte trasera</p>
                <img src="/trasera.jpg" alt="" className="w-[80%] h-auto" />
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
