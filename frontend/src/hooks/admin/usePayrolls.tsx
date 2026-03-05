import { useQuery } from "@tanstack/react-query";
import { useUser } from "../user/useUser";
import { getPayrolls } from "../../api";
import type { PayrollsResponse } from "../../types";

export const usePayrolls = (
  page: number = 1,
  limit = 10,
  status: string = "pending",
) => {
  const { data: user } = useUser();
  return useQuery<PayrollsResponse>({
    queryKey: ["payrolls", page, limit, status],
    queryFn: () => getPayrolls(page, limit, status),
    enabled:
      !!user?.id && (user?.role === "ADMIN" || user?.role === "CAREGIVER"),
    staleTime: 1000 * 60 * 5,
  });
};
