import { createContext, useContext } from "react";

export type Role = "ADMIN" | "CAREGIVER" | "PATIENT";

export interface UserData {
  id: number;
  full_name: string;
  role: Role;
  email: string;
}

export interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a RoleProvider");
  }
  return context;
}

export function useRole() {
  const { user } = useUser();
  return user?.role ?? "PATIENT";
}
