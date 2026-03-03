import { Outlet } from "react-router-dom";
import SideNavLink from "./SideNavLink";
import { BarChart3, Brain, MessageSquare, Shield, Settings } from "lucide-react";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="font-heading text-xl font-bold tracking-tight">
            <span className="text-gradient-aura">era</span>
            <span className="text-muted-foreground font-light">.ai</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
            Living Ledger
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <SideNavLink to="/" icon={BarChart3} label="Living Ledger" />
          <SideNavLink to="/discovery" icon={Brain} label="Discovery Interview" />
          <SideNavLink to="/knowledge" icon={MessageSquare} label="Knowledge Clone" />
          <SideNavLink to="/command" icon={Shield} label="Endurance Command" />
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border">
          <SideNavLink to="/settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>);

};

export default AppLayout;