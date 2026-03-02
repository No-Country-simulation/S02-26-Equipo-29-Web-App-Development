import { ChevronDown } from "lucide-react";
// import { Patient } from "../../components/patient/patient";
import { useCaregivers, useUser } from "../../hooks";
import { useShifts } from "../../hooks/patient/useShifts";
import { formatDate, formatTime } from "../../utils/formatDate";
import { useMemo, useState } from "react";

export function PanelPatient() {
  const { data: user } = useUser();
  const { data: patient } = useUser();
  const { data: caregivers = [], isLoading: isCaregiversLoading } = useCaregivers();
  const { shifts: hookShifts, createShift, isCreating, createError } = useShifts();

  // Estado para el formulario
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        start_time: "",
        end_time: "",
        caregiverId: "",
        report: "",
        location: "",
    });

    const selectedCaregiver = useMemo(() => {
    return caregivers.find((caregiver) => {
      const caregiverId = caregiver.profile_id || caregiver.profile?.id || caregiver.id;
      return caregiverId === formData.caregiverId;
    });
  }, [caregivers, formData.caregiverId]);

  const assignedCaregiver = useMemo(() => {
    const assignedId = hookShifts[0]?.caregiver?.profile_id;
    if (!assignedId) return null;

    return caregivers.find((caregiver) => {
      const caregiverId = caregiver.profile_id || caregiver.profile?.id || caregiver.id;
      return caregiverId === assignedId;
    }) || null;
  }, [caregivers, hookShifts]);

  const caregiverDocuments = useMemo(() => {
    if (!selectedCaregiver) return [];

    const extendedCaregiver = selectedCaregiver as typeof selectedCaregiver & {
      criminal_record?: string;
      certificate?: string;
      contract?: string;
    };

    return [
      { label: "DNI frente", url: selectedCaregiver.front_dni },
      { label: "DNI dorso", url: selectedCaregiver.back_dni },
      { label: "Antecedentes", url: extendedCaregiver.criminal_record },
      { label: "Certificado", url: extendedCaregiver.certificate },
      { label: "Contrato", url: extendedCaregiver.contract },
    ].filter((doc) => Boolean(doc.url));
  }, [selectedCaregiver]);

  const assignedCaregiverDocuments = useMemo(() => {
    if (!assignedCaregiver) return [];

    const extendedCaregiver = assignedCaregiver as typeof assignedCaregiver & {
      criminal_record?: string;
      certificate?: string;
      contract?: string;
    };

    return [
      { label: "DNI frente", url: assignedCaregiver.front_dni },
      { label: "DNI dorso", url: assignedCaregiver.back_dni },
      { label: "Antecedentes", url: extendedCaregiver.criminal_record },
      { label: "Certificado", url: extendedCaregiver.certificate },
      { label: "Contrato", url: extendedCaregiver.contract },
    ].filter((doc) => Boolean(doc.url));
  }, [assignedCaregiver]);

    if (!patient) {
      return <div>Loading...</div>;
    }

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    return `${formatDate(value)} ${formatTime(value)}`;
  };

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
  };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.start_time || !formData.end_time || !formData.caregiverId) {
            alert("Por favor completa horarios y cuidador");
            return;
        }

     
        createShift({
            start_time: formData.start_time,
            end_time: formData.end_time,
            caregiverId: formData.caregiverId,
            report: formData.report || undefined,
            location: formData.location || undefined,
        });

        console.log("Shift solicitado:", formData);

        setFormData({ start_time: "", end_time: "", caregiverId: "", report: "", location: "" });
        setShowForm(false);
     
    };


  return (
    <main className="min-h-screen bg-background px-4 py-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-5">
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
          Panel paciente
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">
          Paciente <span className="text-lg font-normal text-text-secondary">{user?.full_name}</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Gestiona tu información y guardias</p>
      </header>

      <div className="flex justify-start">
        <button
          onClick={() => setShowForm(!showForm)}
                    className={`mt-1 inline-flex items-center rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 ${user?.role === "CAREGIVER" ? "hidden" : ""}`} 
                  >
                    {showForm ? "Cancelar" : "Solicitar una Guardias"} <ChevronDown className="ml-2 inline-block" size={16}/>
        </button>
      </div>

      {/* Formulario de creación */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-5 shadow-lg">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-text-primary">Solicitar turno</h2>
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
                                      Cuidador <span className="text-xs text-text-secondary">(Sugiera un cuidador)</span>
                                </label>
                                <select
                                    name="caregiverId"
                                    value={formData.caregiverId}
                                    onChange={handleInputChange}
                                    required
                                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                                >
                                    <option value="" disabled>
                                      {isCaregiversLoading ? "Cargando cuidadores..." : "Selecciona un cuidador"}
                                    </option>
                                    {caregivers.map((caregiver) => {
                                      const caregiverId = caregiver.profile_id || caregiver.profile?.id || caregiver.id;
                                      const caregiverName = caregiver.full_name || caregiver.profile?.full_name || "Sin nombre";

                                      if (!caregiverId) return null;

                                      return (
                                        <option key={caregiverId} value={caregiverId}>
                                          {caregiverName}
                                        </option>
                                      );
                                    })}
                                </select>

                                {formData.caregiverId && (
                                  <div className="mt-3 rounded-2xl border border-border bg-background px-3 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                                      Documentos del cuidador seleccionado
                                    </p>
                                    {caregiverDocuments.length > 0 ? (
                                      <div className="mt-2 grid grid-cols-1 gap-3">
                                        {caregiverDocuments.map((doc) => (
                                          <div
                                            key={doc.label}
                                            className="w-full rounded-xl border border-border bg-surface p-2"
                                          >
                                            <p className="mb-2 text-xs font-medium text-text-secondary">
                                              {doc.label}
                                            </p>
                                            {isImageUrl(doc.url as string) ? (
                                              <img
                                                src={doc.url as string}
                                                alt={doc.label}
                                                className="block h-auto w-full rounded-lg object-cover"
                                              />
                                            ) : (
                                              <a
                                                href={doc.url as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-sm text-primary underline-offset-2 hover:underline"
                                              >
                                                Ver documento
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="mt-2 text-sm text-text-secondary">
                                        Este cuidador no tiene documentos cargados.
                                      </p>
                                    )}
                                  </div>
                                )}

                                
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-text-primary">
                                Notas <span className="text-xs text-text-secondary">(Opcional)</span>
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
                                    Error: {(createError)?.message || "No se pudo crear el turno"}
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

      {/* <div className="h-auto mt-5 bg-amber-300">
        <Patient
          open={false}
          onClose={() => {}}
          patient={{
            id: patient.id,
            start_time: hookShifts[0]?.startTime || "",
            end_time: hookShifts[0]?.endTime || "",
            profile: {
              profile_id: patient.id || "",
              full_name: patient.full_name || "Sin Cuidador Asignado",
              phone: patient.phone || ""
            },
            notes: "",
            phone: ""
          }}
        />
      </div> */}

      <section className="mt-5 grid gap-6 lg:grid-cols-2">
        <article className="h-auto rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Cuidador asignado
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {hookShifts[0]?.caregiver?.full_name || "Sin cuidador asignado"}
          </h2>
          <p className="text-sm text-text-secondary">
            Turno: {hookShifts[0]?.startTime ? `${formatDateTime(hookShifts[0].startTime)} - ${formatDateTime(hookShifts[0].endTime)} - 🕛${hookShifts[0]?.hours} horas` : "Sin turno asignado"}
          </p>
          <p className="mt-4 text-sm">
            Teléfono de contacto:{" "}
            <span className="font-medium text-primary">
              {hookShifts[0]?.caregiver?.phone || "Sin teléfono disponible"}
            </span>
          </p>
          <div>
            <>
            {assignedCaregiverDocuments.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-text-secondary">
                  Documentos del cuidador:
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {assignedCaregiverDocuments.map((doc) => (
                    <div
                      key={doc.label}
                      className="w-full rounded-xl border border-border bg-background p-2"
                    >
                      <p className="mb-2 text-xs font-medium text-text-secondary">{doc.label}</p>
                      {isImageUrl(doc.url as string) ? (
                        <img
                          src={doc.url as string}
                          alt={doc.label}
                          className="block h-auto w-full rounded-lg object-cover"
                        />
                      ) : (
                        <a
                          href={doc.url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline-offset-2 hover:underline"
                        >
                          Ver documento
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-secondary">No hay documentos disponibles</p>
            )}
            </>
          </div>
        </article>

        <article className="h-auto rounded-3xl border border-border bg-surface p-6 shadow-lg w-auto flex-1">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Próximas visitas
          </p>
          <ul className="mt-4 space-y-4 text-sm">
            { hookShifts.filter(shift => shift.status !== "COMPLETED").map((visit) => (
              <li
                key={`${visit.startTime}-${visit.endTime}`}
                className="rounded-2xl border border-border bg-background px-4 py-3"
              >
                <p className="text-base font-semibold">🗓️{formatDateTime(visit.startTime)} 🕛</p>
                <p className="text-text-secondary">🗓️{formatDateTime(visit.endTime)} 🕛</p>
                <p className="mt-1">NOTAS : <span className="text-xs text-slate-400">{visit.report || "Sin notas disponibles"}</span></p>
                <p className="mt-1">UBICACIÓN : <span className="text-xs text-slate-400">{visit.location || "Sin ubicación disponible"}</span></p>
              </li>
            ))}
          </ul>
        </article>
      </section>
      </section>
    </main>
  );
}
