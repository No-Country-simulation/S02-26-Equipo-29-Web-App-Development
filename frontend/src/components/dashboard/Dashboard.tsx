import { Sidebar } from "../sidebar/Sidebar";
import { useUser } from "../../context/UserContext";
import { AdminDashboard } from "./AdminDashboard";
import { CaregiverDashboard } from "./CaregiverDashboard";

export const MainDashboard = () => {
  const { user } = useUser();

  return (
    <div className="flex">
      <Sidebar />

      {user?.role === "ADMIN" ? (
        <AdminDashboard />
      ) : user?.role === "CAREGIVER" ? (
        <CaregiverDashboard user={user} />
      ) : (
        <FamilyDashboard />
      )}
    </div>
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
