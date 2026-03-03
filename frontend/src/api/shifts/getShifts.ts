import { api } from "../../lib/axios/api";
import type { ShiftsResponse } from "../../types";

export const getShifts = async (
  page = 1,
  limit = 10,
  status?: string,
): Promise<ShiftsResponse> => {
  let url = `/shifts?page=${page}&limit=${limit}`;
  if (status && status !== "ALL") {
    url += `&status=${status}`;
  }
  const { data } = await api.get(url);
  return data;
};
