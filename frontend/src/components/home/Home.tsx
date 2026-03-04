import { router } from "../../router/router";
import { ButtonGoTo } from "../UI/Button";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Operación unificada",
    description:
      "Pacientes, cuidadores, guardias y documentos viven en un único flujo digital, sin saltar entre Excel y chats.",
  },
  {
    title: "Trazabilidad real",
    description:
      "Cada acción queda registrada: quién cargó horas, quién aprobó y cuándo, con visibilidad para toda la operación.",
  },
  {
    title: "Liquidación más rápida",
    description:
      "Horas e informes se consolidan automáticamente para llegar al cierre mensual con menos fricción administrativa.",
  },
];

const processSteps = [
  {
    title: "1. Alta y validación",
    description: "Registrás cuidadores y pacientes con documentación ordenada y estado claro.",
  },
  {
    title: "2. Asignación y guardias",
    description: "Asignás cuidador-paciente y cargás horas e informes por turno desde cualquier dispositivo.",
  },
  {
    title: "3. Aprobación y control",
    description: "Administración y familia validan lo cargado con historial y trazabilidad de punta a punta.",
  },
  {
    title: "4. Cierre operativo",
    description: "Obtenés resúmenes confiables por cuidador, paciente o período para liquidar sin caos.",
  },
];

const roleBenefits = [
  {
    role: "Administración",
    benefit: "Ordena la operación diaria y reduce tiempos en aprobaciones y liquidaciones.",
  },
  {
    role: "Cuidadores",
    benefit: "Cargan horas e informes en un flujo simple, sin doble trabajo ni mensajes sueltos.",
  },
  {
    role: "Familias",
    benefit: "Acceden a información clara del cuidado y aprobaciones con mayor transparencia.",
  },
];

const scopeItems = [
  "Autenticación y acceso por roles (Admin / Cuidador / Familia)",
  "Gestión de pacientes y cuidadores con documentación",
  "Asignaciones cuidador-paciente",
  "Carga de horas + informe por guardia",
  "Aprobación de guardias",
  "Reportes operativos base por cuidador, paciente o período",
];

export const Home = () => {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="relative isolate overflow-hidden px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-primary-hover via-primary to-primary opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-[0.3em] uppercase backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Plataforma de Gestión de Cuidados · MVP
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <p className="text-sm text-white/70">Más control, menos caos operativo</p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Gestioná cuidadores, pacientes y guardias en una sola plataforma, con trazabilidad y foco en resultados.
              </h1>
              <p className="text-lg text-white/80">
                Diseñamos este producto para reemplazar procesos manuales y dispersos por un flujo digital claro: alta,
                asignación, carga, aprobación y cierre. El equipo gana tiempo, reduce errores y mejora la experiencia de todos los roles.
              </p>

              <div className="flex flex-wrap gap-3">
                <ButtonGoTo
                  content="Probar ahora"
                  onClick={() => {
                    router.navigate("/login");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:opacity-95"
                />
                <span className="inline-flex items-center rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur">
                  Sin instalación · Acceso web · En minutos
                </span>
              </div>

              <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold text-white">3</p>
                  <p>Roles operativos alineados en el mismo flujo</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold text-white">24/7</p>
                  <p>Carga y control de guardias desde cualquier dispositivo</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold text-white">0</p>
                  <p>Fuente de verdad para operación y seguimiento</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-white/80">Qué podés resolver hoy</h2>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {scopeItems.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60">Siguiente iteración</p>
              <p className="mt-2 text-sm text-white/70">
                Automatizaciones financieras y métricas avanzadas para escalar la gestión.
              </p>
              <button
                onClick={() => {
                  router.navigate("/login");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Empezar demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">Beneficios clave</p>
            <h2 className="mt-3 text-3xl font-semibold">Por qué este producto acelera tu operación</h2>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {highlights.map((card) => (
            <article
              key={card.title}
              className="group rounded-3xl border border-border bg-surface p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                {card.title === "Operación unificada" && <Users className="h-5 w-5" />}
                {card.title === "Trazabilidad real" && <ShieldCheck className="h-5 w-5" />}
                {card.title === "Liquidación más rápida" && <ClipboardCheck className="h-5 w-5" />}
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">Resultado</p>
              <h3 className="mt-3 text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-text-secondary">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
                Cómo funciona
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                Un flujo de punta a punta para reemplazar procesos manuales.
              </h2>
              <p className="mt-4 text-text-secondary">
                Desde el alta documental hasta el reporte final, cada etapa queda conectada para dar contexto operativo y control administrativo.
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-background p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
                  Etapas del flujo
                </p>
                <ul className="mt-4 space-y-3 text-sm text-text-primary">
                  {processSteps.map((step) => (
                    <li key={step.title} className="flex gap-3">
                      <div className="mt-0.5 rounded-lg bg-primary/10 p-1.5 text-primary">
                        {step.title.startsWith("1") && <Stethoscope className="h-4 w-4" />}
                        {step.title.startsWith("2") && <Users className="h-4 w-4" />}
                        {step.title.startsWith("3") && <ShieldCheck className="h-4 w-4" />}
                        {step.title.startsWith("4") && <CalendarClock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-text-secondary">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-background p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">Para cada rol</p>
                <ul className="mt-4 space-y-3 text-sm text-text-primary">
                  {roleBenefits.map((item) => (
                    <li key={item.role} className="flex gap-3">
                      <div className="mt-0.5 rounded-lg bg-primary/10 p-1.5 text-primary">
                        {item.role === "Administración" && <ClipboardCheck className="h-4 w-4" />}
                        {item.role === "Cuidadores" && <HeartHandshake className="h-4 w-4" />}
                        {item.role === "Familias" && <Users className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.role}</p>
                        <p className="text-text-secondary">{item.benefit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-white p-6 shadow-xl">
                <h3 className="text-xl font-semibold">Listo para empezar hoy</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  El MVP prioriza el núcleo operativo para generar impacto rápido desde la primera semana de uso.
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-text-secondary">
                  Próximo paso
                </p>
                <p className="mt-2 text-sm text-text-primary">
                  Ingresá, probá el flujo de guardias y validá con tu equipo la mejora en tiempos de gestión.
                </p>

                <ButtonGoTo
                  content="Ir a login"
                  onClick={() => {
                    router.navigate("/login");
                  }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                />
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-text-secondary">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Activación rápida para equipos de cuidado
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};