import { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { Patient } from "../patient/patient";
import { AdminDashboard } from "./AdminDashboard";
import { useRole } from "../../context/RoleContext";

export const MainDashboard = () => {
  const { role } = useRole();

  return (
    <div className="flex">
      <Sidebar />

      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "caregiver" ? (
        <CaregiverDashboard />
      ) : (
        <FamilyDashboard />
      )}
    </div>
  );
};

export const CaregiverDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof assignedPatients)[number] | null
  >(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const caregiver = {
    name: "María López",
    role: "Cuidadora Senior",
    email: "maria.lopez@empresa.com",
    shiftRange: "06:00 - 14:00",
  };

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
  ];

  return (
    <main className="min-h-screen bg-background p-8 text-text-primary w-auto flex-1">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Panel cuidador
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{caregiver.name}</h1>
              <p className="text-sm text-text-secondary">{caregiver.role}</p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-5 py-3 text-sm text-primary">
              Turno asignado: {caregiver.shiftRange}
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{caregiver.email}</p>
        </header>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
                Pacientes asignados
              </p>
              <h2 className="text-xl font-semibold">
                {assignedPatients.length} guardias programadas esta semana
              </h2>
            </div>
            <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">
              Ver calendario completo
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background text-left text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Paciente</th>
                  <th className="px-4 py-3 font-medium">Día</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {assignedPatients.map((patient) => (
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
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      {selectedPatient && (
        <Patient
          open={patientDialogOpen}
          onClose={() => setPatientDialogOpen(false)}
          patient={selectedPatient}
          caregiver={caregiver}
        />
      )}
    </main>
  );
};

export const FamilyDashboard = () => {
  const patient = {
    id: "P-210",
    name: "Srta. Lucía Gómez",
    age: 72,
    condition: "Seguimiento post operatorio",
    caregiver: {
      name: "Juan Fernández",
      shiftRange: "14:00 - 22:00",
      phone: "+54 11 5555-9988",
    },
    nextVisits: [
      {
        day: "Miércoles",
        schedule: "14:00 - 20:00",
        focus: "Control de movilidad",
      },
      {
        day: "Viernes",
        schedule: "16:00 - 20:00",
        focus: "Supervisión medicación",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background p-8 text-text-primary w-auto flex-1">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Panel familia
          </p>
          <h1 className="mt-3 text-2xl font-semibold">{patient.name}</h1>
          <p className="text-sm text-text-secondary">
            ID {patient.id} · {patient.age} años · {patient.condition}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Cuidador asignado
            </p>
            <h2 className="mt-3 text-xl font-semibold">
              {patient.caregiver.name}
            </h2>
            <p className="text-sm text-text-secondary">
              Turno: {patient.caregiver.shiftRange}
            </p>
            <p className="mt-4 text-sm">
              Teléfono de contacto:{" "}
              <span className="font-medium text-primary">
                {patient.caregiver.phone}
              </span>
            </p>
          </article>

          <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-auto flex-1">
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Próximas visitas
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {patient.nextVisits.map((visit) => (
                <li
                  key={`${visit.day}-${visit.schedule}`}
                  className="rounded-2xl border border-border bg-background px-4 py-3"
                >
                  <p className="text-base font-semibold">{visit.day}</p>
                  <p className="text-text-secondary">{visit.schedule}</p>
                  <p className="mt-1">{visit.focus}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
};
