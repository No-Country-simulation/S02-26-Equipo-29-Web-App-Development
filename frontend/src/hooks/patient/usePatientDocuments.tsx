import { usePatient } from "../patient/usePatient";
import { useQuery } from "@tanstack/react-query";
import { getPatientDocuments } from "../../api/patient/getPatientDocuments";


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
