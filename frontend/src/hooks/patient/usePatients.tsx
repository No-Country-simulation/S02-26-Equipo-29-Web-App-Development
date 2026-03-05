import { useUser } from "../user/useUser";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../../api/patient/getPatients";
import type { Patient } from "../../types";

export const usePatients = () => {
  const { data: user } = useUser();
  return useQuery<Patient[]>({
    queryKey: ["patients", user?.id],
    queryFn: () => getPatients(),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
