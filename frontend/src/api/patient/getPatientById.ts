import { api } from "../../lib/axios/api";

export const getPatientById=async(id:string)=>{
    const response=await api.get(`/patients/${id}`);
    return response.data;
}