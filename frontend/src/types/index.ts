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
}

export interface Patient extends User {
  id?: string;
  dni?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  front_dni?: string;
  back_dni?: string;
}
