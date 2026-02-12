import { useState, useEffect } from 'react';
import type { Caregiver } from "../../types/index";
import { useUser } from "../../context/UserContext";
import { EditProfileForm } from "../../components/UI/EditProfileForm";
import { api } from "../../lib/axios/api";

export interface Document {
    id: string;
    name: string;
    uploadDate: string;
    type: string;
}

export interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
}

export const CaregiverInfo: React.FC = () => {
    const { user } = useUser();
    const [caregiverData, setCaregiverData] = useState<Caregiver>({});
    const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'shifts'>('info');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [shifts, ] = useState<Shift[]>([]);
    const [editProfileOpen, setEditProfileOpen] = useState(false);

    useEffect(() => {
        const fetchCaregiverData = async () => {
            const response = await api.get(`/caregivers/${user?.id}`);
            setCaregiverData(response.data);
            console.log("response:", response.data);
        };
        fetchCaregiverData();
    }, [user?.id]);


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const newDoc: Document = {
                    id: Math.random().toString(),
                    name: file.name,
                    uploadDate: new Date().toLocaleDateString(),
                    type: file.type
                };
                setDocuments([...documents, newDoc]);
            });
        }
    };

    const handleDeleteDocument = (id: string) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const handleOpenEditeProfile = () => {
        setEditProfileOpen(!editProfileOpen);
    };

    const handleUpdateCaregiverInfo = async (data: any) => {

        // const dataUser = {
        //     full_name: data.full_name,
        //     email: data.email,
        //     phone: data.phone
        // };

        const dataCaregiver = {
            cbu: data.cbu,
            mercado_pago_alias: data.mercado_pago_alias,
            hourly_rate: data.hourly_rate
        };
        console.log("Data a enviar para actualizar caregiver:", dataCaregiver);
        try {
            // Enviar data para Modificar Cargiver Table
            const token = localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken") as string) : null;
            console.log("Token en handleUpdateCaregiverInfo:", token);
            await api.patch(
                `/caregivers/${user?.id}`,
                dataCaregiver,
                {
                    headers: { Authorization: `Bearer ${token.access_token}` },
                },
            );
            setCaregiverData({ ...caregiverData, ...data });
            setEditProfileOpen(false);

            // Enviar data para Modificar User Table
            // await api.patch(`/users/${user?.id}`, 
            //     { Authorization: `Bearer ${token?.accessToken}` }, dataUser);
            
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="h-auto bg-surface px-4 py-8 text-slate-900 border border-slate-200 rounded-3xl shadow-lg">
            <div className="mx-auto max-w-5xl space-y-8">
                

                <div className="flex flex-wrap gap-3">
                    {[
                        { id: 'info', label: 'Mi Información' },
                        { id: 'documents', label: 'Mis Documentos' },
                        { id: 'shifts', label: 'Mis Turnos' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition ${
                                activeTab === tab.id
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                                    Información Personal
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { label: 'Nombre', value: user?.full_name },
                                    { label: 'Email', value: user?.email },
                                    { label: 'Teléfono', value: user?.phone },
                                    { label: 'CBU', value: caregiverData.cbu || 'No registrado' },
                                    { label: 'Alias Mercado Pago', value: caregiverData.mercado_pago_alias || 'No registrado' },
                                    { label: 'Tarifa por hora', value: caregiverData.hourly_rate ? `$${caregiverData.hourly_rate}/hora` : 'No registrada' },
                                    // { label: 'Turno', value: caregiver.shiftRange },
                                ].map((item) => (
                                    <article key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                                        <p className="text-base font-medium text-slate-900">{item.value}</p>
                                    </article>
                                ))}
                            </div>
                            <button onClick={handleOpenEditeProfile} className="w-full rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-hover sm:w-auto">
                                Editar Perfil
                            </button>
                        </div>
                    )}

                    {activeTab === 'info' && editProfileOpen && (
                        <div>
                            <EditProfileForm user={user} onSubmit={handleUpdateCaregiverInfo} />
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                                    Mis Documentos
                                </p>
                            </div>
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/10 px-6 py-8 text-center text-sm text-primary transition hover:border-primary-hover hover:bg-primary/20"
                            >
                                <span className="text-lg">📁 Sube tus documentos aquí</span>
                                <span className="text-xs text-slate-400">PDF, DOC, JPG o PNG</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    className="sr-only"
                                />
                            </label>

                            {documents.length > 0 ? (
                                <ul className="space-y-3">
                                    {documents.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                                                <p className="text-xs text-slate-400">{doc.uploadDate}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id)}
                                                className="rounded-xl bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-200"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                                    No hay documentos cargados
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === 'shifts' && (
                        <div className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Mis Turnos</p>
                            {shifts.length > 0 ? (
                                <div className="space-y-4">
                                    {shifts.map((shift) => (
                                        <article
                                            key={shift.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
                                        >
                                            <p className="text-sm font-semibold text-slate-900">{shift.date}</p>
                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                
                                                <p>
                                                    <span className="font-semibold">Horario:</span> {shift.startTime} - {shift.endTime}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Ubicación:</span> {shift.location}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Estado:</span>{' '}
                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                                                        {shift.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p>Aca van los Shifts ya realizados</p>
                                    <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                                        No hay turnos asignados
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CaregiverInfo;