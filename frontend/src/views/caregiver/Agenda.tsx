import { MessagesSquare, SquareX } from "lucide-react";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Patient } from "../../components/patient/patient";
import { useUser } from "../../context/UserContext";
import "cally";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "calendar-month": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "calendar-range": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { months?: number };
    }
  }
}

export const Agenda = () => {
  const { user } = useUser();
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof assignedPatients)[number] | null
  >(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [range, setRange] = useState<{ start: string; end: string } | null>(
    null,
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const currentDate = new Date();
  const getMonth = () => {
    switch (currentDate.toString().split(" ")[1]) {
      case "Jan":
        return 1;
      case "Feb":
        return 2;
      case "Mar":
        return 3;
      case "Apr":
        return 4;
      case "May":
        return 5;
      case "Jun":
        return 6;
      case "Jul":
        return 7;
      case "Aug":
        return 8;
      case "Sep":
        return 9;
      case "Oct":
        return 10;
      case "Nov":
        return 11;
      case "Dec":
        return 12;
    }
  };
  const month = getMonth();
  const day = Number(currentDate.toString().split(" ")[2]);

  const assignedPatients = [
    {
      id: "P-102",
      name: "Don José Pérez",
      day: "Lunes",
      schedule: "06:00 - 10:00",
      notes: "Control de medicación matutina",
      phone: "+54 11 5555-1234",
    },
    {
      id: "P-143",
      name: "Sra. Emilia Torres",
      day: "Miércoles",
      schedule: "08:00 - 14:00",
      notes: "Acompañamiento y kinesiología",
      phone: "+54 11 5555-5678",
    },
    {
      id: "P-210",
      name: "Srta. Lucía Gómez",
      day: "Viernes",
      schedule: "06:00 - 12:00",
      notes: "Supervisión de alimentación",
      phone: "+54 11 5555-9012",
    },
    {
      id: "P-178",
      name: "Don Carlos Ramírez",
      day: "Domingo",
      schedule: "10:00 - 16:00",
      notes: "Cuidado postoperatorio",
      phone: "+54 11 5555-3456",
    },
    {
      id: "P-199",
      name: "Sra. Marta Fernández",
      day: "Sábado",
      schedule: "12:00 - 18:00",
      notes: "Asistencia en actividades diarias",
      phone: "+54 11 5555-7890",
    },
    {
      id: "P-225",
      name: "Sr. Alberto Sánchez",
      day: "Jueves",
      schedule: "14:00 - 20:00",
      notes: "Monitoreo de signos vitales",
      phone: "+54 11 5555-2345",
    },
  ];

  const calendarRef = useRef<HTMLElement & { value?: string }>(null);
  const totalPages = Math.max(1, Math.ceil(assignedPatients.length / pageSize));
  const paginatedPatients = assignedPatients.slice(
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

  const rangeValue = range ? `${range.start}/${range.end}` : "";

  return (
    <>
      <section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Pacientes asignados
            </p>
            <h2 className="text-xl font-semibold">
              {assignedPatients.length} guardias programadas esta semana
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
          {calendarOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <calendar-range
                value={rangeValue}
                months={month}
                className="bg-white p-6 rounded-2xl shadow-lg"
                ref={calendarRef as never}
              >
                <calendar-month month={month} className="p-4">
                  <calendar-date
                    date={day}
                    className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
                  ></calendar-date>
                </calendar-month>
                <div className="mt-4 text-sm text-text-accent">
                  {range
                    ? `Rango seleccionado: ${range.start} a ${range.end}`
                    : "Selecciona un rango de fechas"}
                </div>
              </calendar-range>
              <button
                onClick={() => setCalendarOpen(false)}
                className="absolute top-50 right-110 font-bold text-red-500 transition hover:text-red-600 "
              >
                <SquareX size={48} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Día</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {paginatedPatients.map((patient) => (
                <>
                  <tr key={patient.id} className="hover:bg-white/5">
                    <td className="px-4 py-4 hover:bg-accent/20 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientDialogOpen(true);
                        }}
                        className="text-left w-full px-2 py-1 transition"
                      >
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-text-secondary">
                          ID {patient.id}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4">{patient.day}</td>
                    <td className="px-4 py-4">{patient.schedule}</td>
                    <td className="px-4 py-4 text-text-secondary">
                      {patient.notes}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          alert(`Llamando a ${patient.phone}`);
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
            caregiver={caregiver}
            user={user}
          />
        )}
      </section>
    </>
  );
};
