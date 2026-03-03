import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const eltvData = [
  { month: "M0", value: -40, label: "Hiring Cost" },
  { month: "M1", value: -25, label: "Onboarding" },
  { month: "M2", value: -10, label: "Ramp-Up" },
  { month: "M3", value: 5, label: "Breakeven" },
  { month: "M4", value: 20, label: "Contributing" },
  { month: "M5", value: 35, label: "Accelerating" },
  { month: "M6", value: 50, label: "Performing" },
  { month: "M8", value: 68, label: "High Output" },
  { month: "M10", value: 80, label: "Expert" },
  { month: "M12", value: 88, label: "Mentor" },
  { month: "M14", value: 92, label: "Max Potential" },
  { month: "M16", value: 90, label: "Plateau" },
];

const growthDiary = [
  {
    time: "Today, 9:14 AM",
    type: "voice",
    content: "Realized our vendor selection for cloud infra was driven by latency requirements in APAC — not cost. This context is missing from the wiki.",
    tag: "Tacit Knowledge",
  },
  {
    time: "Yesterday, 3:42 PM",
    type: "voice",
    content: "Completed cross-functional sprint with Design. Key insight: our onboarding flow reduces churn by 18% when personalized in first 48h.",
    tag: "Kinetic Knowledge",
  },
  {
    time: "Mar 1, 11:20 AM",
    type: "reflection",
    content: "Q1 goal alignment — shifted focus from feature velocity to retention metrics. Personal purpose sync: building tools that respect human growth curves.",
    tag: "Purpose Alignment",
  },
  {
    time: "Feb 27, 2:05 PM",
    type: "voice",
    content: "Mentored two new engineers on our deployment pipeline. Documented the 'why' behind our blue-green strategy.",
    tag: "Knowledge Transfer",
  },
];

const LivingLedger = () => {
  const gradientId = useMemo(() => "eltvGradient", []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Employee Dashboard
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Living Ledger
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current ELTV</p>
          <p className="font-heading text-2xl font-bold text-gradient-aura">
            $142,800
          </p>
        </div>
      </div>

      {/* ELTV Curve */}
      <div className="bg-card rounded-xl border border-border p-6 relative overflow-hidden">
        {/* Aura blob */}
        <div className="aura-blob w-48 h-48 bg-aura-cyan/20 top-0 right-0" />
        <div className="aura-blob w-32 h-32 bg-aura-magenta/15 bottom-0 left-1/3" style={{ animationDelay: "3s" }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                ELTV Curve — Employee Lifetime Value
              </h3>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aura-cyan" />
                Contribution
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aura-magenta" />
                Breakeven
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eltvData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(174, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="hsl(330, 85%, 60%)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(174, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 92%)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }}
                axisLine={{ stroke: "hsl(220, 14%, 92%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 14%, 92%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine y={0} stroke="hsl(330, 85%, 60%)" strokeDasharray="4 4" strokeOpacity={0.5} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(174, 80%, 50%)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex justify-between mt-4 text-xs text-muted-foreground px-2">
            <span>← Negative Contribution (Onboarding)</span>
            <span>Maximum Potential →</span>
          </div>
        </div>
      </div>

      {/* Growth Diary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">Growth Diary</h3>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aura-magenta animate-pulse-soft" />
            Voice Entry
          </button>
        </div>

        <div className="space-y-3">
          {growthDiary.map((entry, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/20 transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-0 aura-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full">
                    {entry.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{entry.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivingLedger;
