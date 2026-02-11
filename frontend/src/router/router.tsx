import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
import { MainDashboard } from "../components/dashboard/Dashboard";
import {
  Appointments,
  Caregivers,
  PanelAdmin,
  Patients,
  Registration,
} from "../views";
import { ProtectedRoute } from "../components/ProtectedRoute";

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
    element: (
      <>
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        path: "/dashboard",
        element: <PanelAdmin />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/caregivers",
        element: <Caregivers />,
      },
    ],
  },
]);
