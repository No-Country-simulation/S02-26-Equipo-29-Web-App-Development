import { getCaregivers } from "../../api";
import { useQuery } from "@tanstack/react-query";
import type { Caregiver } from "../../types";

export const useCaregivers = () => {
  return useQuery<Caregiver[]>({
    queryKey: ["caregivers"],
    queryFn: getCaregivers,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
