import { api } from "../../lib/axios/api"

export const getCaregivers=async()=>{
  const {data}=await api.get("/caregivers")
  return data
}