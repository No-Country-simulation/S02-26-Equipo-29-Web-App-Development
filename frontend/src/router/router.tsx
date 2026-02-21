import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Login } from "../components/login/LogIn";
import {
  Appointments,
  Caregivers,
  PatientInfo,
  Patients,
  PatientSchedule,
  Registration,
} from "../views";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Agenda } from "../views/caregiver/Agenda";
import { CaregiverInfo } from "../views/caregiver/CaregiverInfo";
import { MainDashboard } from "../components/dashboard/MainDashboard";
import { QueryClientProvider } from "../providers/QueryClientProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
  {
    element: (
      <QueryClientProvider>
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      </QueryClientProvider>
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
      {
        path: "/caregivers",
        element: <Caregivers />,
      },
      {
        path: "/agenda",
        element: <Agenda />,
      },
      {
        path: "/caregiver_info",
        element: <CaregiverInfo />,
      },
      {
        path: "/patient",
        element: <PatientInfo />,
      },
      {
        path: "/patient_info",
        element: <PatientInfo />,
      },
      {
        path: "/patient/schedule",
        element: <PatientSchedule />,
      },
    ],
  },
]);
