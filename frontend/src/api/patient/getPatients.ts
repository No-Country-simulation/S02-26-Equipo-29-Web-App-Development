import { api } from "../../lib/axios/api";

export const getPatients=async()=>{
    const response=await api.get(`/patients`);
    return response.data;
}