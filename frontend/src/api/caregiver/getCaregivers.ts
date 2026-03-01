import { api } from "../../lib/axios/api"
import type { Caregiver } from "../../types"

export const getCaregivers = async (): Promise<Caregiver[]> => {
  const { data } = await api.get("/caregivers")
  return data
}