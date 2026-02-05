import { router } from "../../router/router";
import { ButtonGoTo } from "../UI/Button";

const highlights = [
  {
    title: "Operación centralizada",
    description:
      "Adiós a planillas y chats dispersos: una sola plataforma concentra pacientes, cuidadores y guardias.",
  },
  {
    title: "Trazabilidad total",
    description:
      "Cada hora cargada y aprobada deja rastro, facilitando auditorías y transparencia para la familia.",
  },
  {
    title: "Liquidaciones ágiles",
    description:
      "El sistema calcula horas y genera resúmenes listos para la liquidación mensual en minutos.",
  },
];

const specificObjectives = [
  "Digitalizar alta y validación documental de cuidadores",
  "Permitir carga de horas e informes por guardia",
  "Centralizar información por paciente",
  "Mejorar trazabilidad y auditoría de horas",
  "Reducir tiempos administrativos en liquidaciones",
];

const scopeItems = [
  "Registro / autenticación de usuarios",
  "Roles y permisos (Admin / Cuidador / Familia)",
  "ABM de pacientes y cuidadores con documentación",
  "Asignaciones cuidador ↔ paciente",
  "Carga y aprobación de guardias (horas + informe)",
  "Reportes básicos por cuidador, paciente o período",
];

export const Home = () => {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <section className="relative isolate overflow-hidden px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[var(--color-primary)] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-5xl text-white">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-[0.3em] uppercase">
            MVP · Plataforma Gestión
          </div>

            <div className="inline-flex items-center gap-3 m-2 rounded-full border border-white/20 bg-white/10 hover:bg-accent/40 px-4 py-2 text-xs tracking-[0.3em] uppercase">
              <ButtonGoTo content="Ingresa o Registrate" className="" onClick={() => {router.navigate("/login")}} />
            </div>
              
          <div className="mt-8 grid gap-12 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <p className="text-sm text-white/70">Resumen ejecutivo</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Digitalizamos la gestión de acompañantes, pacientes y liquidaciones en un solo lugar.
              </h1>
              <p className="text-lg text-white/80">
                La organización hoy opera con Excel y WhatsApp, lo que dificulta el control de guardias, horas y aprobaciones.
                Este MVP propone una experiencia web/móvil centralizada que absorbe la operación diaria y automatiza procesos críticos.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <div>
                  <p className="text-3xl font-semibold text-white">+3</p>
                  <p>Roles soportados (Admin, Cuidador, Familia)</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">24/7</p>
                  <p>Control y carga de guardias desde cualquier dispositivo</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">0</p>
                  <p>Dependencia de planillas y chats dispersos</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-white/80">Incluido en el MVP</h2>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {scopeItems.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60">Evoluciones futuras</p>
              <p className="mt-2 text-sm text-white/70">
                Pagos automáticos y métricas avanzadas quedan planificados para la siguiente versión.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {highlights.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">Impacto</p>
              <h3 className="mt-3 text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-[var(--color-text-secondary)]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                Objetivo general
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                Plataforma centralizada que gestiona pacientes, cuidadores, guardias y automatiza la liquidación mensual.
              </h2>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Todo el ciclo operativo vive en la misma herramienta, reduciendo errores manuales y acelerando la aprobación administrativa.
              </p>
              <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                  Objetivos específicos
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-primary)]">
                  {specificObjectives.map((objective) => (
                    <li key={objective} className="flex gap-3">
                      <span className="mt-2 h-[6px] w-[6px] rounded-full bg-[var(--color-primary)]" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">Alcance</p>
                <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-primary)]">
                  {scopeItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-[6px] w-[6px] rounded-full bg-[var(--color-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-xl">
                <h3 className="text-xl font-semibold">Lo que dejamos fuera del MVP</h3>
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  Pagos automáticos y métricas avanzadas permanecen en backlog estratégico para liberar valor rápido en esta primera iteración.
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                  Próximos pasos
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-primary)]">
                  Validar el MVP con usuarios clave, ajustar flujo de aprobaciones y sumar automatizaciones financieras en la siguiente release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};