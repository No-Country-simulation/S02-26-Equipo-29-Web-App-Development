import { useQuery } from "@tanstack/react-query";
import { useUser } from "../user/useUser";
import { getDashboard } from "../../api";
import type { DashboardResponse } from "../../types";

export const useDashboard = () => {
  const { data: user } = useUser();
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
    enabled: user?.role === "ADMIN",
    staleTime: 1000 * 60 * 5,
  });
};
