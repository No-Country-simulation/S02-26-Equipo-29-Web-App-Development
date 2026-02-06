import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
import { MainDashboard } from "../components/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  //   {
  //     path: "/perfil/:id",
  //     element: <UserProfile />,
  //   },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <MainDashboard />,
  },
]);
