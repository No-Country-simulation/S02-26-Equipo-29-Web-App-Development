import { api } from "../../lib/axios/api";

interface NextShiftResponse {
  caregiver: {
    phone: string;
    profile: {
      full_name: string;
    };
  };
  start_time: string;
  end_time: string;
  hours: number;
}

export const getNextShift = async (
  patientId: string,
): Promise<NextShiftResponse> => {
  const response = await api.get<NextShiftResponse>(
    `/shifts/patient/${patientId}/next`,
  );
  return response.data;
};
