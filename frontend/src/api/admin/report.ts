import { api } from "../../lib/axios/api";

export interface ShiftReport {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  hours?: number;
  caregiver?: { profile?: { full_name?: string } } | null;
  patient?: { profile?: { full_name?: string } } | null;
  rating?: { number: number } | null;
}

export interface PayrollReport {
  full_name: string;
  totalHours: string;
  totalAmount: string;
  status: string;
  paid_at?: string | null;
  cbu?: string | null;
  mercado_pago_alias?: string | null;
}

export interface NewUserReport {
  full_name: string;
  role: string;
  email?: string;
  created_at: string;
}

export const getShiftsReport = async (from: string, to: string): Promise<ShiftReport[]> => {
  const response = await api.get<ShiftReport[]>(`/shifts/report?from=${from}&to=${to}`);
  return response.data;
};

export const getPayrollsReport = async (from: string, to: string): Promise<PayrollReport[]> => {
  const response = await api.get<PayrollReport[]>(`/payrolls/report?from=${from}&to=${to}`);
  return response.data;
};

export const getNewUsersReport = async (from: string, to: string): Promise<NewUserReport[]> => {
  const response = await api.get<NewUserReport[]>(`/profiles/report?from=${from}&to=${to}`);
  return response.data;
};
