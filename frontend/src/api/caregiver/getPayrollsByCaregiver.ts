import { api } from "../../lib/axios/api";
import type { PayrollsResponse } from "../../types";

export const getPayrollsByCaregiver = async (
  id: string,
  page = 1,
  limit = 10,
  status: string = "pending",
): Promise<PayrollsResponse> => {
  const { data } = await api.get(
    `/payrolls/caregiver/${id}?page=${page}&limit=${limit}&status=${status}`,
  );
  return data;
};
