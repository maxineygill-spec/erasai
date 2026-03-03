import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SideNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  compact?: boolean;
}

const SideNavLink = ({ to, icon: Icon, label, compact }: SideNavLinkProps) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )
    }
  >
    <Icon className="w-4 h-4 shrink-0" />
    {!compact && <span>{label}</span>}
  </RouterNavLink>
);

export default SideNavLink;
