import { api } from "../../lib/axios/api";


export const getAvailableCaregivers = async (start?: string, end?: string) => {
    const response = await api.get("/admin/available-caregivers", {
        params: { start, end }
    });
    return response.data || [];
};