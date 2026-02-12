import { useEffect, useState } from "react";
import { UserContext, type UserData } from "./UserContext";
import { api } from "../lib/axios/api";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    const storedToken = localStorage.getItem("userToken");
    const userToken = storedToken ? JSON.parse(storedToken) : null;
    if (!userToken?.access_token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`http://localhost:3002/auth/me`, {
        headers: {
          Authorization: `Bearer ${userToken.access_token}`,
        },
      });
      console.log("User role fetched successfully:", response.data);
      const userData: UserData = {
        id: response.data.id,
        full_name: response.data.full_name,
        role: response.data.role,
        email: response.data.email,
        phone: response.data.phone
      };
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, handleLogout, checkSession }}
    >
      {children}
    </UserContext.Provider>
  );
};
