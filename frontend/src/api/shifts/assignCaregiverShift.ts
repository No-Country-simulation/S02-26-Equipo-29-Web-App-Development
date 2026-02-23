import { api } from "../../lib/axios/api";


export const assignCaregiverShift = async (shiftId: string, caregiverId: string) => {
  const response = await api.patch(`/shifts/${shiftId}`, { caregiverId });
  return response.data;
};