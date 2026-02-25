import { Link } from "react-router-dom";
import { Patient } from "../../components/patient/patient";
import { useUser } from "../../hooks";
import { useShifts } from "../../hooks/patient/useShifts";
import { formatDate, formatDayMonth, formatTime } from "../../utils/formatDate";
import { api } from "../../lib/axios/api";
import { useState } from "react";
import { useCaregivers } from "../../hooks/caregiver/useCaregivers";

export function PanelPatient() {
  const { data: caregivers = [] } = useCaregivers();
  const { data: patient } = useUser();
    if (!patient) {
      return <div>Loading...</div>;
    }

  const { shifts: hookShifts } = useShifts();

  console.log("Caregivers data in PanelPatient:", caregivers);

  // check que cuidadodr es , luego borrar esto y modificar el back end
    // const getCaregiverName = async (caregiverId: string) => {
    //   try {
    //     const response = await api.get(`/profiles/${caregiverId}`);
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error fetching caregiver name:", error);
    //     return "Sin cuidador asignado";
    //   }
    // };

    // getCaregiverName(hookShifts[0]?.caregiver?.profile_id || "").then((name) => {
    //   console.log("Caregiver name:", name);
    //   setCaregiverName(name);
    // });

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    return `${formatDate(value)} ${formatTime(value)}`;
  };

    console.log("Patient data in PanelPatient:", patient);
    console.log("Shifts data in PanelPatient:", hookShifts);

  return (
    <div className="p-5 bg-background h-screen">
      <header className="rounded-3xl border border-border p-6 bg-surface  shadow-lg">
        <h1 className="text-2xl font-bold ">Dashboard del {patient.full_name}</h1>
        <p className="text-gray-400">Gestiona tus cuidados</p>
      </header>

      <div className="flex justify-end">
        <Link
          to="/patient/schedule"
          className="rounded-2xl border bg-primary text-white border-border px-4 py-2 text-sm font-medium hover:bg-primary/80 mt-5 cursor-pointer"
        >
          Agendar visita
        </Link>
      </div>

      <div>
        <Patient
          open={false}
          onClose={() => {}}
          patient={{
            id: patient.id,
            name: patient.full_name || "Sin Cuidador Asignado",
            day: hookShifts[0]?.startTime ? formatDayMonth(hookShifts[0].startTime) : "",
            schedule: hookShifts[0]?.endTime ? formatTime(hookShifts[0].endTime) : "",
            notes: "",
            phone: ""
          }}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-2 mt-5">
        <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Cuidador asignado
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {hookShifts[0]?.caregiver?.full_name || "Sin cuidador asignado"}
          </h2>
          <p className="text-sm text-text-secondary">
            Turno: {hookShifts[0]?.startTime ? `${formatDateTime(hookShifts[0].startTime)} - ${formatDateTime(hookShifts[0].endTime)} - 🕛${hookShifts[0]?.hours} horas` : "Sin turno asignado"}
          </p>
          <p className="mt-4 text-sm">
            Teléfono de contacto:{" "}
            <span className="font-medium text-primary">
              {hookShifts[0]?.caregiver?.phone || "Sin teléfono disponible"}
            </span>
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-auto flex-1">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Próximas visitas
          </p>
          <ul className="mt-4 space-y-4 text-sm">
            {hookShifts.map((visit) => (
              <li
                key={`${visit.startTime}-${visit.endTime}`}
                className="rounded-2xl border border-border bg-background px-4 py-3"
              >
                <p className="text-base font-semibold">🗓️{formatDateTime(visit.startTime)} 🕛</p>
                <p className="text-text-secondary">🗓️{formatDateTime(visit.endTime)} 🕛</p>
                <p className="mt-1">NOTAS : <span className="text-xs text-slate-400">{visit.report || "Sin notas disponibles"}</span></p>
                <p className="mt-1">UBICACIÓN : <span className="text-xs text-slate-400">{visit.location || "Sin ubicación disponible"}</span></p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
