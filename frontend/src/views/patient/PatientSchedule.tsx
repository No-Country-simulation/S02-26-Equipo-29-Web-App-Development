import React from "react";
import { MessagesSquare, SquareCheckBig, SquareX, Star, ZoomIn } from "lucide-react";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Patient } from "../../components/patient/patient";
import { useCaregivers, useUser } from "../../hooks";
import { useShifts } from "../../hooks/patient/useShifts";
import { formatDayMonth, formatTime } from "../../utils/formatDate";
import { api } from "../../lib/axios/api";
import { ReporteDialog } from "../../components/caregiver/Reporte";
import { ShiftCardDialog } from "../../components/shifts/summaryShift";

export const PatientSchedule = () => {
  const { data: user } = useUser();
  const { shifts: hookShifts } = useShifts();
  const { data: caregivers = [] } = useCaregivers();
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof assignedPatients)[number] | null
  >(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);

  const [endShift, setEndShift] = useState(false);
  const [rating, setRating] = useState(0);
  const [report, setReport] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState({
      comportamiento: "",
      medicacion: "",
      observaciones: "",
    });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [assignedPatients, ] = useState<
    {
      id: string;
      name: string;
      day: string;
      schedule: string;
      notes: string;
      phone: string;
    }[]
  >([]);


  const calendarRef = useRef<HTMLElement & { value?: string }>(null);
  const totalPages = Math.max(1, Math.ceil(assignedPatients.length / pageSize));
  const paginatedPatients = assignedPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [openSummaryShiftId, setOpenSummaryShiftId] = useState<string | null>(null);
  const handleOpenReportDialog = (report: string) => {
    setSelectedReport({
      comportamiento: report,
      medicacion: "",
      observaciones: "",
    });
    setReportDialogOpen(true);
  };

  useEffect(() => {
    if (!calendarOpen || !calendarRef.current) return;

    const calendar = calendarRef.current;
    const handleChange = (event: Event) => {
      const value = (event.currentTarget as typeof calendar).value ?? "";
      const [start = "", end = ""] = value.split("/");
      setRange(start && end ? { start, end } : null);
    };

    calendar.addEventListener("change", handleChange);
    return () => calendar.removeEventListener("change", handleChange);
  }, [calendarOpen]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleOpenEndShiftDialog = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setEndShift(true);
  };

  const handleFinalizeShift = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      shiftId: selectedShiftId,
      number: rating,
      notes: report
    };

    api.post("/ratings", payload)
      .then((response) => {
        console.log("Finalizar guardia response:", response.data);
      })
      .catch((error) => {
        console.error("Error al finalizar guardia:", error);
      });

    console.log("Finalizar guardia payload:", payload);

    setEndShift(false);
    setSelectedShiftId(null);
    setRating(0);
    setReport("");
  };

  const getTotalHours = (start?: string, end?: string) => {
    if (!start || !end) return undefined;
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    if (Number.isNaN(startDate) || Number.isNaN(endDate) || endDate <= startDate) {
      return undefined;
    }
    return Number(((endDate - startDate) / (1000 * 60 * 60)).toFixed(2));
  };

  console.log("Shifts del hook:", hookShifts);

  // const rangeValue = range ? `${range.start}/${range.end}` : "";

  return (
    <>
      <section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Pacientes asignados
            </p>
            <h2 className="text-xl font-semibold">
              {hookShifts.length} guardias programadas esta semana
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-medium text-text-secondary">
              Resultados por página
            </label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-2xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
            >
              {[5, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <button
              onClick={() => setCalendarOpen(true)}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Ver calendario completo
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Cuidador</th>
                <th className="px-4 py-3 font-medium">Día</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium">Reporte</th>
                <th className="px-4 py-3 font-medium">Finalizar</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {hookShifts
                .filter((shift) => shift.status !== "COMPLETED")
                .map((shift) => (
                <>
                  <tr key={shift.patient?.profile_id || shift.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 hover:bg-accent/20 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedPatient({
                            id: shift.patient?.profile_id || "",
                            name: shift.patient?.full_name || "Sin nombre",
                            day: shift.startTime ? formatDayMonth(shift.startTime) : "",
                            schedule: shift.startTime && shift.endTime ? `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}` : "",
                            notes: shift.report || "Sin notas disponibles",
                            phone: shift.patient?.phone || "Sin teléfono disponible",
                          });
                          setPatientDialogOpen(true);
                        }}
                        className="text-left w-full px-2 py-1 transition"
                      >
                        
                        <p className="text-xs text-text-secondary">
                         {shift.caregiver?.full_name || "Sin cuidador asignado"}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-xs text-text-secondary"> {shift.startTime ? formatDayMonth(shift.startTime) : ""} </td>
                    <td className="px-4 py-4 text-xs text-text-secondary"> {shift.startTime && shift.endTime ? `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}` : "--"} </td>
                    <td className="px-4 py-4 text-xs text-text-secondary">
                      {shift.report || "Sin notas disponibles"}
                    </td>
                    <td className="px-4 py-4 text-xs text-text-secondary">
                      {shift.report ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReportDialog(shift.report)}
                          className="rounded-2xl border border-border px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-accent/20"
                        >
                          <ZoomIn className="text-text-primary" />
                        </button>
                      ) : ("Sin reporte disponible")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          handleOpenEndShiftDialog(shift.id);
                        }}
                        className="rounded-2xl bg-primary/50 px-3 py-2 text-xs font-medium text-white transition hover:bg-primary/90"
                      >
                        <SquareCheckBig className="hover:text-background/95"/>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          alert(`Llamando a ${shift.caregiver?.phone || "Número no disponible"}`);
                        }}
                        className="rounded-2xl bg-green-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-600"
                      >
                        <MessagesSquare className="text-white" />
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {paginatedPatients.length} de {assignedPatients.length}{" "}
              pacientes
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-2xl border border-border px-3 py-1 text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-text-primary">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-2xl border border-border px-3 py-1 text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        {selectedPatient && (
          <Patient
            open={patientDialogOpen}
            onClose={() => setPatientDialogOpen(false)}
            patient={selectedPatient}
            user={user}
            shift={hookShifts.find((shift) => shift.patient?.profile_id === selectedPatient.id) || undefined}
          />
        )}

        {endShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-2xl shadow-lg min-w-62.5 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Finalizar Guardia</h2>
              <span className="text-sm text-text-secondary mb-4 block">
                Guardia Ofrecida por : <span className="font-medium">{hookShifts.find((shift) => shift.id === selectedShiftId)?.caregiver?.full_name || "Sin cuidador asignado"}</span>
              </span>
              <form onSubmit={handleFinalizeShift} className="space-y-4">
                <div>
                  <label htmlFor="rating" className="mb-2 block text-sm font-medium text-text-primary">
                    Calificar:
                  </label>
                  <div className="grid max-h-56 grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-1 overflow-y-auto rounded-2xl border border-border p-3">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="flex items-center justify-center rounded p-1 transition hover:scale-105"
                          aria-label={`Calificación ${value}`}
                        >
                          <Star
                            size={18}
                            className={
                              value <= rating
                                ? "fill-yellow-400 text-yellow-400 shadow-accent hover:fill-yellow-500 hover:text-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <input id="rating" name="rating" type="number" value={rating} readOnly hidden />
                </div>

                <div>
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium text-text-primary">
                    Comentario:
                  </label>
                  <textarea
                    id="reports"
                    name="reports"
                    value={report}
                    onChange={(event) => setReport(event.target.value)}
                    className="min-h-28 w-full rounded-2xl border border-border px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                    placeholder="Escribe tu comentario"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary/90"
                >
                  Finalizar
                </button>

                <div className="flex justify-center ">
                  <button
                    type="button"
                    onClick={() => setEndShift(false)}
                    className="flex items-center justify-center"
                  >
                    <SquareX className="text-red-500 hover:bg-red-100" />
                  </button>
                </div>
                
              </form>
            </div>
          </div>
        )}
      </section>

      {
        <section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Calendario Completo</h2>
          <p className="text-sm text-text-secondary mb-4">
            Turnos Finalizados
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {
              hookShifts.filter(shift => shift.status === "COMPLETED").map(shift => (
                <div key={shift.id} className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 hover:bg-accent/20 transition">
                  <button
                    type="button"
                    onClick={() => setOpenSummaryShiftId(shift.id)}
                    className="w-full text-left rounded-lg px-2 py-1 transition"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      {shift.caregiver?.full_name || "Sin cuidador asignado"}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {shift.startTime ? formatDayMonth(shift.startTime) : ""}
                      {shift.startTime && shift.endTime
                        ? ` - ${formatTime(shift.startTime)} a ${formatTime(shift.endTime)}    -`
                        : ""}
                             ⭐{shift.rating?.number || "-"}
                    </p>
                  </button>
                  <ShiftCardDialog
                    shift={{
                      id: shift.id,
                      caregiver: {
                        full_name: shift.caregiver?.full_name || "Sin cuidador asignado",
                      },
                      startTime: shift.startTime,
                      endTime: shift.endTime,
                      rating: shift.rating,
                      status: shift.status,
                      patient: {
                        full_name: shift.patient?.profile?.full_name || "-",
                      },
                      location: shift.location || "-",
                      notes: shift.report || "-",
                      totalHours: getTotalHours(shift.startTime, shift.endTime),
                    }}
                    isOpen={openSummaryShiftId === shift.id}
                    onOpenChange={(open) => setOpenSummaryShiftId(open ? shift.id : null)}
                  />
                </div>
              ))
            }
          </div>
          </section>
            
      }

      <ReporteDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSave={() => {}}
        initialData={selectedReport}
      />
    </>
  );
};
