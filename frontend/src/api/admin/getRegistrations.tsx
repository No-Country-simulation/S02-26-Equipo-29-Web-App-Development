

import { api } from "../../lib/axios/api";


export const getRegistrations=async()=>{
    const {data}=await api.get(`/admin/registrations`);
    return data;
}