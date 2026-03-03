import { useState } from "react";
import { Lock, LockOpen, Mic, BookOpen, Users, Sparkles, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

const completedProjects = [
  {
    project: "Cloud Infrastructure Migration",
    skillGained: "Strategic Leadership",
    alignedGoal: "Cross-functional Decision Making",
    date: "Feb 2026",
  },
  {
    project: "APAC Latency Optimization",
    skillGained: "Systems Architecture",
    alignedGoal: "Technical Vision & Ownership",
    date: "Jan 2026",
  },
  {
    project: "Onboarding Flow Redesign",
    skillGained: "User Empathy & Research",
    alignedGoal: "Human-Centered Design Thinking",
    date: "Dec 2025",
  },
];

const growthNodes = [
  { title: "Adaptive Leadership in Uncertainty", progress: 72, category: "Leadership" },
  { title: "Deep Systems Thinking", progress: 45, category: "Strategy" },
  { title: "Narrative & Influence", progress: 28, category: "Communication" },
  { title: "Ethical AI Governance", progress: 10, category: "Emerging" },
];

const connections = [
  {
    name: "Anya Patel",
    role: "Design Lead",
    reason: "You both value deep-work rituals and async collaboration.",
    initials: "AP",
  },
  {
    name: "Marcus Chen",
    role: "Staff Engineer",
    reason: "Shared interest in systems thinking and mentorship.",
    initials: "MC",
  },
];

const recentInsights = [
  {
    text: "You mentioned feeling most productive in deep-work blocks between 9–11 AM.",
    date: "Today",
    indexed: false,
  },
  {
    text: "Recurring theme: you draw energy from mentoring others through ambiguity.",
    date: "Yesterday",
    indexed: true,
  },
  {
    text: "You reflected on wanting more ownership over architectural decisions.",
    date: "Mar 1",
    indexed: false,
  },
];

const LivingLedger = () => {
  const [insightPrivacy, setInsightPrivacy] = useState<Record<number, boolean>>(
    Object.fromEntries(recentInsights.map((_, i) => [i, !recentInsights[i].indexed]))
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Your Growth Ledger
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-foreground" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Welcome to your Era, <span className="italic">Alex</span>.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
          A quiet space for reflection, alignment, and intentional growth.
        </p>
      </div>

      {/* Personal Vault — Voice Reflections (PROMINENT) */}
      <section className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="aura-blob w-40 h-40 bg-aura-cyan/10 -top-10 -right-10" />
        <div className="aura-blob w-28 h-28 bg-aura-violet/8 bottom-0 left-1/4" style={{ animationDelay: "4s" }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Personal Vault
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Voice Reflections · Private by default</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity">
              <Mic className="w-3.5 h-3.5" />
              Record
            </button>
          </div>

          <div className="space-y-3">
            {recentInsights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-secondary/30 group"
              >
                <Sparkles className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed text-foreground">{insight.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{insight.date}</p>
                </div>
                <button
                  onClick={() => setInsightPrivacy(prev => ({ ...prev, [i]: !prev[i] }))}
                  className="shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors"
                  title={insightPrivacy[i] ? "Private — only you can see this" : "Indexed — visible to your organization"}
                >
                  {insightPrivacy[i] ? (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <LockOpen className="w-3.5 h-3.5 text-primary" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column: Impact & Learning */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Impact & Alignment */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Impact & Alignment
            </h2>
          </div>
          <div className="space-y-4">
            {completedProjects.map((p, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{p.project}</p>
                  <span className="text-[10px] text-muted-foreground">{p.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Skill gained: <span className="text-foreground font-medium">{p.skillGained}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  Aligned with: {p.alignedGoal}
                </p>
                {i < completedProjects.length - 1 && (
                  <div className="border-b border-border mt-4" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Learning Path */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Suggested Growth Nodes
            </h2>
          </div>
          <div className="space-y-5">
            {growthNodes.map((node, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-foreground">{node.title}</p>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {node.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={node.progress} className="h-1.5 flex-1 bg-secondary" />
                  <span className="text-[11px] text-muted-foreground w-8 text-right">{node.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Social Compass */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Social Compass
          </h2>
          <span className="text-[10px] text-muted-foreground ml-1">· Connections</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {connections.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 p-4 rounded-lg border border-border bg-secondary/20 hover:border-primary/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                {c.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.role}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed italic">
                  "{c.reason}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LivingLedger;
