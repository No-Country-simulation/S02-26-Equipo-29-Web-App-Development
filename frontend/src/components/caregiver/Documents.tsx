import { XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { api } from '../../lib/axios/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useCaregiverDocuments } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../hooks/user/useUser';
import { usePatientDocuments } from '../../hooks/patient/usePatientDocuments';

    interface UploadedDocument {
        file?:File
        id: string;
        previewUrl?: string;
        document_type: string;
        name: string; 
        file_url?: string  | undefined
    }
    
    export function Documents() {
       const {data:user}=useUser();
       const queryClient = useQueryClient();
    const {data:documentsData,isLoading: caregiverLoading}=useCaregiverDocuments()
    const {data:patientDataDoc,isLoading: patientLoading}=usePatientDocuments();
        
    const [documents, setDocuments] = useState<UploadedDocument[]>(documentsData || []);
    const [patientDocuments, setPatientDocuments] = useState<UploadedDocument[]>(patientDataDoc || []);
       const [isUploading, setIsUploading] = useState(false);

       useEffect(() => {
        if (documentsData) {
            setDocuments(documentsData)
        }
        }, [documentsData])

        useEffect(() => {
            if (patientDataDoc) {
                setPatientDocuments(patientDataDoc)
            }
        }, [patientDataDoc])
        

        const isCaregiver = user?.role === "CAREGIVER";
        const activeDocuments = isCaregiver ? documents : patientDocuments;
        const isLoading = isCaregiver ? caregiverLoading : patientLoading;

        const updateDocuments = (
            updater: (prev: UploadedDocument[]) => UploadedDocument[],
        ) => {
            if (isCaregiver) {
                setDocuments(updater);
                return;
            }
            setPatientDocuments(updater);
        };

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            const inputId = e.target.id ; // Cast id to valid document type
            
            if (files) {
                const newDocs = Array.from(files).map(file => ({
                    id: Math.random().toString(),
                    previewUrl: URL.createObjectURL(file), // Provide previewUrl
                    document_type: inputId,
                    name: file.name,
                    file:file
                }));
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                updateDocuments((prev) => [...prev, ...newDocs]);
            }
        };
    
        const handleDeleteDocument = (id: string) => {
            const doc = activeDocuments.find(d => d.id === id);
            if (doc && doc.previewUrl) {
                URL.revokeObjectURL(doc.previewUrl);
            }
            updateDocuments((prev) => prev.filter(d => d.id !== id));
        };
    
        const handleUploadDocuments = async () => {
            try {
                setIsUploading(true);
                const formData = new FormData();
                let hasFiles = false;

                for (const doc of activeDocuments) {
                    if (doc.file) {
                        formData.append(doc.document_type, doc.file);
                        hasFiles = true;
                    }
                }

                if (!hasFiles) {
                    toast.error("No hay archivos para subir");
                    return;
                }
                if (user?.role === "CAREGIVER") {
                    await api.post("/caregivers/documents", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                        timeout: 60000,
                    });
                } else if (user?.role === "PATIENT") {
                    await api.post("/patients/documents", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                        timeout: 60000,
                    });
                }
                toast.success("Documentos subidos correctamente");
                if (user?.role === "CAREGIVER") {
                    queryClient.invalidateQueries({ queryKey: ["caregiver-documents"] });
                } else if (user?.role === "PATIENT") {
                    queryClient.invalidateQueries({ queryKey: ["patient-documents"] });
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Error al subir documentos");
                } else {
                    toast.error("Error desconocido al subir documentos");
                }
            }finally{
                setIsUploading(false);
            }
        };
  
        const handleDeleteDocFromServer=async(id:string) => {
            try {
                if (user?.role === "CAREGIVER") {
                    await api.delete(`/caregivers/documents/${id}`);
                } else if (user?.role === "PATIENT") {
                    await api.delete(`/patients/documents/${id}`);
                }
                toast.success("Documento eliminado correctamente");
                updateDocuments((prev) => prev.filter(doc => doc.id !== id));
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Error al eliminar documento");
                } else {
                    toast.error("Error desconocido al eliminar documento");
                }
            }
        }

      
     if(isLoading){
            return <div>Loading...</div>
        }
        return (
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                        Mis Documentos
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <p className='text-gray-500 mb-2'>DNI Frente</p>
                        {activeDocuments?.find(doc => doc.document_type === "dni_front") ? (
                            <ImageDocument 
                                document={activeDocuments.find(doc => doc.document_type === "dni_front")!} 
                                handleDeleteDocument={handleDeleteDocument} 
                                handleDeleteDocFromServer={handleDeleteDocFromServer} 
                            />
                        ) : (
                            <DocumentInput 
                                id="dni_front" 
                                handleFileUpload={handleFileUpload} 
                            />
                        )}
                    </div>
                    <div>
                        <p className='text-gray-500 mb-2'>DNI Posterior</p>
                        {activeDocuments?.find(doc => doc.document_type === "dni_back") ? (
                            <ImageDocument 
                                document={activeDocuments.find(doc => doc.document_type=== "dni_back")!} 
                                handleDeleteDocument={handleDeleteDocument} 
                                handleDeleteDocFromServer={handleDeleteDocFromServer} 
                            />
                        ) : (
                            <DocumentInput 
                                id="dni_back" 
                                handleFileUpload={handleFileUpload} 
                            />
                        )}
                    </div>
                    <div>
                        <p className='text-gray-500 mb-2'>Historial Clinico</p>
                        {activeDocuments?.find(doc => doc.document_type=== "medical_history") ? (
                            <ImageDocument 
                                document={activeDocuments.find(doc => doc.document_type=== "medical_history")!} 
                                handleDeleteDocument={handleDeleteDocument} 
                                handleDeleteDocFromServer={handleDeleteDocFromServer} 
                            />
                        ) : (
                            <DocumentInput 
                                id="medical_history" 
                                handleFileUpload={handleFileUpload} 
                            />
                        )}
                    </div>
                </div>
                <button
                disabled={isUploading}
                    onClick={handleUploadDocuments}
                    className="rounded-xl p-2 bg-primary text-white cursor-pointer hover:bg-primary/80"
                    >
                        {isUploading ? "Subiendo..." : "Subir documentos"}
                </button>
            

            {/* {documents.length > 0 ? (
                <ul className="space-y-3">
                    {documents.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                {doc.type.startsWith('image/') ? (
                                    <img 
                                        src={doc.previewUrl} 
                                        alt={doc.name} 
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-lg">
                                        📄
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                                    <p className="text-xs text-slate-400">{doc.uploadDate}</p>
                                </div>
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
            )} */}
        </div>
    )
}


