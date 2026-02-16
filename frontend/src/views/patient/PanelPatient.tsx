import { Link } from "react-router-dom";
import { Patient } from "../../components/patient/patient";


export function PanelPatient() {
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
    <div className="p-5 bg-background h-screen">
      <header className="rounded-3xl border border-border p-6 bg-surface  shadow-lg">
        <h1 className="text-2xl font-bold ">Dashboard del paciente</h1>
        <p className="text-gray-400">Gestiona tus cuidados</p>
      </header>

      <div className="flex justify-end">
        <Link
          to="/patient/schedule"
         className="rounded-2xl border bg-primary text-white border-border px-4 py-2 text-sm font-medium hover:bg-primary/80 mt-5 cursor-pointer" >
          Agendar visita
        </Link>
      </div>

       <div>
        <Patient patient={patient} />
      </div> 

      <section className="grid gap-6 lg:grid-cols-2 mt-5">
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
    </div>
  )
}
