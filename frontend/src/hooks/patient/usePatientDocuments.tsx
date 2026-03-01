import { usePatient } from "../patient/usePatient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientDocuments } from "../../api/patient/getPatientDocuments";
import { api } from "../../lib/axios/api";


export const usePatientDocuments=()=>{
  const {data:patient}=usePatient();

  return useQuery({
    queryKey:["patient-documents",patient?.profile_id],
    queryFn:getPatientDocuments,
    enabled:!!patient?.profile_id,
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    
  })  
}

export const useUploadPatientDocuments = () => {
  const queryClient = useQueryClient();
  const { data: patient } = usePatient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/patients/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-documents", patient?.profile_id] });
    },
  });
};

export const useDeletePatientDocument = () => {
  const queryClient = useQueryClient();
  const { data: patient } = usePatient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/patients/documents/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-documents", patient?.profile_id] });
    },
  });
};
