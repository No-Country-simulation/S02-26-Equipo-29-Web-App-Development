import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import { getCaregiverById } from "../../api";
import { api } from "../../lib/axios/api";


export const useCaregiver=()=>{
  const {data:user}=useUser();
  const caregiverProfileId = user?.profile?.id || user?.profile_id || user?.id;
  return useQuery({
    queryKey:["caregiver",caregiverProfileId],
    queryFn:()=>getCaregiverById(caregiverProfileId as string),
    enabled:!!caregiverProfileId,
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    })
    
}

export const useCaregiverShifts=()=>{
  const {data:user}=useUser();
  const caregiverProfileId = user?.profile?.id || user?.profile_id || user?.id;
  return useQuery({
    queryKey:["caregiverShifts",caregiverProfileId],
    queryFn:()=>getCaregiverShiftsById(caregiverProfileId as string),
    enabled:!!caregiverProfileId,
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    })
    
}

const getCaregiverShiftsById=async(id:string)=>{
  const response=await api.get(`/shifts/caregiver/${id}`);
  return response.data;
}