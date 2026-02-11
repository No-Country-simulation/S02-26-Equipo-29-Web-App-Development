import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { api } from "../lib/axios/api";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { setRole } = useRole();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    const userToken = localStorage.getItem("userToken")
      ? JSON.parse(localStorage.getItem("userToken") as string)
      : null;
    if (userToken) {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${userToken.access_token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchProfData = async () => {
      try {
        const userData = await getUserData();
        setRole(userData.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProfData();
  }, [setRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <> {children}</>;
};
