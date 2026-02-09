import { createContext, useContext } from "react";

export type Role = "admin" | "caregiver" | "patient";

export interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined,
);

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
