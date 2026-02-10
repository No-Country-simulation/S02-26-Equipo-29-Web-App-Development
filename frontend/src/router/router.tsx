import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
// import { CaregiverDashboard } from "../components/dashboard/CaregiverDashboard";
import {
  Appointments,
  Caregivers,
  PanelAdmin,
  Patients,
  Registration,
} from "../views";
import { Agenda } from "../views/caregiver/Agenda";
// import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { MainDashboard } from "../components/dashboard/MainDashboard";

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
        element: null,
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
      {
        path: "/agenda",
        element: <Agenda />,
      },
    ],
  },
]);
