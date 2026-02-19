import { useUser } from "../user/useUser";
import { usePatient } from "../patient/usePatient";
import { useQuery } from "@tanstack/react-query";
import { getCaregiverDocuments } from "../../api";


export const usePatientDocuments=()=>{
  const {data:user}=useUser();
  const {data:patient}=usePatient();

  return useQuery({
    queryKey:["patient-documents",patient?.profile_id],
    queryFn:getCaregiverDocuments,
    enabled:!!patient?.profile_id,
    staleTime:1000*60*5,
    gcTime:1000*60*10,
    retry:1,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    
  })  

    
}
