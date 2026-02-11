import { useState } from "react";
import { RoleContext, type Role } from "./RoleContext";

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>("PATIENT");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
