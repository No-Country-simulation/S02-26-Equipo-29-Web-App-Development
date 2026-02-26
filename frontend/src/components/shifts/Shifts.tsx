import { useState } from "react";
import type { Shift } from "../../types/index";
import { useShifts } from "../../hooks/patient/useShifts";
import { useCaregivers } from "../../hooks/caregiver/useCaregivers";
import { formatDate, formatTime } from "../../utils/formatDate";
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import { useUser } from "../../hooks";

export const Shifts: React.FC<{ shifts?: Shift[] }> = ({ shifts: externalShifts }) => {
    const { data: user } = useUser();
    const { shifts: hookShifts, createShift, isCreating, createError } = useShifts();
    const { data: caregivers = [] } = useCaregivers();
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

    const getStartTime = (shift: any) => shift.startTime || shift.start_time;
    const getEndTime = (shift: any) => shift.endTime || shift.end_time;

    
    
    console.log("Caregiver shifts data in Shifts component:", caregiverShifts);
    console.log("User data in Shifts component:", user);
    console.log("Shifts selected by role:", shiftsToRender);

    // Estado para el formulario
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        start_time: "",
        end_time: "",
        caregiverName: "",
        report: "",
        location: "",
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
            location: formData.location || undefined,
        });

        setFormData({ start_time: "", end_time: "", caregiverName: "", report: "", location: "" });
        setShowForm(false);
        console.log("Creating shift with data:", {
            caregiverId: selectedCaregiver.profile_id,
            start_time: formData.start_time,    
            end_time: formData.end_time,
            report: formData.report || undefined,
            location: formData.location || undefined,
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
                    className={`rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition ${user?.role === "CAREGIVER" ? "hidden" : ""}`} 
                >
                    {showForm ? "Cancelar" : "+ Solicitar turno"}
                </button>
            </div>

            {/* Lista de turnos */}
                <div className="space-y-4">
                    {shiftsToRender.map((shift: any) => (
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
                                            <span className="font-semibold">Horario:</span> {formatDateTime(getStartTime(shift))} -{" "}
                                            {formatDateTime(getEndTime(shift))}
                                        </p>

                                        {shift.location && (
                                            <p>
                                                <span className="font-semibold">Ubicación:</span> {shift.location}
                                            </p>
                                        )}
                                        {shift.report && (
                                            <p>
                                                <span className="font-semibold">Notas:</span> {shift.report}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-semibold">Estado:</span>{" "}
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shift.status === "PENDING" ? "text-yellow-600 bg-yellow-100" : "text-green-600 bg-green-100"}`}>
                                                {shift.status || "pending"}
                                            </span>
                                        </p>
                                        {shift.caregiver?.full_name && (
                                            <p>
                                                <span className="font-semibold">Cuidador:</span> {shift.caregiver.full_name}
                                            </p>
                                        )}
                                    </>
                                )}

                                {user?.role === "PATIENT" && (
                                    <>
                                        <p>
                                            <span className="font-semibold">Horario:</span> {formatDateTime(getStartTime(shift))} -{" "}
                                            {formatDateTime(getEndTime(shift))}
                                        </p>
                                        {shift.location && (
                                            <p>
                                                <span className="font-semibold">Ubicación:</span> {shift.location}
                                            </p>
                                        )}
                                        {shift.report && (
                                            <p>
                                                <span className="font-semibold">Notas:</span> {shift.report}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-semibold">Estado:</span>{" "}
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shift.status === "PENDING" ? "text-yellow-600 bg-yellow-100" : "text-green-600 bg-green-100"}`}>
                                                {shift.status || "pending"}
                                            </span>
                                        </p>
                                        {shift.caregiver?.full_name && (
                                            <p>
                                                <span className="font-semibold">Cuidador:</span> {shift.caregiver.full_name}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Formulario de creación */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Solicitar turno</h2>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    Cerrar
                                </button>
                            </div>

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
                                    Nombre del cuidador <span className="text-xs text-slate-400">(Puede Sugerir el nombre del cuidador que quiere que se le asigne)</span>
                                </label>
                                <select
                                    name="caregiverName"
                                    value={formData.caregiverName}
                                    onChange={handleInputChange}
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
                                    Notas <span className="text-xs text-slate-400">(Opcional)</span>
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Ubicación
                                </label>
                                <textarea
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Detalles de la ubicación..."
                                    rows={1}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </div>

                            {createError && (
                                <p className="text-sm text-red-600">
                                    Error: {(createError)?.message || "No se pudo crear el turno"}
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
                    </div>
                </div>
            )}
        </div>
    );
}