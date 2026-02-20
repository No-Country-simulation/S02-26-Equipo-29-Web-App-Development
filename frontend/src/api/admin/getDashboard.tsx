import { api } from "../../lib/axios/api";


export const getDashboard=async()=>{
    const {data}=await api.get(`/admin/dashboard`);
    return data;
}