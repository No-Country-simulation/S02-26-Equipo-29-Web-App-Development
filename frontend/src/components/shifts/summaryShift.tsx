import { Star } from "lucide-react";
import { formatDayMonth, formatTime } from "../../utils/formatDate";

interface Shift {
    id: string;
    caregiver?: { full_name: string };
    startTime?: string;
    endTime?: string;
    rating?: { number: number };
    status: string;
    // Add more fields as needed
    patientName?: string;
    location?: string;
    notes?: string;
    totalHours?: number;
}

interface ShiftCardDialogProps {
    shift: Shift;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShiftCardDialog({ shift, isOpen, onOpenChange }: ShiftCardDialogProps) {
    if (!isOpen) return null;

    console.log("Shift details for dialog:", shift); // Log para debugging
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="mx-4 w-full max-w-2xl rounded-3xl border border-border bg-surface shadow-lg"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background rounded-t-3xl">
                    <h2 className="text-xl font-semibold text-text-primary">Detalles del Turno</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-2xl text-text-secondary transition hover:text-text-primary"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 px-6 py-4 max-h-96 overflow-y-auto">
                    <div className="border-b border-border pb-4">
                        <p className="text-sm font-semibold text-text-secondary">Cuidador</p>
                        <p className="text-lg font-medium text-text-primary">{shift.caregiver?.full_name || "Sin cuidador asignado"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                        <div>
                            <p className="text-sm font-semibold text-text-secondary">Fecha</p>
                            <p className="text-base text-text-primary">{shift.startTime ? formatDayMonth(shift.startTime) : "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text-secondary">Horario</p>
                            <p className="text-base text-text-primary">
                                {shift.startTime && shift.endTime
                                    ? `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}`
                                    : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="border-b border-border pb-4">
                        <p className="text-sm font-semibold text-text-secondary">Paciente</p>
                        <p className="text-base text-text-primary">{shift.patient.full_name || "-"}</p>
                    </div>

                    <div className="border-b border-border pb-4">
                        <p className="text-sm font-semibold text-text-secondary">Ubicación</p>
                        <p className="text-base text-text-primary">{shift.location || "-"}</p>
                    </div>

                    <div className="border-b border-border pb-4">
                        <p className="text-sm font-semibold text-text-secondary">Horas Totales</p>
                        <p className="text-base text-text-primary">{shift.totalHours ? `${shift.totalHours}h` : "-"}</p>
                    </div>

                    <div className="border-b border-border pb-4">
                        <p className="text-sm font-semibold text-text-secondary">Calificación</p>
                        <div className="flex items-center gap-2">
                            {shift.rating ? (
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={`${shift.id}-dialog-star-${index}`}
                                            size={18}
                                            className={
                                                index < shift.rating!.number
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <span className="text-text-secondary">Sin calificación</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-text-secondary">Notas</p>
                        <p className="text-base text-text-primary">{shift.notes || "-"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}