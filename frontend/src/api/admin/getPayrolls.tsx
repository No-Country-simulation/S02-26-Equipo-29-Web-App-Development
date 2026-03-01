import { api } from "../../lib/axios/api";
import type { PayrollsResponse } from "../../types";

export const getPayrolls = async (page = 1, limit = 10): Promise<PayrollsResponse> => {
    const { data } = await api.get(`/payrolls?page=${page}&limit=${limit}`);
    return data;
}