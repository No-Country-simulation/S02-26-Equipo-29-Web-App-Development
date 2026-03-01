import { Navigate } from "react-router-dom";
import { useUser } from "../hooks";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useUser();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return <> {children}</>;
};
