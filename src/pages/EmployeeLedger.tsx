import { Mic, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const learningModules = [
  { title: "Product Vision & North Star", time: "~2 hours" },
  { title: "Technical Stack Orientation", time: "~2 hours" },
  { title: "Culture & Behavioral Standards", time: "~2 hours" },
];

const EmployeeLedger = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-10">
    {/* Header */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
        Your Growth Journey
      </p>
      <h2 className="text-3xl font-bold tracking-tight italic" style={{ fontFamily: "'Playfair Display', serif" }}>
        Welcome to your Era.
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        A quiet space for reflection, alignment, and intentional growth.
      </p>
    </div>

    {/* Learning Path */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
        Personalized Onboarding Path
      </p>
      <div className="space-y-3">
        {learningModules.map((mod) => (
          <div key={mod.title} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-heading text-sm font-semibold">{mod.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{mod.time}</p>
              </div>
              <button className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Begin
              </button>
            </div>
            <Progress value={0} className="h-1" />
          </div>
        ))}
      </div>
    </div>

    {/* Growth Sync Score */}
    <div className="bg-card border border-border rounded-xl p-8 relative overflow-hidden">
      <div className="aura-blob w-40 h-40 bg-aura-green/15 -top-10 -right-10" />
      <div className="relative z-10 flex items-center gap-8">
        <div className="w-28 h-28 rounded-full border-4 border-border flex items-center justify-center relative shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="hsl(174, 80%, 50%)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="0 289"
              className="transition-all duration-700"
            />
          </svg>
          <Brain className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Growth Sync Score
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-heading text-4xl font-bold text-gradient-aura">0</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete your first reflection to begin building your Era.
          </p>
        </div>
      </div>
    </div>

    {/* Voice Reflections Vault */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
        Personal Vault
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Private by default. Your thoughts, indexed over time.
      </p>
      <div className="bg-card border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
        <button className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 hover:bg-secondary/80 transition-colors group">
          <Mic className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <p className="font-heading text-sm font-semibold mb-1">Record your first reflection</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          What did you learn today that isn't written down anywhere?
        </p>
      </div>
    </div>
  </div>
);

export default EmployeeLedger;
