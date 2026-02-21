import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/user/getUser";



export const useUser=()=>{
    return useQuery({
        queryKey:["user"],
        queryFn:getUser,
        staleTime:1000*60*5,
        retry:1,
    })
}