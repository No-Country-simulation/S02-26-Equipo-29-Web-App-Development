import { useState, useEffect } from "react";
import { UserContext, type UserData } from "./RoleContext";
import axios from "axios";

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const storedToken = localStorage.getItem("userToken");
      const userToken = storedToken ? JSON.parse(storedToken) : null;
      if (!userToken?.access_token) {
        setUser(null);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3002/auth/me", {
          headers: {
            Authorization: `Bearer ${userToken.access_token}`,
          },
        });
        const userData: UserData = {
          id: response.data.id,
          full_name: response.data.full_name,
          role: response.data.role,
          email: response.data.email,
        };
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUser(null);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
