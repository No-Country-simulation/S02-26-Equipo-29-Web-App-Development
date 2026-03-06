import { Circle, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { useShifts } from "../../hooks";
import { formatDateSafe, formatTime } from "../../utils/formatDate";
import { getStatusColorShift, translateStatusShift } from "../../utils/status";
import type { Shift } from "../../types";
import { updateShiftStatus } from "../../api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pagination } from "../../components/UI/Pagination";
import { takeFirstLetters } from "../../utils/firstLetters";

import {
  AdminHeaderSkeleton,
  AdminTableSkeleton,
} from "../../components/UI/Skeleton";

import { AssignCaregiverModal } from "../../components/admin/AssignCaregiverModal";

export function Appointments() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedShiftForAssignment, setSelectedShiftForAssignment] =
    useState<Shift | null>(null);

  const [filter, setFilter] = useState("PENDING");
  const {
    data: shiftsData,
    isLoading,
    isError,
  } = useShifts(page, limit, filter);

  if (isLoading) {
    return (
      <div className="p-5 bg-background space-y-6">
        <AdminHeaderSkeleton titleWidth="w-80" subtitleWidth="w-96" />
        <div className="h-12 w-96 rounded-2xl bg-border animate-pulse" />
        <AdminTableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  if (isError) {
    return <div>Error...</div>;
  }

  const shifts = shiftsData?.data || [];

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateShiftStatus(id, status);
      toast.success("Turno confirmado correctamente");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al confirmar el turno");
      }
    }
  };
  return (
    <div className="p-5 bg-background min-h-screen">
      <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Calendario de cuidados
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Gestionar los cuidados de los pacientes
        </p>
      </header>

      {/* Filtros */}
      <div className="mt-5 rounded-3xl border border-border bg-surface p-4 md:p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
            <h2 className="text-lg font-semibold whitespace-nowrap">
              Filtrar por:
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`cursor-pointer transition-all duration-200 hover:bg-primary hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium ${
                  filter === "ALL"
                    ? "bg-primary text-white border-primary"
                    : "text-text-secondary"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter("PENDING")}
                className={`cursor-pointer transition-all duration-200 hover:bg-yellow-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "PENDING"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50"
                    : "text-text-secondary"
                }`}
              >
                <Circle
                  className={`w-2 h-2 ${
                    filter === "PENDING"
                      ? "fill-yellow-500"
                      : "fill-yellow-500/50"
                  }`}
                />
                <span className="hidden xs:inline">Pendientes</span>
                <span className="xs:hidden">Pend.</span>
              </button>
              <button
                onClick={() => setFilter("ASSIGNED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-green-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "ASSIGNED"
                    ? "bg-green-500/10 text-green-500 border-green-500/50"
                    : "text-text-secondary"
                }`}
              >
                <Circle
                  className={`w-2 h-2 ${
                    filter === "ASSIGNED"
                      ? "fill-green-500"
                      : "fill-green-500/50"
                  }`}
                />
                <span className="hidden xs:inline">Asignadas</span>
                <span className="xs:hidden">Asig.</span>
              </button>
              <button
                onClick={() => setFilter("CANCELLED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-red-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "CANCELLED"
                    ? "bg-red-500/10 text-red-500 border-red-500/50"
                    : "text-text-secondary"
                }`}
              >
                <Circle
                  className={`w-2 h-2 ${
                    filter === "CANCELLED" ? "fill-red-500" : "fill-red-500/50"
                  }`}
                />
                <span className="hidden xs:inline">Canceladas</span>
                <span className="xs:hidden">Canc.</span>
              </button>
              <button
                onClick={() => setFilter("COMPLETED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-primary/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "COMPLETED"
                    ? "bg-primary/10 text-primary border-primary/50"
                    : "text-text-secondary"
                }`}
              >
                <Circle
                  className={`w-2 h-2 ${
                    filter === "COMPLETED" ? "fill-primary" : "fill-primary/50"
                  }`}
                />
                <span className="hidden xs:inline">Completadas</span>
                <span className="xs:hidden">Compl.</span>
              </button>
            </div>
          </div>
          <button className="w-full lg:w-auto whitespace-nowrap cursor-pointer rounded-2xl flex items-center justify-center gap-2 bg-primary px-5 py-2.5 font-semibold text-white transition-all shadow-md hover:bg-primary-hover hover:scale-[1.02] lg:hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" /> Agendar cuidado
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-inner">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background/50 text-left text-text-secondary uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider text-center ">
                  Paciente
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Fecha
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Horario
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Notas
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Cuidador
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Estado
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border whitespace-nowrap">
              {shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="hover:bg-primary/5 transition-all group"
                >
                  <td className="px-6 py-5 ">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-primary/10 group-hover:scale-105 transition-transform">
                        {takeFirstLetters(
                          shift.patient.profile?.full_name || "",
                        )}
                      </div>
                      <p className="font-bold text-base group-hover:text-primary transition-colors italic">
                        {shift.patient.profile?.full_name || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <p className="text-text-secondary  whitespace-nowrap">
                      {formatDateSafe(shift.start_time || "")}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center text-text-secondary  whitespace-nowrap">
                    {formatTime(shift.start_time || "")} -{" "}
                    {formatTime(shift.end_time || "")}
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <span className="text-text-primary">
                      {shift.service || "general"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {shift.caregiver ? (
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-text-secondary text-sm">
                          {shift.caregiver?.profile?.full_name}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedShiftForAssignment(shift)}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group w-full max-w-[140px] justify-center"
                      >
                        <Plus
                          size={14}
                          className="group-hover:rotate-90 transition-transform"
                        />
                        Asignar
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ring-1 ring-inset ${getStatusColorShift(
                        shift.status,
                      )}`}
                    >
                      {translateStatusShift(shift.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        disabled={shift.status !== "PENDING"}
                        onClick={() => handleUpdateStatus(shift.id, "ASSIGNED")}
                        className="p-3 transition-all duration-200 rounded-xl border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-90 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed group-hover:scale-110"
                        title="Aprobar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        disabled={shift.status !== "PENDING"}
                        onClick={() => handleUpdateStatus(shift.id, "REJECTED")}
                        className="p-3 transition-all duration-200 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-90 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed group-hover:scale-110"
                        title="Rechazar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <p className="text-text-secondary">
                      No hay turnos con este filtro
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {shifts.length > 0 && shiftsData && (
          <div className="border-t border-border bg-surface/50">
            <Pagination
              currentPage={shiftsData.meta.page}
              lastPage={shiftsData.meta.lastPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      {/* Modal de Asignación */}
      {selectedShiftForAssignment && (
        <AssignCaregiverModal
          shift={selectedShiftForAssignment}
          onClose={() => setSelectedShiftForAssignment(null)}
        />
      )}
    </div>
  );
}
