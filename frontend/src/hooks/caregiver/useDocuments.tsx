import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import { getCaregiverDocuments } from "../../api";


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
