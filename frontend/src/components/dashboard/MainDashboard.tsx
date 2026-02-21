import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import { PanelCaregiver } from "../../views/caregiver/PanelCaregiver";
import { PanelAdmin } from "../../views/admin/PanelAdmin";
import { useUser } from "../../hooks";
import { PanelPatient } from "../../views";


export function MainDashboard() {
  const { data:user } = useUser(); // "ADMIN", "CAREGIVER", etc.
  const role = user?.role
  const location = useLocation();

  const defaultView =
    // role === "ADMIN" ? (
    //   <PanelAdmin />
    // ) : user ? (
    //   <PanelCaregiver user={user} />
    // ) : null;
    role === "ADMIN" ? (
          <PanelAdmin />
        ) : role === "CAREGIVER" ? (
          <PanelCaregiver user={user} />
        ) : role === "PATIENT" || role === "FAMILY" ? (
          <PanelPatient />
        ) : null;

  const locationMatchesChildRoute = location.pathname !== "/dashboard";

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet context={{ role, user }} /> {/* rutas hijas */}
        {!locationMatchesChildRoute && defaultView}
      </main>
    </div>
  );
}
