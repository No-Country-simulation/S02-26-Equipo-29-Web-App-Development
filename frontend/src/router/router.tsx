import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
import { Appointments,  Patients, Registration } from "../views";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Agenda } from "../views/caregiver/Agenda";
import { CaregiverInfo } from "../views/caregiver/CaregiverInfo";
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
      // {
      //   path: "/caregivers",
      //   element: <Caregivers />,
      // },
      {
        path: "/agenda",
        element: <Agenda />,
      },
      {
        path: "/myinfo",
        element: <CaregiverInfo />,
      },
    ],
  },
]);
