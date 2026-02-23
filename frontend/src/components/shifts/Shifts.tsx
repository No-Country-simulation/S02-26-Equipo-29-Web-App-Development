import { useState } from "react";
import type { Shift } from "../../types/index";
import { useShifts } from "../../hooks/patient/useShifts";
import { useCaregivers } from "../../hooks/caregiver/useCaregivers";

export const Shifts: React.FC<{ shifts?: Shift[] }> = ({ shifts: externalShifts }) => {
    const { shifts: hookShifts, createShift, isCreating, createError } = useShifts();
    const { data: caregivers = [] } = useCaregivers();
    const shifts = externalShifts || hookShifts;

    // Estado para el formulario
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        start_time: "",
        end_time: "",
        caregiverName: "",
        report: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.start_time || !formData.end_time || !formData.caregiverName) {
            alert("Por favor completa horarios y cuidador");
            return;
        }

        const selectedCaregiver = caregivers.find(
            (caregiver: { full_name?: string; profile_id?: string }) =>
                caregiver.full_name === formData.caregiverName
        );

        if (!selectedCaregiver?.profile_id) {
            alert("Selecciona un cuidador válido");
            return;
        }

        createShift({
            caregiverId: selectedCaregiver.profile_id,
            start_time: formData.start_time,
            end_time: formData.end_time,
            report: formData.report || undefined,
        });

        setFormData({ start_time: "", end_time: "", caregiverName: "", report: "" });
        setShowForm(false);
        console.log("Creating shift with data:", {
            caregiverId: selectedCaregiver.profile_id,
            start_time: formData.start_time,    
            end_time: formData.end_time,
            report: formData.report || undefined,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                    Mis Turnos
                </p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition"
                >
                    {showForm ? "Cancelar" : "+ Solicitar turno"}
                </button>
            </div>

            {/* Formulario de creación */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Inicio
                            </label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Fin
                            </label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre del cuidador
                        </label>
                        <select
                            name="caregiverName"
                            value={formData.caregiverName}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">Selecciona un cuidador</option>
                            {caregivers.map(
                                (caregiver: { full_name?: string; profile_id?: string }) => (
                                    <option
                                        key={caregiver.profile_id || caregiver.full_name}
                                        value={caregiver.full_name}
                                    >
                                        {caregiver.full_name}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notas (opcional)
                        </label>
                        <textarea
                            name="report"
                            value={formData.report}
                            onChange={handleInputChange}
                            placeholder="Detalles del turno..."
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>

                    {createError && (
                        <p className="text-sm text-red-600">
                            Error: {(createError as any)?.message || "No se pudo crear el turno"}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        {isCreating ? "Enviando solicitud..." : "Solicitar turno"}
                    </button>
                </form>
            )}

            {/* Lista de turnos */}
            {shifts.length > 0 ? (
                <div className="space-y-4">
                    {shifts.map((shift) => (
                        <article
                            key={shift.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
                        >
                            <p className="text-sm font-semibold text-slate-900">
                                {shift.created_by?.full_name || "Turno"}
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                <p>
                                    <span className="font-semibold">Horario:</span> {shift.startTime || "-"} -{" "}
                                    {shift.endTime || "-"}
                                </p>
                                {shift.location && (
                                    <p>
                                        <span className="font-semibold">Ubicación:</span> {shift.location}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Estado:</span>{" "}
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                                        {shift.status || "pending"}
                                    </span>
                                </p>
                                {shift.caregiver?.full_name && (
                                    <p>
                                        <span className="font-semibold">Cuidador:</span> {shift.caregiver.full_name}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <>
                    <p>Aquí van los Shifts ya realizados</p>
                    <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                        No hay turnos asignados
                    </p>
                </>
            )}
        </div>
    );
}