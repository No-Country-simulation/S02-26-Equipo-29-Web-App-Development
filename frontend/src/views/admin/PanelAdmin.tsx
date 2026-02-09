import {
  ArrowRight,
  Clock,
  PersonStanding,
  Plus,
  Star,
  Users2,
} from "lucide-react";

export function PanelAdmin() {
  const caregivers = [
    {
      id: "C-01",
      name: "María López",
      shiftRange: "06:00 - 14:00",
      patients: [
        {
          id: "P-102",
          name: "Don José Pérez",
          day: "Lunes",
          schedule: "06:00 - 10:00",
        },
        {
          id: "P-143",
          name: "Sra. Emilia Torres",
          day: "Martes",
          schedule: "10:00 - 14:00",
        },
      ],
    },
    {
      id: "C-02",
      name: "Juan Fernández",
      shiftRange: "14:00 - 22:00",
      patients: [
        {
          id: "P-210",
          name: "Srta. Lucía Gómez",
          day: "Miércoles",
          schedule: "14:00 - 20:00",
        },
      ],
    },
  ];

  const cards = [
    {
      title: "Total de pacientes",
      value: caregivers.reduce((acc, c) => acc + c.patients.length, 0),
      icon: <Users2 />,
      percentage: 8,
      className: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Total de cuidadores",
      value: caregivers.length,
      icon: <PersonStanding />,
      percentage: 8,
      className: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Horas este mes",
      value: "160",
      icon: <Clock />,
      percentage: 8,
      className: "text-orange-500 bg-orange-500/10",
    },
    {
      title: "Satisfacción",
      value: "4/5",
      icon: <Star />,
      percentage: 8,
      className: "text-yellow-500 bg-yellow-500/10",
    },
  ];

  const patients = [
    {
      id: "P-102",
      name: "Don José Pérez",
      day: "Lunes",
      schedule: "06:00 - 10:00",
    },
    {
      id: "P-143",
      name: "Sra. Emilia Torres",
      day: "Martes",
      schedule: "10:00 - 14:00",
    },
    {
      id: "P-210",
      name: "Srta. Lucía Gómez",
      day: "Miércoles",
      schedule: "14:00 - 20:00",
    },
  ];

  return (
    <>
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <h1 className="text-2xl font-bold ">Panel Administrativo</h1>
        <p className="text-gray-400">Información general del sistema</p>
      </header>

      <div className="flex justify-end">
        <button className="cursor-pointer rounded-2xl flex items-center gap-2 bg-primary px-4 py-2  font-medium text-white transition hover:bg-primary-hover">
          <Plus /> Agregar cuidador
        </button>
      </div>

      {/* Seccion de cards */}
      <section className="flex gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative rounded-3xl border border-border bg-surface p-6 shadow-lg w-[250px]"
          >
            <div className={`p-2 rounded-2xl w-fit ${card.className}`}>
              {card.icon}
            </div>
            <div
              className={`absolute top-5 right-5 text-white   rounded-2xl px-2 text-xs w-fit ${
                card.percentage > 0
                  ? "text-green-400 bg-green-400/50"
                  : "text-red-400 bg-red-400/50"
              }`}
            >
              {card.percentage > 0 ? "+" : ""} {card.percentage}%
            </div>
            <p className="whitespace-nowrap text-xl">{card.title}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Seccion de Horas pendientes de aprobacion */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-full">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Clock className="h-6 w-6 text-primary" /> Horas pendientes de
            aprobación
          </h2>
          <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
            <span className="whitespace-nowrap">Gestionar horas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl p-2 justify-between mt-5">
          <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background text-left text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Paciente</th>
                  <th className="px-4 py-3 font-medium">Día</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {patients.map((patient, index) => (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-text-secondary">
                        {patient.id}
                      </p>
                    </td>
                    <td className="px-4 py-4">{patient.day}</td>
                    <td className="px-4 py-4">{patient.schedule}</td>
                    <td className="px-4 py-4 flex gap-2 justify-center">
                      <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                        Aprobar
                      </button>
                      <button className="cursor-pointer hover:bg-red-600 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
