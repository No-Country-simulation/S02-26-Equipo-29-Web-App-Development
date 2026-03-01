import { ArrowRight, Clock, PersonStanding, Star, TrendingDown, TrendingUp, Users2} from "lucide-react";
import { useDashboard } from "../../hooks";
import { formatDateSafe, formatTime } from "../../utils/formatDate";
import { getStatusColorShift, translateStatusShift } from "../../utils/status";
import { Link } from "react-router-dom";
import type { Shift } from "../../types";

export function PanelAdmin() {


  const {data: dashboard, isLoading, error} = useDashboard()

    const cards = [
    {
      title: "Total de pacientes",
      value: dashboard?.patients.total || 0,
      icon: <Users2 />,
      percentage: dashboard?.patients.growth || 0,
      className: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Total de cuidadores",
      value: dashboard?.caregivers.total || 0,
      icon: <PersonStanding />,
      percentage: dashboard?.caregivers.growth || 0,
      className: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Horas este mes",
      value: dashboard?.hours.hours || 0,
      icon: <Clock />,
      percentage: dashboard?.hours.growth || 0,
      className: "text-orange-500 bg-orange-500/10",
    },
    {
      title: "Satisfacción",
      icon: <Star />,
      value: dashboard?.ratings.ratings || 0,
      percentage: dashboard?.ratings.growth || 0,
      className: "text-yellow-500 bg-yellow-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-background pt-5 px-5 animate-pulse">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <div className="h-7 w-56 rounded-xl bg-border mb-2" />
          <div className="h-4 w-40 rounded-xl bg-border" />
        </header>

        {/* Skeleton cards */}
        <section className="flex gap-4 my-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-62.5 flex-1">
              <div className="h-10 w-10 rounded-2xl bg-border mb-4" />
              <div className="h-4 w-32 rounded-xl bg-border mb-2" />
              <div className="h-7 w-16 rounded-xl bg-border" />
            </div>
          ))}
        </section>

        {/* Skeleton table */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-full">
          <div className="h-6 w-64 rounded-xl bg-border mb-6" />
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="bg-background px-4 py-3 flex gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-20 rounded-xl bg-border" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-8 px-4 py-4 border-t border-border">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-4 w-32 rounded-xl bg-border" />
                  <div className="h-3 w-16 rounded-xl bg-border" />
                </div>
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="flex gap-2 flex-1">
                  <div className="h-8 w-20 rounded-2xl bg-border" />
                  <div className="h-8 w-20 rounded-2xl bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="bg-background pt-5 px-5">
      <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">

        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Panel Administrativo
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Información general del sistema
        </p>
      </header>

      {/* Seccion de cards */}
      <section className="flex gap-4 my-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative rounded-3xl border border-border bg-surface p-6 shadow-lg w-62.5"
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
              {card.title === "Satisfacción" && card.percentage > 0 ? (
                <TrendingUp />
              ) : card.title === "Satisfacción" && card.percentage < 0 ? (
                <TrendingDown />
              ) : (
                <>
                  {card.percentage > 0 ? "+" : ""} {card.percentage}%
                </>
              )}
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
          <Link to="/appointments" className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
            <span className="whitespace-nowrap">Gestionar horas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl p-2 justify-between mt-5">
          <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background text-left text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Paciente</th>
                  <th className="px-4 py-3 font-medium">Día</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium">Servicio</th>
                  <th className="px-4 py-3 font-medium">Cuidador</th> 
                  <th className="px-4 py-3 font-medium">Estado</th>
                
                
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
              {dashboard?.shifts.map((shift: Shift) => (
                <tr key={shift.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                        {shift.patient.profile?.full_name.charAt(0) || "U"}
                      </div>
                      <p className="font-semibold text-text-primary">{shift.patient.profile?.full_name || "N/A"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-text-secondary">{formatDateSafe(shift.start_time || "")}</p>
                  </td>
                  <td className="px-6 py-5 text-text-secondary">
                    {formatTime(shift.start_time || "")} - {formatTime(shift.end_time || "")}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-text-primary">{shift.service || "General"}</span>
                  </td>
                <td className="px-6 py-5">
                    <span className="text-text-primary">Sin asignar</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusColorShift(shift.status)}`}>
                      {translateStatusShift(shift.status)}
                    </span>
                  </td>
                
                </tr>
              ))
            }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
