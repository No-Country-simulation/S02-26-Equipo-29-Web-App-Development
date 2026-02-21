import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "../../api/patient/getPatientById";


export const usePatient=()=>{
  const {data:user}=useUser();
  return useQuery({
    queryKey:["patient",user?.id],
    queryFn:()=>getPatientById(user?.id as string),
    enabled:!!user?.id,  
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    })
    
}
