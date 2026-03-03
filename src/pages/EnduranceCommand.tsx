import { TrendingUp, Users, AlertTriangle, DollarSign, ArrowUpRight } from "lucide-react";

const metrics = [
{
  label: "Knowledge Equity",
  value: "$2.4M",
  sub: "Estimated financial value of indexed documentation",
  icon: DollarSign,
  aura: "aura-glow-orange",
  color: "text-aura-orange",
  bgColor: "bg-aura-orange/10",
  change: "-5% this month",
  positive: true
},
{
  label: "Alignment Velocity",
  value: "48%",
  sub: " How closely team projects are currently hitting \"Personal North Stars\" ",
  icon: TrendingUp,
  aura: "aura-glow-cyan",
  color: "text-aura-cyan",
  bgColor: "bg-aura-cyan/10",
  change: "+0.4x this quarter",
  positive: true
},
{
  label: "Successor Readiness",
  value: "72%",
  sub: " How much institutional knowledge can be queried ",
  icon: AlertTriangle,
  aura: "aura-glow-magenta",
  color: "text-aura-magenta",
  bgColor: "bg-aura-magenta/10",
  change: "1 high-risk position",
  positive: false
},
{
  label: "Discovery Latency",
  value: "-22%",
  sub: "Reduction in time spent searching for source of truth",
  icon: Users,
  aura: "aura-glow-green",
  color: "text-aura-green",
  bgColor: "bg-aura-green/10",
  change: "-0.5% this month",
  positive: true
}];


const riskEmployees = [
{ name: "Jordan Mitchell", role: "Sr. Data Engineer", risk: 87, tenure: "4.2 yrs", knowledge: "Pipeline architecture, vendor relationships" },
{ name: "Priya Sharma", role: "Product Lead", risk: 72, tenure: "3.8 yrs", knowledge: "Customer segmentation models, roadmap logic" },
{ name: "Alex Thornton", role: "Staff Engineer", risk: 65, tenure: "5.1 yrs", knowledge: "Legacy system architecture, compliance framework" }];


const EnduranceCommand = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Admin Dashboard
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Manager View

          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Supercharge Metrics • Updated 2 hours ago
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m, i) =>
        <div
          key={i}
          className={`bg-card border border-border rounded-xl p-6 relative overflow-hidden transition-shadow hover:${m.aura}`}>
          
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${m.bgColor} flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <span className={`text-xs flex items-center gap-1 ${m.positive ? "text-aura-green" : "text-aura-magenta"}`}>
                  {m.positive && <ArrowUpRight className="w-3 h-3" />}
                  {m.change}
                </span>
              </div>
              <p className="font-heading text-3xl font-bold mb-1">{m.value}</p>
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </div>
          </div>
        )}
      </div>

      {/* The $1.8T Problem */}
      <div className="bg-card border border-border rounded-xl p-6 aura-gradient">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-aura-magenta animate-pulse-soft" />
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">MONTHLY SYNTHESIS: THE TEAM ERA  

          </h3>
        </div>
        <p className="text-sm leading-relaxed max-w-2xl text-secondary-foreground">This month, the shared data indicates a shift in focus toward Architectural Autonomy. While 80% of the team reports high satisfaction with technical tasks, there is a collective desire for more involvement in Strategic Roadmap decisions. Eras AI suggests a 'Discovery Workshop' to align Q2 goals with the team’s emerging leadership interests."
          <strong className="text-foreground">$1 trillion annually</strong> to voluntary turnover.
          In technical roles, replacement costs reach <strong className="text-foreground">4× salary</strong>.
          70% of organizational knowledge is tacit and unwritten — when an employee leaves,
          their <strong className="text-foreground">institutional logic</strong> leaves with them.
          Dürer.ai converts information entropy into a permanent corporate asset.
        </p>
      </div>

      {/* Attrition Risk Table */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">Attrition Risk Monitor</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_1fr] gap-4 px-6 py-3 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            <span>Employee</span>
            <span>Role</span>
            <span>Risk</span>
            <span>Tenure</span>
            <span>Critical Knowledge</span>
          </div>
          {riskEmployees.map((emp, i) =>
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_80px_80px_1fr] gap-4 px-6 py-4 border-b border-border last:border-0 items-center hover:bg-secondary/50 transition-colors">
            
              <span className="text-sm font-medium">{emp.name}</span>
              <span className="text-sm text-muted-foreground">{emp.role}</span>
              <span>
                <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                emp.risk > 80 ?
                "bg-destructive/10 text-destructive" :
                emp.risk > 70 ?
                "bg-aura-orange/10 text-aura-orange" :
                "bg-aura-cyan/10 text-aura-cyan"}`
                }>
                
                  {emp.risk}%
                </span>
              </span>
              <span className="text-sm text-muted-foreground">{emp.tenure}</span>
              <span className="text-xs text-muted-foreground">{emp.knowledge}</span>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default EnduranceCommand;