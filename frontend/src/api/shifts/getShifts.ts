
import { api } from "../../lib/axios/api";

export const getShifts = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/shifts`, {
    params: { page, limit },
  });
  return response.data;
};