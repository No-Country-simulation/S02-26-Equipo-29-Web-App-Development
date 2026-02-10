import { useLocation } from "react-router-dom";
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
import { useRole } from "../../context/RoleContext";

const navLinks: Record<
  "ADMIN" | "CAREGIVER" | "PATIENT",
  { title: string; href: string; icon: LucideIcon }[]
> = {
  ADMIN: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Agenda", href: "/agenda", icon: CalendarIcon },
    { title: "Registro", href: "/registration", icon: UserPlusIcon },
    { title: "Pacientes", href: "/patients", icon: UserIcon },
    { title: "Cuidadores", href: "/caregivers", icon: UserCogIcon },
    { title: "Métricas", href: "/metrics", icon: TrendingUpIcon },
    { title: "Administradores", href: "/admins", icon: UserPlusIcon },
  ],
  CAREGIVER: [
    { title: "ONLY CAREGIVER", href: "", icon: LayoutDashboardIcon },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Agenda", href: "/agenda", icon: CalendarIcon },
    { title: "Registro", href: "/registration", icon: UserPlusIcon },
    { title: "Pacientes", href: "/patients", icon: UserIcon },
    { title: "Cuidadores", href: "/caregivers", icon: UserCogIcon },
    { title: "Métricas", href: "/metrics", icon: TrendingUpIcon },
  ],
  PATIENT: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Registro", href: "/registration", icon: UserPlusIcon },
    { title: "Pacientes", href: "/patients", icon: UserIcon },
    { title: "Cuidadores", href: "/caregivers", icon: UserCogIcon },
    { title: "Métricas", href: "/metrics", icon: TrendingUpIcon },
  ],
};

export function Sidebar() {
  const { pathname } = useLocation();
  const role = useRole();

  return (
    <aside className="sticky top-0 min-h-screen bg-white shadow-lg w-18 md:w-55 transition-all duration-300">
      {/* Header */}
      <div className="p-4 md:p-5">
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
      <nav>
        <ul className="flex flex-col gap-2 px-2 mt-10 md:mt-5 ">
          {navLinks[role].map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.title}>
                <DashboardLink link={link} isActive={isActive} />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-2 right-2 md:left-4 md:right-4 ">
        <button
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
