import { Circle, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { useCaregivers, useShifts } from "../../hooks";
import {formatDateSafe,  formatTime } from "../../utils/formatDate";
import { getStatusColorShift, translateStatusShift } from "../../utils/status";
import type { Caregiver } from "../../types";
import { assignCaregiverShift, updateShiftStatus } from "../../api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pagination } from "../../components/UI/Pagination";
import { takeFirstLetters } from "../../utils/firstLetters";

export function Appointments() {

  const queryClient= useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

   const { data: shiftsData, isLoading, isError } = useShifts(page, limit);
 const {data:caregivers ,isLoading:isLoadingCaregivers,isError:isErrorCaregivers}=useCaregivers();
  const [filter, setFilter] = useState("PENDING");
 
  if(isLoading || isLoadingCaregivers){
    return <div>Loading...</div>
  }

  if(isError || isErrorCaregivers){
    return <div>Error...</div>
  }

  const filteredShifts = shiftsData?.data.filter((shift) => {
    if (filter === "ALL") return true;
    return shift.status === filter;
  });

  const handleUpdateStatus = async (id: string, status: string) => {
     try {
       await updateShiftStatus(id, status);
       toast.success("Estado actualizado correctamente");
       queryClient.invalidateQueries({ queryKey: ["shifts"] });
     } catch (error) {
      if(error instanceof AxiosError && error.response?.data?.message){
        toast.error(error.response.data.message);
      }else{
        toast.error("Error al actualizar el estado");
      }
     }
  };

  const handleAssignCaregiver = async (shiftId: string, caregiverId: string) => {

    try {
      await assignCaregiverShift(shiftId, caregiverId);
      toast.success("Cuidador asignado correctamente");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.data?.message){
        toast.error(error.response.data.message);
      }else{
        toast.error("Error al asignar el cuidador");
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
                  filter === "ALL" ? "bg-primary text-white border-primary" : "text-text-secondary"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter("PENDING")}
                className={`cursor-pointer transition-all duration-200 hover:bg-yellow-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50" : "text-text-secondary"
                }`}
              >
                <Circle className={`w-2 h-2 ${filter === "PENDING" ? "fill-yellow-500" : "fill-yellow-500/50"}`} />
                <span className="hidden xs:inline">Pendientes</span>
                <span className="xs:hidden">Pend.</span>
              </button>
              <button
                onClick={() => setFilter("ASSIGNED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-green-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "ASSIGNED" ? "bg-green-500/10 text-green-500 border-green-500/50" : "text-text-secondary"
                }`}
              >
                <Circle className={`w-2 h-2 ${filter === "ASSIGNED" ? "fill-green-500" : "fill-green-500/50"}`} />
                <span className="hidden xs:inline">Asignadas</span>
                <span className="xs:hidden">Asig.</span>
              </button>
              <button
                onClick={() => setFilter("REJECTED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-red-500/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "REJECTED" ? "bg-red-500/10 text-red-500 border-red-500/50" : "text-text-secondary"
                }`}
              >
                <Circle className={`w-2 h-2 ${filter === "REJECTED" ? "fill-red-500" : "fill-red-500/50"}`} />
                <span className="hidden xs:inline">Rechazadas</span>
                <span className="xs:hidden">Rech.</span>
              </button>
              <button
                onClick={() => setFilter("COMPLETED")}
                className={`cursor-pointer transition-all duration-200 hover:bg-primary/20 rounded-2xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  filter === "COMPLETED" ? "bg-primary/10 text-primary border-primary/50" : "text-text-secondary"
                }`}
              >
                <Circle className={`w-2 h-2 ${filter === "COMPLETED" ? "fill-primary" : "fill-primary/50"}`} />
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

      {/* Tabla de cuidados */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background/50 text-left text-text-secondary">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider ">Paciente</th>
                <th className="px-6 py-4 font-semibold tracking-wider ">Fecha</th>
                <th className="px-6 py-4 font-semibold tracking-wider ">Horario</th>
                <th className="px-6 py-4 font-semibold tracking-wider ">Servicio</th>
                <th className="px-6 py-4 font-semibold tracking-wider ">Cuidador</th>
                <th className="px-6 py-4 font-semibold tracking-wider ">Estado</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredShifts?.map((shift) => (
                <tr key={shift.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-5 ">
                    <div className="flex items-center">
                      <div className="h-9 p-2 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                        {takeFirstLetters(shift.patient.profile?.full_name || "")}
                      </div>
                      <p className="font-semibold text-text-primary whitespace-nowrap">{shift.patient.profile?.full_name || "N/A"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-text-secondary  whitespace-nowrap">{formatDateSafe(shift.start_time || "")}</p>
                  </td>
                  <td className="px-6 py-5 text-text-secondary  whitespace-nowrap">
                    {formatTime(shift.start_time || "")} - {formatTime(shift.end_time || "")}
                  </td>
                  <td className="px-6 py-5  whitespace-nowrap">
                    <span className="text-text-primary">{shift.service || "General"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <select
                     onChange={(e) => handleAssignCaregiver(shift.id, e.target.value)} 
                     className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all cursor-pointer w-full max-w-[160px]">
                      <option value="">Seleccionar...</option>
                      {caregivers?.map((caregiver: Caregiver) => (
                        <option key={caregiver.id} value={caregiver.profile_id} selected={shift.caregiver?.profile_id === caregiver.profile_id}>
                          {caregiver.full_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusColorShift(shift.status)}`}>
                      {translateStatusShift(shift.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5" >
                    <div className="flex gap-2 justify-center">
                      <button 
                      disabled={shift.status!=="PENDING"}
                      onClick={()=>handleUpdateStatus(shift.id,"ASSIGNED")}
                      className="p-2 transition-all duration-200 rounded-xl border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white hover:scale-110 active:scale-90 shadow-sm" title="Aprobar">
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                      disabled={shift.status!=="PENDING"}
                      onClick={()=>handleUpdateStatus(shift.id,"REJECTED")}
                      className="p-2 transition-all duration-200 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 shadow-sm" title="Rechazar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
            {filteredShifts?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  <p className="text-text-secondary">No hay turnos con este filtro</p>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        
        {filteredShifts && filteredShifts.length > 0 && shiftsData && (
          <div className="border-t border-border bg-surface/50">
            <Pagination
              currentPage={shiftsData.meta.page}
              lastPage={shiftsData.meta.lastPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
