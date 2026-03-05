import { ChevronDown } from "lucide-react";
import { useUser } from "../../hooks";
import { useNextShift, useShifts } from "../../hooks/patient/useShifts";
import { formatDate, formatTime } from "../../utils/formatDate";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "../../components/UI/Headers";
import { api } from "../../lib/axios/api";
import { useQueryClient } from "@tanstack/react-query";

export function PanelPatient() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const {
    shifts,
    createShift,
    isCreating,
    createError,
    isLoading,
  } = useShifts();
  const {data:nextShift} = useNextShift();
  


  // Estado para el formulario
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    report: "",
    location: "",
  });

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    return `${formatDate(value)} ${formatTime(value)}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_time || !formData.end_time) {
      toast.error("Por favor completa horarios");
      return;
    }

    try {
      await createShift({
        start_time: formData.start_time,
        end_time: formData.end_time,
        report: formData.report || undefined,
        location: formData.location || undefined,
      });

      setFormData({
        start_time: "",
        end_time: "",
        report: "",
        location: "",
      });
      setShowForm(false);
    } catch{
      toast.error("Error al pedir la guardia, intenta de nuevo");
    }
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
          title="Panel del Paciente" 
          description="Resumen de tus cuidados y solicitudes" 
        />
      <section className="mx-auto w-full max-w-6xl space-y-5">

        <div className="flex justify-start">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`mt-1 inline-flex items-center rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 ${
              user?.role === "CAREGIVER" ? "hidden" : ""
            }`}
          >
            {showForm ? "Cancelar" : "Solicitar una Guardias"}{" "}
            <ChevronDown className="ml-2 inline-block" size={16} />
          </button>
        </div>

        {/* Formulario de creación */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-5 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Solicitar turno
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-border px-3 py-1 text-sm text-text-secondary transition hover:bg-background"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">
                      Inicio
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">
                      Fin
                    </label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Notas{" "}
                    <span className="text-xs text-text-secondary">
                      (Opcional)
                    </span>
                  </label>
                  <textarea
                    name="report"
                    value={formData.report}
                    onChange={handleInputChange}
                    placeholder="Detalles del turno..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Ubicación
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Detalles de la ubicación..."
                    rows={1}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                {createError && (
                  <p className="text-sm text-red-600">
                    Error: {createError?.message || "No se pudo crear el turno"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {isCreating ? "Enviando solicitud..." : "Solicitar turno"}
                </button>
              </form>
            </div>
          </div>
        )}
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
