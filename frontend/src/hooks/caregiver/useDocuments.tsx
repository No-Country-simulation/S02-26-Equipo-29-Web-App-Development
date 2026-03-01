import { useUser } from "../user/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCaregiverDocuments } from "../../api";
import { api } from "../../lib/axios/api";


export const useCaregiverDocuments=()=>{
  const {data:user}=useUser();
  return useQuery({
    queryKey:["caregiver-documents",user?.id],
    queryFn:getCaregiverDocuments,
    enabled:!!user?.id,
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    
  })  
}

export const useUploadCaregiverDocuments = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/caregivers/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-documents", user?.id] });
    },
  });
};

export const useDeleteCaregiverDocument = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/caregivers/documents/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-documents", user?.id] });
    },
  });
};
