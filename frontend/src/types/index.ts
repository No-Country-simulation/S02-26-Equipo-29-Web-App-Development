export interface User {
  id?: string;
  profile_id?: string;
  full_name: string;
  role: string;
  email: string;
  phone?: string;
  created_at?: string;
  status?: string;
}

export interface Caregiver extends User {
  shiftRange?: string;
  documents?: { type: string; file_url: string }[];
  front_dni?: string;
  back_dni?: string;
  profileImage?: string;
  cbu?: string;
  mercado_pago_alias?: string;
  hourly_rate?: number;
  credentials?: string;
  profile?: {
    id: string;
    full_name: string;
    phone: string;
    created_at: string;
    role: string;
  };
}

export interface Patient extends User {
  dni?: string;
  address?: string;
  notes?: string;
  front_dni?: string;
  back_dni?: string;
  profile?: {
    id: string;
    full_name: string;
    phone: string;
    created_at: string;
    role: string;
  };
}

export interface ShiftCreatedBy {
  id: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface ShiftCaregiverSummary {
  profile_id: string;
  phone: string | null;
  cbu: string | null;
  mercado_pago_alias: string | null;
  hourly_rate: number | null;
  is_verified: boolean;
  status: string;
  full_name?: string;
}

export interface ShiftPatientSummary {
  profile_id: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  status?: string;
  full_name?: string;
  profile?: {
    full_name: string;
    id: string;
  };
}

export interface ShiftRatingSummary {
  number: number;
  notes?: string | null;
}

export interface Shift {
  id: string;
  created_by: ShiftCreatedBy;
  caregiver: ShiftCaregiverSummary | null;
  patient: ShiftPatientSummary;
  startTime?: string;
  endTime?: string;
  start_time?: string;
  end_time?: string;
  status: string;
  hours?: number;
  location?: string;
  report?: string;
  rating?: ShiftRatingSummary | null;
  service?: string;
}

export interface Payroll {
  profile_id: string;
  cbu: string | null;
  mercado_pago_alias: string | null;
  hourly_rate: number | null;
  status: string;
  full_name: string;
  totalHours: number;
  totalAmount: number;
}

export interface RegistrationResponse {
  caregivers: Caregiver[];
  patients: Patient[];
}

export interface ShiftsResponse {
  data: Shift[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface PayrollsResponse {
  payrolls: Payroll[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface DashboardResponse {
  patients: { total: number; growth: number };
  caregivers: { total: number; growth: number };
  hours: { hours: number; growth: number };
  ratings: { ratings: number; growth: number };
  shifts: Shift[];
}
