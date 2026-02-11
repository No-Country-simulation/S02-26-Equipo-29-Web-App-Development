export interface User {
  full_name: string;
  role: string;
  email: string;
}

export interface Caregiver extends User {
  id?: string;
  phone?: string;
  shiftRange: string;
  profileImage?: string;
}
