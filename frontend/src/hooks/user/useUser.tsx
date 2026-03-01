import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../api/user/getUser";
import { api } from "../../lib/axios/api";


export const useUser=()=>{
    return useQuery({
        queryKey:["user"],
        queryFn:getUser,
        staleTime:1000*60*5,
        retry:1,
    })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, role, data }: { id: string; role: string; data: Record<string, unknown> }) => {
      if (role === "CAREGIVER") {
        const response = await api.put(`/caregivers/${id}`, data);
        return response.data;
      } else {
        const response = await api.patch(`/patients/${id}`, data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};