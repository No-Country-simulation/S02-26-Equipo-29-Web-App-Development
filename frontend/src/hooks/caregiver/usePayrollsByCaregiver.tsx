import { useQuery } from "@tanstack/react-query";
import { getPayrollsByCaregiver } from "../../api/caregiver/getPayrollsByCaregiver";
import type { PayrollsResponse } from "../../types";

export const usePayrollsByCaregiver = (
  id?: string,
  page: number = 1,
  limit: number = 10,
  status: string = "pending",
) => {
  return useQuery<PayrollsResponse>({
    queryKey: ["payrolls", "caregiver", id, page, limit, status],
    queryFn: () => getPayrollsByCaregiver(id!, page, limit, status),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
