import { api } from "../../lib/axios/api";
import type { DashboardResponse } from "../../types";

export const getDashboard = async (): Promise<DashboardResponse> => {
    const { data } = await api.get(`/admin/dashboard`);
    return data;
}