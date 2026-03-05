import { useQuery } from "@tanstack/react-query";
import { useUser } from "../user/useUser";
import { getRegistrations } from "../../api";
import type { RegistrationResponse } from "../../types";

export const useRegistrations = () => {
  const { data: user } = useUser();
  return useQuery<RegistrationResponse>({
    queryKey: ["registrations"],
    queryFn: getRegistrations,
    enabled: user?.role === "ADMIN",
  });
};
