export const ShiftType = {
  assigned: 'assigned',
  rejected: 'rejected',
  completed: 'completed',
  pending: 'pending',
  confirmed: 'confirmed',
} as const;

export type ShiftType = (typeof ShiftType)[keyof typeof ShiftType];