const ImageDocument = ({ document, handleDeleteDocument, handleDeleteDocFromServer }: { document: UploadedDocument, handleDeleteDocument: (id: string) => void, handleDeleteDocFromServer: (id: string) => void }) => {
    return (
        <div className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
 
    
    <div className="w-[200px] h-[100px] overflow-hidden rounded">
      <img
        src={document?.file_url ?? document?.previewUrl}
        alt={document.name}
        className="w-full h-full object-cover"
      />
    </div>

    <button
      onClick={document?.file_url ? () => handleDeleteDocFromServer(document.id) : () => handleDeleteDocument(document.id)}
      className="absolute top-2 right-2 text-primary hover:text-primary-hover"
    >
      <XIcon className="h-5 w-5 cursor-pointer text-danger" />
    </button>


</div>
    )
}

interface DocumentInputProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

const DocumentInput = ({ handleFileUpload, id }: DocumentInputProps) => {
    return (
        <label
            htmlFor={id}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/10 px-6 py-8 text-center text-sm text-primary transition hover:border-primary-hover hover:bg-primary/20 cursor-pointer"
        >
            <span className="text-lg">📁 Sube tus documentos aquí</span>
            <span className="text-xs text-slate-400">PDF, DOC, JPG o PNG</span>
            <input
                id={id}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="sr-only"
            />
        </label>
    )
}
