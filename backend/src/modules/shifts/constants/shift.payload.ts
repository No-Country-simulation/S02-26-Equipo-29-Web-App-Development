export interface ShiftConfirmedMailPayload {
  to: string;
  date: string;
  patient: string;
  caregiver: string;
}

export interface ShiftAssignedMailPayload {
  to: string;
  date: string;
  patient: string;
  caregiver?: string;
}
