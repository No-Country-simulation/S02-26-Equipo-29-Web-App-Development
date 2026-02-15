import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Caregiver } from "../../types";
import { toast } from "sonner";
import { api } from "../../lib/axios/api";
import { isAxiosError } from "axios";

interface EditProfileFormData {
    full_name: string;
    email: string;
    phone: string;
    cbu?: string;
    mercado_pago_alias?: string;
    hourly_rate?: number;
}

interface EditProfileFormProps {
    user: Caregiver;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
    user,
}) => {
 const [isPending,setIsPending] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileFormData>({
        defaultValues: {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            cbu: user.cbu || "",
            mercado_pago_alias: user.mercado_pago_alias || "",
            hourly_rate: user.hourly_rate || 0,
        },
    });

   const onSubmit = async (formData: EditProfileFormData) => {

    try {
        setIsPending(true);
        const response = await api.put(`/caregivers/${user?.id}`, formData);
        toast.success(response.data.message);
    } catch (error) {
       if(isAxiosError(error)){
        toast.error(error.response?.data.message);
       }
        toast.error("Error al editar el perfil");
        
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