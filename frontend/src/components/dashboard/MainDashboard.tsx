import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import { PanelCaregiver } from "../../views/caregiver/PanelCaregiver";
import { PanelAdmin } from "../../views/admin/PanelAdmin";
import { useUser } from "../../hooks";
import { PanelPatient } from "../../views";
import { Footer } from "../footer/Footer";


export function MainDashboard() {
  const { data:user } = useUser(); 
  const role = user?.role
  const location = useLocation();
const defaultView =
    role === "ADMIN" ? (
          <PanelAdmin />
        ) : role === "CAREGIVER" ? (
          <PanelCaregiver user={user} />
        ) : role === "PATIENT" || role === "FAMILY" ? (
          <PanelPatient />
        ) : null;

  const locationMatchesChildRoute = location.pathname !== "/dashboard";

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col w-full">
        <div className="flex-1 p-6 lg:p-10">
          <Outlet context={{ role, user }} />
          {!locationMatchesChildRoute && defaultView}
        </div>
        <Footer />
      </main>
    </div>
  );
}
