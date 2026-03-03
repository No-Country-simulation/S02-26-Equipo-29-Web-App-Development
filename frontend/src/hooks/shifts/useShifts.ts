import { useQuery } from "@tanstack/react-query";
import { getShifts } from "../../api/shifts/getShifts";
import type { ShiftsResponse } from "../../types";

export const useShifts = (page = 1, limit = 10, status?: string) => {
  return useQuery<ShiftsResponse>({
    queryKey: ["shifts", page, limit, status],
    queryFn: () => getShifts(page, limit, status),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
