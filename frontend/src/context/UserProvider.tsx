// import { useEffect, useState } from "react";
// import { UserContext, type UserData } from "./UserContext";
// import { api } from "../lib/axios/api";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const checkSession = async () => {
//     setLoading(true);
//     const storedToken = localStorage.getItem("userToken");
//     const userToken = storedToken ? JSON.parse(storedToken) : null;
//     if (!userToken?.access_token) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await api.get(`http://localhost:3002/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${userToken.access_token}`,
//         },
//       });
//       const userData: UserData = {
//         id: response.data.id,
//         full_name: response.data.full_name,
//         role: response.data.role,
//         email: response.data.email,
//         phone: response.data.phone
//       };
//       setUser(userData);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkSession();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     setUser(null);
//     navigate("/login");
//     toast.warning("Sesión finalizada");
//   };

//   return (
//     <UserContext.Provider
//       value={{ user, setUser, loading, handleLogout, checkSession }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
