import { useState } from "react";
export function PatientSchedule() {
  const [dates, setDates] = useState<Date[] | undefined>([]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-5 bg-background h-screen">
      <header className="rounded-3xl border border-border p-6 bg-surface shadow-lg">
        <h1 className="text-2xl font-bold">Agendar visita</h1>
        <p className="text-gray-400">Selecciona una fecha y hora</p>
      </header>

      <div className="w-full mt-5 rounded-3xl border border-border p-6 bg-surface shadow-lg">
        {dates && dates.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              {dates.length === 1
                ? "Fecha seleccionada"
                : "Fechas seleccionadas"}
            </p>
            {dates.map((date, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl border border-border bg-background"
              >
                <p className="text-lg font-semibold text-primary capitalize">
                  {formatDate(date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
