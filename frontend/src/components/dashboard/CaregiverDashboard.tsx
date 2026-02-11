import CaregiverView from "../../views/caregiver/caregiver";
import { Patient } from "../patient/patient";
import { useState } from "react";

export const CaregiverDashboard = ({ user }: { user: any }) => {
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof assignedPatients)[number] | null
  >(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const caregiver = {
    name: user ? user.full_name : "Cuidador Desconocido",
    role: user ? user.role : "Rol desconocido",
    email: user ? user.email : "Desconocido",
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
      <section className="mx-auto max-w-5xl space-y-8 mt-8">
        <CaregiverView caregiver={caregiver} />
      </section>
    </main>
  );
};
