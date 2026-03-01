import { api } from "../../lib/axios/api";
import type { ShiftsResponse } from "../../types";

export const getShifts = async (page = 1, limit = 10): Promise<ShiftsResponse> => {
  const { data } = await api.get(`/shifts?page=${page}&limit=${limit}`);
  return data;
};