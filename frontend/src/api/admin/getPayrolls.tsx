import { api } from "../../lib/axios/api";
import type { PayrollsResponse } from "../../types";

export const getPayrolls = async (
  page = 1,
  limit = 10,
  status?: string,
): Promise<PayrollsResponse> => {
  const { data } = await api.get(
    `/payrolls?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`,
  );
  return data;
};
