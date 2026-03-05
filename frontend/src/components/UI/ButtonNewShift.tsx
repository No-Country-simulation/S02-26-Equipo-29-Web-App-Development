import { ChevronDown } from "lucide-react";
import { useUser } from "../../hooks";
import { useShifts } from "../../hooks/patient/useShifts";
import { useState } from "react";
import { toast } from "sonner";

export const ButtonNewShift = () => {

const [showForm, setShowForm] = useState(false);
const { data: user } = useUser();

const {
    createShift,
    isCreating,
    createError,
} = useShifts();

const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    report: "",
    location: "",
  });

const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_time || !formData.end_time) {
      toast.error("Por favor completa horarios");
      return;
    }

    try {
      await createShift({
        start_time: formData.start_time,
        end_time: formData.end_time,
        report: formData.report || undefined,
        location: formData.location || undefined,
      });

      setFormData({
        start_time: "",
        end_time: "",
        report: "",
        location: "",
      });
      setShowForm(false);
    } catch{
      toast.error("Error al pedir la guardia, intenta de nuevo");
    }
  };

  return (
    <>
     <div className="flex justify-start">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`mt-2 mb-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/40 transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/50 ${
              user?.role === "CAREGIVER" ? "hidden" : ""
            }`}
          >
            {showForm ? "Cancelar" : "Solicitar una Guardia"}{" "}
            <ChevronDown className="inline-block" size={18} />
          </button>
        </div>

    
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-5 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Solicitar turno
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-border px-3 py-1 text-sm text-text-secondary transition hover:bg-background"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">
                      Inicio
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">
                      Fin
                    </label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Notas{" "}
                    <span className="text-xs text-text-secondary">
                      (Opcional)
                    </span>
                  </label>
                  <textarea
                    name="report"
                    value={formData.report}
                    onChange={handleInputChange}
                    placeholder="Detalles del turno..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Ubicación
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Detalles de la ubicación..."
                    rows={1}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                {createError && (
                  <p className="text-sm text-red-600">
                    Error: {createError?.message || "No se pudo crear el turno"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {isCreating ? "Enviando solicitud..." : "Solicitar turno"}
                </button>
              </form>
            </div>
          </div>
    )}
    </>
  );
}

