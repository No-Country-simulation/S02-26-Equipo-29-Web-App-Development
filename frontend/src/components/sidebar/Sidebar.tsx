import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UserIcon,
  UserCogIcon,
  UserPlusIcon,
  TrendingUpIcon,
  LogOutIcon,
  type LucideIcon,
  CalendarIcon,
} from "lucide-react";
import { DashboardLink } from "../UI/DashboardLink";
import { useUser } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

const navLinks: Record<
  "ADMIN" | "CAREGIVER" | "FAMILY" | "PATIENT",
  { title: string; href: string; icon: LucideIcon }[]
> = {
  ADMIN: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Cuidados", href: "/appointments", icon: CalendarIcon },
    { title: "Registro", href: "/registration", icon: UserPlusIcon },
    { title: "Pacientes", href: "/patients", icon: UserIcon },
    { title: "Cuidadores", href: "/caregivers", icon: UserCogIcon },
    { title: "Métricas", href: "/metrics", icon: TrendingUpIcon },
    { title: "Administradores", href: "/admins", icon: UserPlusIcon },
  ],
  CAREGIVER: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Agenda", href: "/agenda", icon: CalendarIcon },
    { title: "Mi Información", href: "/caregiver_info", icon: UserPlusIcon },
  ],
  FAMILY: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Agenda", href: "/agenda", icon: CalendarIcon },
    { title: "Registro", href: "/registration", icon: UserPlusIcon },
    { title: "Pacientes", href: "/patients", icon: UserIcon },
    { title: "Cuidadores", href: "/caregivers", icon: UserCogIcon },
    { title: "Métricas", href: "/metrics", icon: TrendingUpIcon },
  ],
  PATIENT: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Agenda", href: "/patient/schedule", icon: CalendarIcon },
    { title: "Mi Información", href: "/patient_info", icon: UserPlusIcon },
  ],
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <aside className="sticky top-0 h-screen flex flex-col bg-white shadow-lg w-18 md:w-55 z-50">
      {/* Header */}
      <div className="p-4 md:p-5 flex-shrink-0">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo.png"
            alt="Logo Cuidapp"
            className="min-w-16 min-h-16 w-16 h-16 md:w-24 md:h-24"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="hidden md:block text-3xl font-bold text-primary">
            CUIDAPP
          </h1>
          <p className="hidden md:block text-xs text-gray-500">
            Cuida a quienes amas
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        <ul className="flex flex-col gap-2 px-2 mt-10 md:mt-5 pb-10">
          {navLinks[(user?.role as keyof typeof navLinks) || "PATIENT"].map(
            (link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.title}>
                  <DashboardLink link={link} isActive={isActive} />
                </li>
              );
            },
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100 flex-shrink-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => {
            localStorage.removeItem("userToken");
            queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 cursor-pointer
                     text-danger hover:bg-danger hover:text-white transition-colors"
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          <span className="hidden md:inline whitespace-nowrap">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
