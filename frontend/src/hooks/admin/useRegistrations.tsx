import { useQuery } from "@tanstack/react-query"
import { getRegistrations } from "../../api"




export const useRegistrations=()=>{
    return useQuery({
        queryKey: ["registrations"],
        queryFn: () => getRegistrations(),
        staleTime: 1000 * 60 * 5,
    })
}