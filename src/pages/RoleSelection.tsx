import { useNavigate } from "react-router-dom";
import { Compass, Sprout } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Aura blobs */}
      <div className="aura-blob w-96 h-96 bg-aura-cyan/20 -top-20 -left-20" />
      <div className="aura-blob w-80 h-80 bg-aura-magenta/20 -bottom-20 -right-20" style={{ animationDelay: "3s" }} />

      {/* Header */}
      <header className="relative z-10 p-8">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-aura">era</span>
          <span className="text-muted-foreground font-light">.ai</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
          LIVING COMPASS
        </p>
      </header>

      {/* Cards */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Founder Card */}
          <button
            onClick={() => navigate("/founder")}
            className="group bg-card border border-border rounded-xl p-10 text-left relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-aura-cyan/30"
          >
            <div className="aura-blob w-40 h-40 bg-aura-cyan/15 -top-10 -right-10 group-hover:opacity-100 opacity-60 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-aura-cyan/10 flex items-center justify-center">
                <Compass className="w-7 h-7 text-aura-cyan" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight mb-3">
                  I'm a Founder
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Capture your vision, define what great looks like, and build the knowledge architecture your team will grow into.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium transition-colors group-hover:bg-primary/90">
                Begin Founder Interview
              </div>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={() => navigate("/employee")}
            className="group bg-card border border-border rounded-xl p-10 text-left relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-aura-magenta/30"
          >
            <div className="aura-blob w-40 h-40 bg-aura-magenta/15 -top-10 -right-10 group-hover:opacity-100 opacity-60 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-aura-magenta/10 flex items-center justify-center">
                <Sprout className="w-7 h-7 text-aura-magenta" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight mb-3">
                  I'm joining a team
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Map where you are, where you want to go, and receive a personalized learning path built around your growth.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg text-sm font-medium transition-colors group-hover:bg-accent/90">
                Begin My Discovery
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
