import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import { getCaregiverById } from "../../api";


export const useCaregiver=()=>{
  const {data:user}=useUser();
  return useQuery({
    queryKey:["caregiver",user?.id],
    queryFn:()=>getCaregiverById(user?.id as string),
    enabled:!!user?.id,  
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    })
    
}
