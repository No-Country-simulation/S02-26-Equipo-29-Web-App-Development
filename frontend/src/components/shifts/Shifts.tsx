import type { Shift } from "../../types/index";
import { useShifts } from "../../hooks/patient/useShifts";
import { formatDate, formatTime } from "../../utils/formatDate";
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import { useUser } from "../../hooks";

export const Shifts: React.FC<{ shifts?: Shift[] }> = ({
  shifts: externalShifts,
}) => {
  const { data: user } = useUser();
  const { shifts: hookShifts } = useShifts();
  const { data: caregiverShifts = [] } = useCaregiverShifts();
  const caregiverShiftsList = Array.isArray(caregiverShifts)
    ? caregiverShifts
    : caregiverShifts?.data || [];
  const shiftsToRender =
    externalShifts ||
    (user?.role === "CAREGIVER" ? caregiverShiftsList : hookShifts);

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    return `${formatDate(value)} ${formatTime(value)}`;
  };

  const getStartTime = (shift: Shift) => shift.startTime || shift.start_time;
  const getEndTime = (shift: Shift) => shift.endTime || shift.end_time;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Mis Turnos
        </p>
      </div>

      {/* Lista de turnos */}
      <div className="space-y-4">
        {shiftsToRender.map((shift: Shift) => (
          <article
            key={shift.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">
              {shift.created_by?.full_name || "Turno"}
            </p>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              {user?.role === "CAREGIVER" && (
                <>
                  <p>
                    <span className="font-semibold">Horario:</span>{" "}
                    {formatDateTime(getStartTime(shift))} -{" "}
                    {formatDateTime(getEndTime(shift))}
                  </p>

                  {shift.location && (
                    <p>
                      <span className="font-semibold">Ubicación:</span>{" "}
                      {shift.location}
                    </p>
                  )}
                  {shift.report && (
                    <p>
                      <span className="font-semibold">Notas:</span>{" "}
                      {shift.report}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Estado:</span>{" "}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        shift.status === "PENDING"
                          ? "text-yellow-600 bg-yellow-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {shift.status || "pending"}
                    </span>
                  </p>
                  {shift.caregiver?.full_name && (
                    <p>
                      <span className="font-semibold">Cuidador:</span>{" "}
                      {shift.caregiver.full_name}
                    </p>
                  )}
                </>
              )}

              {user?.role === "PATIENT" && (
                <>
                  <p>
                    <span className="font-semibold">Horario:</span>{" "}
                    {formatDateTime(getStartTime(shift))} -{" "}
                    {formatDateTime(getEndTime(shift))}
                  </p>
                  {shift.location && (
                    <p>
                      <span className="font-semibold">Ubicación:</span>{" "}
                      {shift.location}
                    </p>
                  )}
                  {shift.report && (
                    <p>
                      <span className="font-semibold">Notas:</span>{" "}
                      {shift.report}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Estado:</span>{" "}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        shift.status === "PENDING"
                          ? "text-yellow-600 bg-yellow-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {shift.status || "pending"}
                    </span>
                  </p>
                  {shift.caregiver?.full_name && (
                    <p>
                      <span className="font-semibold">Cuidador:</span>{" "}
                      {shift.caregiver.full_name}
                    </p>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
