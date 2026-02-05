import { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";

export const MainDashboard = () => {

const [userRole, setUserRole] = useState<"admin" | "caregiver" | "family">("family");

  return (
    <div>
      <Sidebar />
      <button onClick={() => setUserRole("caregiver")} className="flex mb-2 left-4 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white transition hover:bg-[var(--color-primary-hover)]">
        Cambiar rol a Cuidador
      </button>
      <button onClick={() => setUserRole("family")} className="flex mb-2 left-16 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white transition hover:bg-[var(--color-primary-hover)]">
        Cambiar rol a Familiar
      </button>
      <button onClick={() => setUserRole("admin")} className="flex mb-2 left-24 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white transition hover:bg-[var(--color-primary-hover)]">
        Cambiar rol a Administrador
      </button> 
        {userRole === "admin" ? <AdminDashboard /> : userRole === "caregiver" ? <CaregiverDashboard /> : <FamilyDashboard />}
    </div>
  );
}

export const CaregiverDashboard = () => {
    
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
    },
    {
      id: "P-143",
      name: "Sra. Emilia Torres",
      day: "Miércoles",
      schedule: "08:00 - 14:00",
      notes: "Acompañamiento y kinesiología",
    },
    {
      id: "P-210",
      name: "Srta. Lucía Gómez",
      day: "Viernes",
      schedule: "06:00 - 12:00",
      notes: "Supervisión de alimentación",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] p-8 text-[var(--color-text-primary)]">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
            Panel cuidador
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{caregiver.name}</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">{caregiver.role}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-primary)]/10 px-5 py-3 text-sm text-[var(--color-primary)]">
              Turno asignado: {caregiver.shiftRange}
            </div>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{caregiver.email}</p>
        </header>

        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                Pacientes asignados
              </p>
              <h2 className="text-xl font-semibold">
                {assignedPatients.length} guardias programadas esta semana
              </h2>
            </div>
            <button className="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)]">
              Ver calendario completo
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
            <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
              <thead className="bg-[var(--color-background)] text-left text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Paciente</th>
                  <th className="px-4 py-3 font-medium">Día</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
                {assignedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        ID {patient.id}
                      </p>
                    </td>
                    <td className="px-4 py-4">{patient.day}</td>
                    <td className="px-4 py-4">{patient.schedule}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">
                      {patient.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
};

export const AdminDashboard = () => {
  const caregivers = [
    {
      id: "C-01",
      name: "María López",
      shiftRange: "06:00 - 14:00",
      patients: [
        { id: "P-102", name: "Don José Pérez", day: "Lunes", schedule: "06:00 - 10:00" },
        { id: "P-143", name: "Sra. Emilia Torres", day: "Martes", schedule: "10:00 - 14:00" },
      ],
    },
    {
      id: "C-02",
      name: "Juan Fernández",
      shiftRange: "14:00 - 22:00",
      patients: [
        { id: "P-210", name: "Srta. Lucía Gómez", day: "Miércoles", schedule: "14:00 - 20:00" },
      ],
    },
  ];

  const handleEditShift = (caregiverId: string, patientId: string) => {
    console.log(`Editar turno para cuidador ${caregiverId} y paciente ${patientId}`);
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] p-8 text-[var(--color-text-primary)]">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">Panel admin</p>
          <h1 className="mt-3 text-2xl font-semibold">
            {caregivers.length} cuidadores activos · {caregivers.reduce((acc, c) => acc + c.patients.length, 0)} pacientes asignados
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Administra asignaciones y ajusta turnos en tiempo real.
          </p>
        </header>

        <div className="space-y-6">
          {caregivers.map((caregiver) => (
            <article
              key={caregiver.id}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                    Cuidador {caregiver.id}
                  </p>
                  <h2 className="text-xl font-semibold">{caregiver.name}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">Turno base: {caregiver.shiftRange}</p>
                </div>
                <span className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm">
                  {caregiver.patients.length} pacientes asignados
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
                  <thead className="bg-[var(--color-background)] text-left text-[var(--color-text-secondary)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Paciente</th>
                      <th className="px-4 py-3 font-medium">Día</th>
                      <th className="px-4 py-3 font-medium">Horario</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
                    {caregiver.patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-white/5">
                        <td className="px-4 py-4">
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">ID {patient.id}</p>
                        </td>
                        <td className="px-4 py-4">{patient.day}</td>
                        <td className="px-4 py-4">{patient.schedule}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleEditShift(caregiver.id, patient.id)}
                            className="rounded-2xl bg-[var(--color-primary)] px-3 py-2 text-xs font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
                          >
                            Editar shift
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      </section>
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
      { day: "Miércoles", schedule: "14:00 - 20:00", focus: "Control de movilidad" },
      { day: "Viernes", schedule: "16:00 - 20:00", focus: "Supervisión medicación" },
    ],
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] p-8 text-[var(--color-text-primary)]">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
            Panel familia
          </p>
          <h1 className="mt-3 text-2xl font-semibold">{patient.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            ID {patient.id} · {patient.age} años · {patient.condition}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
              Cuidador asignado
            </p>
            <h2 className="mt-3 text-xl font-semibold">{patient.caregiver.name}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Turno: {patient.caregiver.shiftRange}
            </p>
            <p className="mt-4 text-sm">
              Teléfono de contacto:{" "}
              <span className="font-medium text-[var(--color-primary)]">{patient.caregiver.phone}</span>
            </p>
          </article>

          <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
              Próximas visitas
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {patient.nextVisits.map((visit) => (
                <li key={`${visit.day}-${visit.schedule}`} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3">
                  <p className="text-base font-semibold">{visit.day}</p>
                  <p className="text-[var(--color-text-secondary)]">{visit.schedule}</p>
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