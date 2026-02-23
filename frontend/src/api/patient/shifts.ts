import { api } from "../../lib/axios/api";
import type { Shift } from "../../types";

export interface CreateShiftRequest {
  patientId: string;
  caregiverId: string;
  start_time: string;
  end_time: string;
  report?: string;
}

type ShiftApiResponse = {
  id: string;
  created_by?: {
    id: string;
    full_name: string;
    phone?: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
  };
  profile?: {
    id?: string;
    full_name?: string;
    phone?: string | null;
    role?: string;
    is_active?: boolean;
    created_at?: string;
  };
  caregiver: {
    profile_id: string;
    phone: string | null;
    cbu: string | null;
    mercado_pago_alias: string | null;
    hourly_rate: number | null;
    is_verified: boolean;
    status: string;
    profile?: {
      full_name?: string;
    };
  } | null;
  patient: {
    profile_id: string;
  };
  start_time: string;
  end_time: string;
  report?: string | null;
  service?: string | null;
  status?: string;
  hours?: number;
};

type PaginatedShiftsResponse = {
  data: ShiftApiResponse[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

const mapShift = (shift: ShiftApiResponse): Shift => ({
  id: shift.id,
  created_by:
    shift.created_by
      ? {
          id: shift.created_by.id,
          full_name: shift.created_by.full_name,
          phone: shift.created_by.phone ?? null,
          role: shift.created_by.role,
          is_active: shift.created_by.is_active,
          created_at: shift.created_by.created_at,
        }
      : {
          id: shift.profile?.id || "",
          full_name: shift.profile?.full_name || "Sin nombre",
          phone: shift.profile?.phone ?? null,
          role: shift.profile?.role || "",
          is_active: shift.profile?.is_active ?? true,
          created_at: shift.profile?.created_at || "",
        },
  caregiver: shift.caregiver
    ? {
        profile_id: shift.caregiver.profile_id,
        phone: shift.caregiver.phone,
        cbu: shift.caregiver.cbu,
        mercado_pago_alias: shift.caregiver.mercado_pago_alias,
        hourly_rate: shift.caregiver.hourly_rate,
        is_verified: shift.caregiver.is_verified,
        status: shift.caregiver.status,
        full_name: shift.caregiver.profile?.full_name,
      }
    : null,
  patient: shift.patient,
  startTime: shift.start_time,
  endTime: shift.end_time,
  report: shift.report ?? undefined,
  location: shift.service || undefined,
  status: shift.status,
  hours: shift.hours,
});

export const getPatientShifts = async (patientId: string): Promise<Shift[]> => {
  const response = await api.get<PaginatedShiftsResponse>(`/shifts/patient/${patientId}`);
  return response.data.data.map(mapShift);
};

export const createShift = async (
  data: CreateShiftRequest
): Promise<Shift> => {
  const response = await api.post<ShiftApiResponse>(`/shifts`, {
    patientId: data.patientId,
    caregiverId: data.caregiverId,
    start_time: data.start_time,
    end_time: data.end_time,
    service: "Cuidado general",
    report: data.report || undefined,
  });
  return mapShift(response.data);
};
