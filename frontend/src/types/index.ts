export interface User {
  full_name: string;
  role: string;
  email: string;
}

export interface Caregiver extends User {
  id?: string;
  profile_id?: string;
  phone?: string;
  shiftRange: string;
  documents?: { type: string; file_url: string }[];
  front_dni?: string;
  back_dni?: string;
  profileImage?: string;
  cbu?: string;
  mercado_pago_alias?: string;
  hourly_rate?: number;
  credentials?: string;
  status?: string;
  created_at?: string;
}

export interface Patient extends User {
  profile_id?: string;
  id?: string;
  dni?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  front_dni?: string;
  back_dni?: string;
  status?: string;
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
}

export interface Shift {
  id: string;
  created_by: ShiftCreatedBy;
  caregiver: ShiftCaregiverSummary | null;
  patient: ShiftPatientSummary;
  startTime?: string;
  endTime?: string;
  status?: string;
  hours?: number;
  location?: string;
  report?: string;
}

