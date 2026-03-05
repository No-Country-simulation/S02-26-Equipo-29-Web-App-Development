import { api } from "../../lib/axios/api";
import type { RegistrationResponse } from "../../types";

export const getRegistrations = async (): Promise<RegistrationResponse> => {
    const { data } = await api.get(`/admin/registrations`);
    return data;
}