import { api } from "../../lib/axios/api";

export const getCaregiverById=async(id:string)=>{
    const response=await api.get(`/caregivers/${id}`);
    return response.data;
}