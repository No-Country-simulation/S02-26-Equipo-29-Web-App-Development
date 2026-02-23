import { api } from "../../lib/axios/api";

export const updateShiftStatus = async (id: string, status: string) => {
    
    const response = await api.patch(`/shifts/${id}/status`, { status });
    return response.data;
};