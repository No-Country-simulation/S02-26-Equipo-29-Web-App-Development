import { api } from "../../lib/axios/api";

export const getUser=async()=>{
    const response=await api.get(`/auth/me`);
    return response.data;
}