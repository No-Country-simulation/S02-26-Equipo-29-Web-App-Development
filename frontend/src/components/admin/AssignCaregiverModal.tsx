import { useAvailableCaregivers } from "../../hooks/admin/useAvailableCaregiver";
import { useAssignCaregiver } from "../../hooks/shifts/useAssignCaregiver";
import { formatDateSafe, formatTime } from "../../utils/formatDate";
import type { Shift } from "../../types";

import { toast } from "sonner";
import { takeFirstLetters } from "../../utils/firstLetters";
import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";

interface Props {
  shift: Shift;
  onClose: () => void;
}

export const AssignCaregiverModal = ({ shift, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: caregivers, isLoading } = useAvailableCaregivers(
    shift.start_time || "",
    shift.end_time || ""
  );
  const { mutate: assign, isPending: isAssigning } = useAssignCaregiver();


  const handleAssign = (caregiverId: string) => {
    assign(
      { shiftId: shift.id, caregiverId },
      {
        onSuccess: () => {
          toast.success("Cuidador asignado correctamente");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Error al asignar cuidador");
        },
      }
    );
  };

  const filteredCaregivers = caregivers?.filter((c) =>
    c.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Asignar Cuidador</h2>
            <p className="text-sm text-text-secondary mt-1">
              {formatDateSafe(shift.start_time as string)} • {formatTime(shift.start_time as string)} - {formatTime(shift.end_time as string)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-background/50 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full bg-surface border border-border rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-text-secondary">Buscando cuidadores disponibles...</p>
            </div>
          ) : filteredCaregivers?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-text-secondary">No se encontraron cuidadores disponibles para este horario.</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredCaregivers?.map((caregiver) => (
                <div
                  key={caregiver.profile_id}
                  className="group p-3 rounded-2xl border border-transparent hover:border-border hover:bg-background transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {takeFirstLetters(caregiver.profile?.full_name || "")}
                    </div>
                    <div>
                       <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {caregiver.profile?.full_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
                        <span>{caregiver.profile?.phone || "Sin teléfono"}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">${caregiver.hourly_rate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={isAssigning}
                    onClick={() => handleAssign(caregiver.profile_id || "")}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isAssigning ? <Loader2 className="animate-spin" size={14} /> : "Asignar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
