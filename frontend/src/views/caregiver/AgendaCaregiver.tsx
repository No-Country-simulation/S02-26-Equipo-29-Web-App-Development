import React from "react";
import { MessagesSquare, ZoomIn } from "lucide-react";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Patient } from "../../components/patient/patient";
import { useCaregivers, useUser } from "../../hooks";
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import { formatDayMonth, formatTime } from "../../utils/formatDate";
import { ReporteDialog } from "../../components/caregiver/Reporte";

export const Agenda = () => {
  const { data: user } = useUser();
  const { data: hookShifts } = useCaregiverShifts();
  const { data: caregivers = [] } = useCaregivers();
  const caregiverShifts = Array.isArray(hookShifts)
    ? hookShifts
    : hookShifts?.data || [];


  const [selectedPatient, setSelectedPatient] = useState<
    {
      id: string;
      name: string;
      start_time: string;
      end_time: string;
      notes: string;
      phone: string;
    } | null
  >(null);

  const [formData, setFormData] = useState({
        start_time: "",
        end_time: "",
        caregiverName: "",
        report: "",
        location: "",
    });
  
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState({
    comportamiento: "",
    medicacion: "",
    observaciones: "",
  });
  // const [range, setRange] = useState<{ start: string; end: string } | null>(
  //   null,
  // );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const calendarRef = useRef<HTMLElement & { value?: string }>(null);
  const totalPages = Math.max(1, Math.ceil(caregiverShifts.length / pageSize));
  const paginatedPatients = caregiverShifts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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

  const handleOpenReportDialog = (report: string) => {
    setSelectedReport({
      comportamiento: report,
      medicacion: "",
      observaciones: "",
    });
    setReportDialogOpen(true);
  };
  
  const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.start_time || !formData.end_time || !formData.caregiverName) {
            alert("Por favor completa horarios y cuidador");
            return;
        }

        const selectedCaregiver = caregivers.find(
            (caregiver: { full_name?: string; profile_id?: string }) =>
                caregiver.full_name === formData.caregiverName
        );

        if (!selectedCaregiver?.profile_id) {
            alert("Selecciona un cuidador válido");
            return;
        }

        setFormData({ start_time: "", end_time: "", caregiverName: "", report: "", location: "" });
        setCalendarOpen(false);
        console.log("Creating shift with data:", {
            caregiverId: selectedCaregiver.profile_id,
            start_time: formData.start_time,    
            end_time: formData.end_time,
            report: formData.report || undefined,
            location: formData.location || undefined,
        });
    };


  // const rangeValue = range ? `${range.start}/${range.end}` : "";

  console.log("Caregiver Shifts:", caregiverShifts);

  return (
    <>
      <section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Pacientes asignados
            </p>
            <h2 className="text-xl font-semibold">
              {caregiverShifts.length} guardias programadas esta semana
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Inicio
                                    </label>
                                    <input
                                      type="date"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fin
                                    </label>
                                    <input
                                      type="date"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm"
                                    />
                                </div>
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
              {paginatedPatients.map((shift) => (
                <>
                  <tr key={shift.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 hover:bg-accent/20 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedShift(shift);
                          setSelectedPatient({
                            id: shift.patient?.profile?.profile_id || shift.id,
                            name: shift.patient?.profile?.full_name || "Sin nombre",
                            start_time: shift.start_time || shift.startTime || "",
                            end_time: shift.end_time || shift.endTime || "",
                            notes: shift.report || "Sin notas disponibles",
                            phone: shift.patient?.profile?.phone || "Sin teléfono disponible",
                          });
                          setPatientDialogOpen(true);
                        }}
                        className="text-left w-full px-2 py-1 transition"
                      >
                        <p className="font-medium">{shift.patient?.profile?.full_name || "Sin nombre"}</p>
                       
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? formatDayMonth(shift.start_time || shift.startTime)
                        : "--"}
                    </td>
                    <td className="px-4 py-4">
                      {shift.start_time || shift.startTime
                        ? `${formatTime(shift.start_time || shift.startTime)} - ${formatTime(shift.end_time || shift.endTime)}`
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
                      ) : ("Sin reporte disponible")}
                    </td>

                    <td className="px-4 py-4">
                      {shift.location || "Sin dirección disponible"}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          alert(`Llamando a ${shift.patient?.profile?.phone || "sin teléfono"}`);
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
            user={user}
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