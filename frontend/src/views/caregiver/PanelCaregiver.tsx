
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import type { User } from "../../types";
import { formatDateSafe, formatTime } from "../../utils/formatDate";
import { Agenda } from "./AgendaCaregiver";
import { CaregiverInfo } from "./CaregiverInfo";


export const PanelCaregiver = ({user}: {user: User}) => {
  const { data: shifts } = useCaregiverShifts();

  
  return (
    <main className="min-h-screen flex-1 bg-background px-4 py-8 text-text-primary lg:px-8">
      <section className="mx-auto w-full max-w-5xl space-y-8">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Panel cuidador
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{user.full_name}</h1>
              <p className="text-sm text-text-secondary">
                {user.role}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-5 py-3 text-sm text-primary">
            {
              shifts?.data.length > 0 ? (
                <>
                  Próximo turno asignado: {formatDateSafe(shifts?.data[0].start_time)} {formatTime(shifts?.data[0].start_time)} - {formatTime(shifts?.data[0].end_time)}
                </>
              ) : (
                <>
                  No tienes turnos asignados
                </>
              )
            }  
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {user.email}
          </p>
        </header>

        <div className="w-full">
          <Agenda />
        </div>
        
        <section className="mt-8 w-full space-y-8">
            <CaregiverInfo />
        </section>

        
      </section>
      
    </main>
  );
};