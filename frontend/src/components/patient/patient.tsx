import type { Caregiver } from "../../types/index";
import type { User } from "../../types/index";

type PatientDialogProps = {
  open: boolean;
  onClose: () => void;
  patient: {
    id: string;
    name: string;
    day: string;
    schedule: string;
    notes: string;
    phone: string;
    };
  caregiver: Caregiver;
  user: User;
};

export const Patient = ({ open, onClose, patient, caregiver, user }: PatientDialogProps) => {


  console.log('Patient dialog user:', user);
  console.log('Patient dialog caregiver:', caregiver);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
              Ficha del paciente
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{patient.name}</h2>
            <p className="text-sm text-text-secondary">
              ID {patient.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border p-2 text-text-secondary hover:text-text-primary"
            aria-label="Cerrar diálogo"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-primary">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              Cuidador asignado
            </p>
            <p className="mt-2 font-medium">{user.full_name}</p>
            <p className="text-text-secondary">
              Turno: {caregiver?.shiftRange}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              Medicación
            </p>
            {/* <ul className="mt-2 list-disc space-y-1 pl-5">
              {patient.medications.map((med) => (
                <li key={med}>{med}</li>
              ))}
            </ul> */}
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              Notas clínicas
            </p>
            <p className="mt-2">{patient.notes}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              Contacto de emergencia
            </p>
            <p className="mt-2 font-medium">{patient.name}</p>
            {/* <p className="text-[var(--color-text-secondary)]">
              Relación: {patient.emergencyContact.relation}
            </p> */}
            <p>
              Teléfono:{" "}
              <span className="font-medium text-primary">
                {patient.phone}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-white/5"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};