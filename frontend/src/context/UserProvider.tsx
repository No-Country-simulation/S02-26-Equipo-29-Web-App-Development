import { useEffect, useState } from "react";
import { UserContext, type UserData } from "./UserContext";
import axios from "axios";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("userToken");
      const userToken = storedToken ? JSON.parse(storedToken) : null;
      if (!userToken?.access_token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
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
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, loading }}>
      {children}
    </UserContext.Provider>
  );
};
