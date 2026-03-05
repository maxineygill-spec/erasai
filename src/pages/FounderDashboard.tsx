import { Lock, Eye, Link2 } from "lucide-react";

const metrics = [
  { label: "Vision Clarity Score", value: "94", unit: "/100", color: "aura-cyan" },
  { label: "Knowledge Modules Generated", value: "6", unit: "", color: "aura-green" },
  { label: "Onboarding Pathways Ready", value: "1", unit: "", color: "aura-orange" },
  { label: "Estimated Time-to-Competency", value: "18", unit: " days", color: "aura-magenta" },
];

const modules = [
  { title: "Product Vision & North Star", detail: "5 concepts · Voice-sourced" },
  { title: "Technical Stack Orientation", detail: "8 concepts · Architecture-grounded" },
  { title: "Culture & Behavioral Standards", detail: "4 concepts · Founder-verified" },
];

const FounderDashboard = () => (
  <div className="p-8 max-w-5xl mx-auto space-y-10">
    {/* Header */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
        Founder View
      </p>
      <h2 className="font-heading text-3xl font-bold tracking-tight">
        Your Knowledge Architecture
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Built from your voice. Ready for your first hire.
      </p>
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
          <div className={`aura-blob w-32 h-32 bg-${m.color}/15 -top-8 -right-8`} />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              {m.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-gradient-aura">{m.value}</span>
              <span className="text-sm text-muted-foreground">{m.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Generated Modules */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
        Generated Learning Architecture
      </p>
      <div className="space-y-3">
        {modules.map((mod) => (
          <div key={mod.title} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <h4 className="font-heading text-sm font-semibold">{mod.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{mod.detail}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="bg-card border border-border rounded-xl p-8 text-center aura-gradient relative overflow-hidden">
      <div className="aura-blob w-48 h-48 bg-aura-cyan/10 -bottom-10 left-1/4" />
      <div className="relative z-10">
        <h3 className="font-heading text-lg font-semibold mb-2">
          Ready to invite your first hire?
        </h3>
        <button className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center">
          <Link2 className="w-4 h-4" /> Generate Employee Invite Link
        </button>
      </div>
    </div>
  </div>
);

export default FounderDashboard;
