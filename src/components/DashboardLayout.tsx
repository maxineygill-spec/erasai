import { Outlet } from "react-router-dom";
import SideNavLink from "./SideNavLink";
import { BarChart3, Brain, MessageSquare, Shield, Settings, Users, BookOpen, Mic } from "lucide-react";

interface DashboardLayoutProps {
  role: "founder" | "employee";
}

const founderNav = [
  { to: "/founder/dashboard", icon: BarChart3, label: "Growth Journey" },
  { to: "/founder/knowledge", icon: Brain, label: "Knowledge Architecture" },
  { to: "/founder/team", icon: Users, label: "Team Overview" },
  { to: "/founder/settings", icon: Settings, label: "Settings" },
];

const employeeNav = [
  { to: "/employee/ledger", icon: BarChart3, label: "My Era" },
  { to: "/employee/learning", icon: BookOpen, label: "Learning Path" },
  { to: "/employee/vault", icon: Mic, label: "Voice Vault" },
  { to: "/employee/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const nav = role === "founder" ? founderNav : employeeNav;
  const settingsItem = nav.find((n) => n.label === "Settings");
  const mainNav = nav.filter((n) => n.label !== "Settings");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="font-heading text-xl font-bold tracking-tight">
            <span className="text-gradient-aura">era</span>
            <span className="text-muted-foreground font-light">.ai</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
            LIVING COMPASS
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {mainNav.map((item) => (
            <SideNavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {settingsItem && (
          <div className="p-4 border-t border-border">
            <SideNavLink to={settingsItem.to} icon={settingsItem.icon} label={settingsItem.label} />
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
