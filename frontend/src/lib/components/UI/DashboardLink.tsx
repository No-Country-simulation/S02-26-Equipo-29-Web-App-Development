import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface DashboardLinkProps {
  link: {
    title: string;
    href: string;
    icon: LucideIcon;
  };
  isActive: boolean;
}

export function DashboardLink({ link, isActive }: DashboardLinkProps) {
  return (
    <Link
      to={link.href}
      className={`
                    flex items-center gap-3 rounded-xl w-fit md:w-full px-3  py-2 
                    transition-colors
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-primary/10"
                    }
                  `}
    >
      <link.icon className="h-5 w-5 shrink-0" />

      <span className="hidden md:inline whitespace-nowrap">{link.title}</span>
    </Link>
  );
}
