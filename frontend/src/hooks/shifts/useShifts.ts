import { useQuery } from "@tanstack/react-query";
import { getShifts } from "../../api/shifts/getShifts";
import type { ShiftsResponse } from "../../types";

export const useShifts = (page = 1, limit = 10) => {
  return useQuery<ShiftsResponse>({
    queryKey: ["shifts", page, limit],
    queryFn: () => getShifts(page, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};