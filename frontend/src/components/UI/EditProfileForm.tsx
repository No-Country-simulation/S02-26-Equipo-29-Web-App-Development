import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Caregiver, Patient } from "../../types";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useUser, useUpdateProfile } from "../../hooks";
import { useCaregiver } from "../../hooks";
import { usePatient } from "../../hooks/patient/usePatient";
interface EditProfileFormData {
    full_name: string;
    email: string;
    phone?: string;
    cbu?: string;
    mercado_pago_alias?: string;
    hourly_rate?: number;
    address?: string;
    notes?: string;
    dni?: string;
}

interface EditProfileFormPropsCaregiver {
    user: Caregiver
}

interface EditProfileFormPropsPatient {
    user: Patient
}

type EditProfileFormProps = EditProfileFormPropsCaregiver | EditProfileFormPropsPatient;

export const EditProfileForm: React.FC<EditProfileFormProps & { handleUpdateSuccess: () => void }> = ({
    user, handleUpdateSuccess
}) => {
 const [isPending,setIsPending] = useState(false);
 const { data: currentUser } = useUser();
 const { data: caregiverData } = useCaregiver();
 const { data: patientData } = usePatient();
 

    const defaultValues: EditProfileFormData = {
        full_name: user.full_name,
        email: user.email,
        ...(currentUser?.role === "CAREGIVER" && {
            phone: caregiverData?.phone || "",
            cbu: caregiverData?.cbu || "",
            mercado_pago_alias: caregiverData?.mercado_pago_alias || "",
            hourly_rate: caregiverData?.hourly_rate || 0,
        }),
        ...(currentUser?.role === "PATIENT" && {
            address: patientData?.address || "",
            notes: patientData?.notes || "",
            dni: patientData?.dni || "",
        }),
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileFormData>({
        defaultValues,
    });

    const updateProfile = useUpdateProfile();

   const onSubmit = async (formData: EditProfileFormData) => {
    try {
        setIsPending(true);
        const role = currentUser?.role as string;
        const profileData = role === "CAREGIVER" ? {
            phone: formData.phone,
            cbu: formData.cbu,
            mercado_pago_alias: formData.mercado_pago_alias,
            hourly_rate: formData.hourly_rate,
        } : {
            dni: formData.dni,
            address: formData.address,
            notes: formData.notes,
        };

        await updateProfile.mutateAsync({
            id: user?.id as string,
            role,
            data: profileData,
        });
        
        toast.success("Perfil actualizado exitosamente");
        handleUpdateSuccess();
    } catch (error: unknown) {
       if(isAxiosError(error)){
        toast.error(error.response?.data.message);
       } else {
        toast.error("Error al editar el perfil");
       }
    }finally{
        setIsPending(false);
    }
   }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                </label>
                <input
                    type="text"
                    {...register("full_name", {
                        
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                />
                {errors.full_name && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.full_name.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    {...register("email", {
                        
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Email inválido",
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                </label>
                <input
                    type="tel"
                    {...register("phone", {
                        
                        pattern: {
                            value: /^[0-9+\-\s()]{7,}$/,
                            message: "Teléfono inválido",
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+34 123 456 789"
                />
                {errors.phone && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                    </span>
                )}
            </div>

            {currentUser?.role === "CAREGIVER" && (
            <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    CBU
                </label>
                <input
                    type="text"
                    {...register("cbu", {
                        
                        pattern: {
                            value: /^\d{22}$/,
                            message: "CBU inválido",
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="**********************"
                />
                {errors.cbu && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.cbu.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alias Mercado Pago
                </label>
                <input
                    type="text"
                    {...register("mercado_pago_alias", {
                        
                        pattern: {
                            value: /^[a-zA-Z0-9_.-]{5,20}$/,
                            message: "Alias de Mercado Pago inválido",
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="**********************"
                />
                {errors.mercado_pago_alias && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.mercado_pago_alias.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor por Hora
                </label>
                <input
                    type="number"
                    {...register("hourly_rate", {
                        
                        pattern: {
                            value: /^\d+(\.\d{1,2})?$/,
                            message: "Valor por hora inválido",
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="**********************"
                />
                {errors.hourly_rate && (
                    <span className="text-red-500 text-sm mt-1">
                        {errors.hourly_rate.message}
                    </span>
                )}
            </div>
            </>
            )}

            {currentUser?.role === "PATIENT" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                    </label>
                    <input
                        type="text"
                        {...register("address", {
                            
                            minLength: { value: 5, message: "Mínimo 5 caracteres" },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu dirección"
                    />
                    {errors.address && (
                        <span className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                        </span>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                        Notas
                    </label>
                    <textarea
                        {...register("notes", { 
                            
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tus notas"
                    />
                    {errors.notes && (
                        <span className="text-red-500 text-sm mt-1">
                            {errors.notes.message}
                        </span>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                        DNI
                    </label>
                    <input
                        type="text"
                        {...register("dni", {
                            
                            minLength: { value: 5, message: "Mínimo 5 caracteres" },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu DNI"
                    />
                    {errors.dni && (
                        <span className="text-red-500 text-sm mt-1">
                            {errors.dni.message}
                        </span>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-400 transition-colors"
            >
                {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
        </form>
    );
};