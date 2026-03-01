import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks';

interface ReporteDialogProps {
open: boolean;
onClose: () => void;
onSave: (data: ReporteData) => void;
initialData?: ReporteData;
}

interface ReporteData {
comportamiento: string;
medicacion: string;
observaciones: string;
}

const CAREGIVER = 'CAREGIVER';

export const ReporteDialog: React.FC<ReporteDialogProps> = ({
open,
onClose,
onSave,
initialData,
}) => {
const { data: user } = useUser();
const [formData, setFormData] = useState<ReporteData>(
    initialData || {
        comportamiento: '',
        medicacion: '',
        observaciones: '',
    }
);

useEffect(() => {
    if (!open) return;

    setFormData(
        initialData || {
            comportamiento: '',
            medicacion: '',
            observaciones: '',
        }
    );
}, [initialData, open]);

const isEditable = user?.role === CAREGIVER;

const handleChange = (field: keyof ReporteData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

const handleSave = () => {
    onSave(formData);
    onClose();
};

if (!open) return null;

return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
        <div
            className="w-full max-w-2xl rounded-3xl border border-border bg-surface shadow-lg"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-semibold text-text-primary">
                Reporte de turno
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                {isEditable
                    ? 'Completá el reporte con la información del paciente.'
                    : 'Vista de solo lectura del reporte cargado.'}
                </p>
            </div>

            <div className="space-y-4 px-6 py-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary">
                        Comportamiento
                    </label>
                    <textarea
                        rows={3}
                        value={formData.comportamiento}
                        onChange={handleChange('comportamiento')}
                        disabled={!isEditable}
                        placeholder="Estado general, ánimo y conducta durante el turno"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary disabled:bg-background disabled:text-text-secondary"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary">
                        Medicación
                    </label>
                    <textarea
                        rows={3}
                        value={formData.medicacion}
                        onChange={handleChange('medicacion')}
                        disabled={!isEditable}
                        placeholder="Medicación administrada, dosis y horario"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary disabled:bg-background disabled:text-text-secondary"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary">
                        Observaciones
                    </label>
                    <textarea
                        rows={3}
                        value={formData.observaciones}
                        onChange={handleChange('observaciones')}
                        disabled={!isEditable}
                        placeholder="Incidencias relevantes y recomendaciones"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary disabled:bg-background disabled:text-text-secondary"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-xs text-text-secondary">
                {isEditable ? 'Podés guardar cambios.' : 'Solo lectura'}
                </p>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background"
                    >
                Cancelar
                    </button>
            {isEditable && (
                <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                    Guardar
                </button>
            )}
                </div>
            </div>
        </div>
    </div>
);
};