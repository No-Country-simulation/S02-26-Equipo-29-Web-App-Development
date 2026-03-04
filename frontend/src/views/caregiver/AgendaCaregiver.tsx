import { MessagesSquare, ZoomIn } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Patient } from "../../components/patient/patient";
import { useUser } from "../../hooks/user/useUser";
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import { formatDayMonth, formatTime } from "../../utils/formatDate";
import { ReporteDialog } from "../../components/caregiver/Reporte";
import { Calendar } from "../../components/UI/Calendar";
import { Header } from "../../components/UI/Headers";

export const Agenda = () => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: hookShiftsCaregiver, isLoading: isShiftsLoading } =
    useCaregiverShifts();
  const caregiverShifts = Array.isArray(hookShiftsCaregiver)
    ? hookShiftsCaregiver
    : hookShiftsCaregiver?.data || [];

  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    day: string;
    schedule: string;
    notes: string;
    phone: string;
  } | null>(null);

  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState({
    comportamiento: "",
    medicacion: "",
    observaciones: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.max(1, Math.ceil(caregiverShifts.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPatients = caregiverShifts.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize,
  );

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleOpenReportDialog = (report: string) => {
    setSelectedReport({
      comportamiento: report,
      medicacion: "",
      observaciones: "",
    });
    setReportDialogOpen(true);
  };

  console.log("Caregiver Shifts in Agenda:", caregiverShifts);

  const shiftsPending = caregiverShifts.filter((shift) => shift.status !== "COMPLETED");
  const shiftsCompleted = caregiverShifts.filter((shift) => shift.status === "COMPLETED");

  const isLoading = isUserLoading || isShiftsLoading;

  if (isLoading) {
    return (
      <div className="bg-background px-5 pt-5 animate-pulse">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <div className="mb-2 h-7 w-56 rounded-xl bg-border" />
          <div className="h-4 w-40 rounded-xl bg-border" />
        </header>

        <section className="my-6 rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 h-4 w-36 rounded-xl bg-border" />
              <div className="h-6 w-52 rounded-xl bg-border" />
            </div>

            <div className="h-10 w-44 rounded-2xl bg-border" />
            <div className="h-10 w-32 rounded-2xl bg-border" />
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="bg-background px-4 py-3 flex gap-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 w-20 rounded-xl bg-border" />
              ))}
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-6 px-4 py-4 border-t border-border">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 rounded-xl bg-border" />
                  <div className="h-3 w-20 rounded-xl bg-border" />
                </div>
                <div className="h-4 w-20 rounded-xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-28 rounded-xl bg-border flex-1" />
                <div className="h-8 w-10 rounded-2xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-8 w-10 rounded-2xl bg-border flex-1" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 h-4 w-36 rounded-xl bg-border" />
              <div className="h-6 w-52 rounded-xl bg-border" />
            </div>

            <div className="h-10 w-44 rounded-2xl bg-border" />
            <div className="h-10 w-32 rounded-2xl bg-border" />
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="bg-background px-4 py-3 flex gap-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 w-20 rounded-xl bg-border" />
              ))}
            </div>

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-6 px-4 py-4 border-t border-border">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 rounded-xl bg-border" />
                  <div className="h-3 w-20 rounded-xl bg-border" />
                </div>
                <div className="h-4 w-20 rounded-xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-28 rounded-xl bg-border flex-1" />
                <div className="h-8 w-10 rounded-2xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-16 rounded-xl bg-border flex-1" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <>
      <Header user={user} shifts={caregiverShifts} />
      
      <section className="w-full rounded-3xl border border-border bg-surface p-6 shadow-lg mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Pacientes asignados
            </p>
            <h2 className="text-xl font-semibold">
              {shiftsPending.length} Guardias Pendientes
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Calendar />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Día</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium">Resporte</th>
                <th className="px-4 py-3 font-medium">Direccion</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {shiftsPending.map((shift: any) => (
                <>
                  <tr key={shift.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 hover:bg-accent/20 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedShift(shift);
                          setSelectedPatient({
                            id: shift.patient?.profile?.profile_id || shift.id,
                            name:
                              shift.patient?.profile?.full_name || "Sin nombre",
                            day:
                              shift.start_time || shift.startTime
                                ? formatDayMonth(
                                    shift.start_time || shift.startTime,
                                  )
                                : "",
                            schedule:
                              (shift.start_time || shift.startTime) &&
                              (shift.end_time || shift.endTime)
                                ? `${formatTime(
                                    shift.start_time || shift.startTime,
                                  )} - ${formatTime(
                                    shift.end_time || shift.endTime,
                                  )}`
                                : "",
                            notes: shift.report || "Sin notas disponibles",
                            phone:
                              shift.patient?.profile?.phone ||
                              "Sin teléfono disponible",
                          });
                          setPatientDialogOpen(true);
                        }}
                        className="text-left w-full px-2 py-1 transition"
                      >
                        <p className="font-medium">
                          {shift.patient?.profile?.full_name || "Sin nombre"}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? formatDayMonth(shift.start_time || shift.startTime)
                        : "--"}
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? `${formatTime(
                            shift.start_time || shift.startTime,
                          )} - ${formatTime(shift.end_time || shift.endTime)}`
                        : "--"}
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {shift.report || "Sin notas disponibles"}
                    </td>

                    <td className="px-4 py-4 text-text-secondary">
                      {shift.report ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReportDialog(shift.report)}
                          className="rounded-2xl border border-border px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-accent/20"
                        >
                          <ZoomIn className="text-text-primary" />
                        </button>
                      ) : (
                        "Sin reporte disponible"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {shift.location || "Sin dirección disponible"}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          alert(
                            `Llamando a ${
                              shift.patient?.profile?.phone || "sin teléfono"
                            }`,
                          );
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
              Mostrando {paginatedPatients.length} de {caregiverShifts.length}{" "}
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
            onClose={() => {
              setPatientDialogOpen(false);
              setSelectedShift(null);
            }}
            patient={selectedPatient}
            shift={selectedShift || undefined}
          />
        )}
        <ReporteDialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSave={() => {}}
          initialData={selectedReport}
        />
      </section>

      <section className="w-full rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Pacientes asignados
            </p>
            <h2 className="text-xl font-semibold">
              {shiftsCompleted.length} Guardias Finalizadas
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Calendar />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Día</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium">Resporte</th>
                <th className="px-4 py-3 font-medium">Direccion</th>
                <th className="px-4 py-3 font-medium">Calificacion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {shiftsCompleted.map((shift: any) => (
                <>
                  <tr key={shift.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 hover:bg-accent/20 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedShift(shift);
                          setSelectedPatient({
                            id: shift.patient?.profile?.profile_id || shift.id,
                            name:
                              shift.patient?.profile?.full_name || "Sin nombre",
                            day:
                              shift.start_time || shift.startTime
                                ? formatDayMonth(
                                    shift.start_time || shift.startTime,
                                  )
                                : "",
                            schedule:
                              (shift.start_time || shift.startTime) &&
                              (shift.end_time || shift.endTime)
                                ? `${formatTime(
                                    shift.start_time || shift.startTime,
                                  )} - ${formatTime(
                                    shift.end_time || shift.endTime,
                                  )}`
                                : "",
                            notes: shift.report || "Sin notas disponibles",
                            phone:
                              shift.patient?.profile?.phone ||
                              "Sin teléfono disponible",
                          });
                          setPatientDialogOpen(true);
                        }}
                        className="text-left w-full px-2 py-1 transition"
                      >
                        <p className="font-medium">
                          {shift.patient?.profile?.full_name || "Sin nombre"}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? formatDayMonth(shift.start_time || shift.startTime)
                        : "--"}
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? `${formatTime(
                            shift.start_time || shift.startTime,
                          )} - ${formatTime(shift.end_time || shift.endTime)}`
                        : "--"}
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {shift.report || "Sin notas disponibles"}
                    </td>

                    <td className="px-4 py-4 text-text-secondary">
                      {shift.report ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReportDialog(shift.report)}
                          className="rounded-2xl border border-border px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-accent/20"
                        >
                          <ZoomIn className="text-text-primary" />
                        </button>
                      ) : (
                        "Sin reporte disponible"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {shift.location || "Sin dirección disponible"}
                    </td>

                    <td className="px-4 py-4">
                      ⭐{shift.rating?.number || "-"}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {paginatedPatients.length} de {caregiverShifts.length}{" "}
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
            onClose={() => {
              setPatientDialogOpen(false);
              setSelectedShift(null);
            }}
            patient={selectedPatient}
            shift={selectedShift || undefined}
          />
        )}
        <ReporteDialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSave={() => {}}
          initialData={selectedReport}
        />
      </section>
    </>
  );
};
