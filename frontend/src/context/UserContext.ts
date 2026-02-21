// import { createContext, useContext } from "react";

// export type Role = "ADMIN" | "CAREGIVER" | "PATIENT";

// export interface UserData {
//   id: string;
//   full_name: string;
//   role: Role;
//   email: string;
//   phone?: string;
// }

// export interface UserContextType {
//   user: UserData | null;
//   setUser: (user: UserData | null) => void;
//   loading: boolean;
//   handleLogout: () => void;
//   checkSession: () => Promise<void>;
// }

// export const UserContext = createContext<UserContextType | undefined>(
//   undefined,
// );

// export function useUser() {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }

// export function useRole() {
//   const { user } = useUser();
//   return user?.role ?? "PATIENT";
// }
