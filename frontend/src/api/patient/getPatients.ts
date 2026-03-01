import { api } from "../../lib/axios/api";
import type { Patient } from "../../types";

export const getPatients = async (): Promise<Patient[]> => {
    const response = await api.get(`/patients`);
    return response.data;
}