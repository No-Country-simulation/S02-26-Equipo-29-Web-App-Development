import { useQuery } from "@tanstack/react-query";
import {
  getShiftsReport,
  getPayrollsReport,
  getNewUsersReport,
} from "../../api/admin/report";

export const useReport = (from: string, to: string) => {
  const enabled = Boolean(from && to);
  const shifts = useQuery({
    queryKey: ["report-shifts", from, to],
    queryFn: () => getShiftsReport(from, to),
    enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const payrolls = useQuery({
    queryKey: ["report-payrolls", from, to],
    queryFn: () => getPayrollsReport(from, to),
    enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const newUsers = useQuery({
    queryKey: ["report-new-users", from, to],
    queryFn: () => getNewUsersReport(from, to),
    enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return {
    shifts: shifts.data ?? [],
    payrolls: payrolls.data ?? [],
    newUsers: newUsers.data ?? [],
    isLoading: shifts.isLoading || payrolls.isLoading || newUsers.isLoading,
    isError: shifts.isError || payrolls.isError || newUsers.isError,
  };
};
