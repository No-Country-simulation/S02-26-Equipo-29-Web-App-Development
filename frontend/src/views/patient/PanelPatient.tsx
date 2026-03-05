import { useNextShift, useShifts } from "../../hooks/patient/useShifts";
import { formatDate, formatTime } from "../../utils/formatDate";
import { toast } from "sonner";
import { Header } from "../../components/UI/Headers";
import { api } from "../../lib/axios/api";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonNewShift } from "../../components/UI/ButtonNewShift";
import { useUser } from "../../hooks";

export function PanelPatient() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const {
    shifts,
    isLoading,
  } = useShifts();
  const {data:nextShift} = useNextShift();


  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    return `${formatDate(value)} ${formatTime(value)}`;
  };


  const cancelShift =async (shiftId: string) => {
    try {
      await api.patch(`/shifts/${shiftId}/status`, {
        status: "CANCELLED",
      });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["next-shift"] });
      toast.success("Guardia cancelada correctamente");
    } catch {
      toast.error("Error al cancelar la guardia");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 lg:px-8">
        <Header 
          title="Panel del Paciente" 
          description="Resumen de tus cuidados y solicitudes" 
        />

        <section className="mx-auto w-full max-w-6xl space-y-5 animate-pulse">
          <div className="h-9 w-44 rounded-2xl bg-border" />

          <section className="mt-5 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
              <div className="h-3 w-36 rounded-xl bg-border" />
              <div className="mt-3 h-7 w-56 rounded-xl bg-border" />
              <div className="mt-2 h-4 w-full rounded-xl bg-border" />
              <div className="mt-2 h-4 w-2/3 rounded-xl bg-border" />
            </article>

            <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
              <div className="h-3 w-32 rounded-xl bg-border" />
              <ul className="mt-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <div className="h-4 w-3/4 rounded-xl bg-border" />
                    <div className="mt-2 h-4 w-2/3 rounded-xl bg-border" />
                    <div className="mt-2 h-3 w-full rounded-xl bg-border" />
                    <div className="mt-2 h-3 w-5/6 rounded-xl bg-border" />
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 lg:px-8">
        <Header 
          title={`Panel del Paciente ${user?.full_name ? `- ${user.full_name}` : ""}`} 
          description="Resumen de tus cuidados y solicitudes" 
        />
      <section className="mx-auto w-full max-w-6xl space-y-5">

        <ButtonNewShift />

        <section className="mt-5 grid gap-6 lg:grid-cols-2">
          <article className="h-auto rounded-3xl border border-border bg-surface p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Cuidador asignado
            </p>
            <h2 className="mt-3 text-xl font-semibold">
              {nextShift?.caregiver?.profile?.full_name ||
                "Sin cuidador asignado"}
            </h2>
            <p className="text-sm text-text-secondary">
              Turno:{" "}
              {nextShift?.start_time
                ? `${formatDateTime(nextShift.start_time)} - ${formatDateTime(
                    nextShift.end_time,
                  )} - 🕛${nextShift?.hours} horas`
                : "Sin turno asignado"}
            </p>
            <p className="mt-4 text-sm">
              Teléfono de contacto:{" "}
              <span className="font-medium text-primary">
                {nextShift?.caregiver?.profile?.phone || "Sin teléfono disponible"}
              </span>
            </p>
            <div></div>
          </article>

          <article className="h-auto rounded-3xl border border-border bg-surface p-6 shadow-lg w-auto flex-1">
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Próximas visitas
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {shifts
                .filter((visit) => {
                  const shiftDate = new Date(visit.startTime || "");
                  shiftDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isTodayOrFuture = shiftDate >= today;
                  const isUpcomingStatus = ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(visit.status);
                  return isTodayOrFuture && isUpcomingStatus;
                })
                .map((visit) => (
                  <li
                    key={`${visit.startTime}-${visit.endTime}`}
                    className="relative rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <p className="text-base font-semibold">
                      🗓️{formatDateTime(visit.startTime)} 🕛
                    </p>
                    <p className="text-text-secondary">
                      🗓️{formatDateTime(visit.endTime)} 🕛
                    </p>
                    <p className="mt-1">
                      NOTAS :{" "}
                      <span className="text-xs text-slate-400">
                        {visit.report || "Sin notas disponibles"}
                      </span>
                    </p>
                    <p className="mt-1">
                      UBICACIÓN :{" "}
                      <span className="text-xs text-slate-400">
                        {visit.location || "Sin ubicación disponible"}
                      </span>
                    </p>
                    <button
                      onClick={() => cancelShift(visit.id)}
                      className="absolute top-3 right-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                    >
                      Cancelar turno
                    </button>
                  </li>
                ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
