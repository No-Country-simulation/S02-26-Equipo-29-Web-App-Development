import { formatDateSafe, formatTime } from "../../utils/formatDate";
import type { User } from "../../types";

interface HeaderProps {
  user: User;
  shifts?: any[];
}

export const Header: React.FC<HeaderProps> = ({ user, shifts }) => {
  const shiftList = Array.isArray(shifts) ? shifts : shifts?.data || [];
  const nextShift = shiftList[shiftList.length - 1]; // Assuming the last shift is the next one
  const nextShiftStart = nextShift?.start_time || nextShift?.startTime;
  const nextShiftEnd = nextShift?.end_time || nextShift?.endTime;

  return (
    <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            {user?.role === "CAREGIVER" ? "Panel cuidador" : "Panel paciente"}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl font-semibold">{user?.full_name ?? "Usuario"}</h1>
            <p className="text-sm text-text-secondary">
            {user?.role === "CAREGIVER" ? "Cuidador" : "Paciente"}
            </p>
        </div>
        <div className="rounded-2xl bg-primary/10 px-5 py-3 text-sm text-primary">
        {
            nextShift ? (
            <>
                Próximo turno asignado: {formatDateSafe(nextShiftStart)} {formatTime(nextShiftStart)} - {formatTime(nextShiftEnd)}
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
        {user?.email ?? ""}
        </p>
    </header>
    );
};