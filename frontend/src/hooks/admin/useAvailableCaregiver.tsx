import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import type { Caregiver } from "../../types";
import { getAvailableCaregivers } from "../../api";

export const useAvailableCaregivers = (start?: string, end?: string) => {
  const { data: user } = useUser();
  return useQuery<Caregiver[]>({
    queryKey: ["availableCaregivers", start, end],
    queryFn: () => getAvailableCaregivers(start, end),
    enabled: user?.role === "ADMIN",
    staleTime: 1000 * 60, // Reduced staleTime for availability
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: true, // More aggressive refetching for real-time status
    refetchOnMount: true,
  });
};
