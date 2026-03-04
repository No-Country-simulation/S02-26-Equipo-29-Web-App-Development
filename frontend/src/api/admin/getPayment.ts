import { api } from "../../lib/axios/api";

export const getPayment = async (id: string) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};
