import { Circle, Plus } from "lucide-react";
import { useState } from "react";

export function Appointments() {
  const appointments = [
    {
      id: "P-102",
      name: "Don José Pérez",
      day: "11/02/2026",
      schedule: "06:00 - 10:00",
      caregiver: "María López",
      status: "Pendiente",
      service: "Cuidado de enfermo",
    },
    {
      id: "P-143",
      name: "Sra. Emilia Torres",
      day: "12/02/2026",
      schedule: "10:00 - 14:00",
      caregiver: "Juan Fernández",
      status: "Aprobado",
      service: "Cuidado de enfermo",
    },
    {
      id: "P-210",
      name: "Srta. Lucía Gómez",
      day: "13/02/2026",
      schedule: "14:00 - 20:00",
      caregiver: "Juan Fernández",
      status: "Rechazado",
      service: "Cuidado de enfermo",
    },
  ];

  const [filter, setFilter] = useState("all");
  return (
    <div className="p-5 bg-background">
      <header className="rounded-3xl border border-border p-6 bg-surface  shadow-lg">
        <h1 className="text-2xl font-bold ">Calendario de cuidados</h1>
        <p className="text-gray-400">Gestionar los cuidados de los pacientes</p>
      </header>

      <div className="mt-5 rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 whitespace-nowrap">
            Filtrar por:
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`cursor-pointer hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2 ${
                filter === "all" ? "bg-primary text-white" : ""
              }`}
            >
              <span className="whitespace-nowrap">Ver todas</span>
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`cursor-pointer hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2 ${
                filter === "pending" ? "bg-primary text-white" : ""
              }`}
            >
              <Circle className="w-2 h-2 fill-yellow-500" />
              <span className="whitespace-nowrap">Pendientes</span>
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`cursor-pointer hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2 ${
                filter === "approved" ? "bg-primary text-white" : ""
              }`}
            >
              <Circle className="w-2 h-2 fill-green-500" />
              <span className="whitespace-nowrap">Aprobadas</span>
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`cursor-pointer hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2 ${
                filter === "rejected" ? "bg-primary text-white" : ""
              }`}
            >
              <Circle className="w-2 h-2 fill-red-500" />
              <span className="whitespace-nowrap">Rechazadas</span>
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`cursor-pointer hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2 ${
                filter === "completed" ? "bg-primary text-white" : ""
              }`}
            >
              <Circle className="w-2 h-2 fill-primary" />
              <span className="whitespace-nowrap">Completadas</span>
            </button>
          </div>
          <div className="flex items-center justify-end  w-full">
            <button className="whitespace-nowrap cursor-pointer rounded-2xl flex items-center justify-end gap-2 bg-primary px-4 py-2  font-medium text-white transition hover:bg-primary-hover">
              <Plus /> Agendar cuidado
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl justify-between mt-5">
        <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {appointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-white/5">
                  <td className="px-4 py-4">
                    <p className="font-medium">{appointment.day}</p>
                  </td>
                  <td className="px-4 py-4">{appointment.schedule}</td>
                  <td className="px-4 py-4">{appointment.service}</td>
                  <td className="px-4 py-4">{appointment.status}</td>
                  <td className="px-4 py-4 flex gap-2 justify-center">
                    <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                      Aprobar
                    </button>
                    <button className="cursor-pointer hover:bg-red-600 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
