import { useQuery } from "@tanstack/react-query";
import { getShifts } from "../../api";


export const useShifts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["shifts", page, limit],
    queryFn: () => getShifts(page, limit),
    staleTime: 1000 * 60 * 5, 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};