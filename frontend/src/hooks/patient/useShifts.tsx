import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePatient } from "./usePatient";
import { createShift, getPatientShifts, type CreateShiftRequest } from "../../api/patient/shifts";
import { api } from "../../lib/axios/api";

export const useShifts = () => {
  const { data: patient } = usePatient();
  const queryClient = useQueryClient();

  // Obtener shifts
  const shiftsQuery = useQuery({
    queryKey: ["shifts", patient?.profile_id],
    queryFn: () => getPatientShifts(patient?.profile_id as string),
    enabled: !!patient?.profile_id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Crear shift
  const createShiftMutation = useMutation({
    mutationFn: (data: Omit<CreateShiftRequest, "patientId">) => {
      if (!patient?.profile_id) {
        throw new Error("No se pudo identificar el paciente autenticado");
      }

      // Convertir datetime-local a ISO string si es necesario
      const startTime = data.start_time.includes("T") 
        ? new Date(data.start_time).toISOString()
        : data.start_time;
      const endTime = data.end_time.includes("T")
        ? new Date(data.end_time).toISOString()
        : data.end_time;

      return createShift({
        ...data,
        patientId: patient.profile_id,
        start_time: startTime,
        end_time: endTime,
      });
    },
    onSuccess: () => {
      // Refrescar la lista de shifts
      queryClient.invalidateQueries({ queryKey: ["shifts", patient?.profile_id] });
    },
    onError: (error: Error) => {
      console.error("Error creating shift:", error);
    },
  });

  return {
    shifts: shiftsQuery.data || [],
    isLoading: shiftsQuery.isLoading,
    isError: shiftsQuery.isError,
    error: shiftsQuery.error,
    createShift: createShiftMutation.mutate,
    isCreating: createShiftMutation.isPending,
    createError: createShiftMutation.error,
  };
};

export const useFinalizeShift = () => {
  const queryClient = useQueryClient();
  const { data: patient } = usePatient();
  
  return useMutation({
    mutationFn: async (payload: { shiftId: string; number: number; notes: string }) => {
      const response = await api.post("/ratings", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts", patient?.profile_id] });
    },
  });
};
