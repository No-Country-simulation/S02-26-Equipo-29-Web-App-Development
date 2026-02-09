import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
import { MainDashboard } from "../components/dashboard/Dashboard";
import { PanelAdmin, Registration } from "../views";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/patient/:id",
  //   element: <Patient />,
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <MainDashboard />,
    children: [
      {
        path: "/dashboard",
        element: <PanelAdmin />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
    ],
  },
]);
