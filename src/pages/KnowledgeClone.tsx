import { useState } from "react";
import { Search, Bot, User, ExternalLink } from "lucide-react";

const sampleConversations = [
  {
    query: "Why did we choose AWS over GCP for the APAC deployment?",
    response:
      "Based on institutional logic captured from Sarah Chen (VP Engineering, departed March 2025) and deployment records from Q3 2024:\n\nThe decision was driven by three factors:\n1. **Latency requirements** — AWS's Singapore region provided 23ms lower P99 latency for our real-time pipeline compared to GCP's closest region.\n2. **Existing enterprise agreement** — Our 2023 ELA with AWS included reserved capacity at 40% below on-demand pricing.\n3. **Team expertise** — At the time of decision, 78% of the infrastructure team had AWS certifications vs. 12% for GCP.\n\nThis was explicitly *not* a cost-only decision. Sarah noted: \"We'd pay more for GCP even with credits because retraining the team would cost us two quarters of velocity.\"",
    sources: [
      "Sarah Chen — Voice Entry, Oct 14 2024",
      "Infrastructure Decision Log #847",
      "Q3 2024 Architecture Review Minutes",
    ],
  },
  {
    query: "What is the onboarding process for the data engineering team?",
    response:
      "Synthesized from 14 knowledge entries across 3 departed team leads:\n\nThe data engineering onboarding follows a **4-phase model** (not documented in the wiki):\n\n**Phase 1 (Week 1-2): Shadow & Observe**\nNew hires pair with a senior engineer on live pipeline monitoring. Key insight from Marcus Webb: \"Don't let them touch Airflow until they've seen it fail.\"\n\n**Phase 2 (Week 3-4): Controlled Contribution**\nAssign a non-critical DAG modification. The team uses this to assess debugging intuition.\n\n**Phase 3 (Month 2): Ownership Transfer**\nGradual handoff of one pipeline domain. Mentors reduce check-ins from daily to weekly.\n\n**Phase 4 (Month 3): Independent Operation**\nThe new hire presents their domain's architecture to the team — this is the unofficial \"graduation.\"",
    sources: [
      "Marcus Webb — Growth Diary, Multiple Entries",
      "Data Eng Team Retro Notes 2024",
      "Onboarding Feedback Survey Aggregation",
    ],
  },
];

const KnowledgeClone = () => {
  const [query, setQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<number | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setActiveConversation(0);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
          Institutional Memory
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Knowledge Clone
        </h2>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="bg-card border border-border rounded-xl p-1 relative overflow-hidden aura-glow-cyan">
          <div className="aura-blob w-64 h-16 bg-aura-cyan/10 -top-4 left-1/4" />
          <div className="relative z-10 flex items-center">
            <Search className="w-4 h-4 text-muted-foreground ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Query Institutional Memory..."
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mr-1"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="space-y-6">
        {sampleConversations.map((conv, i) => (
          <div key={i} className="space-y-3">
            {/* User query */}
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-3 text-sm max-w-lg">
                {conv.query}
              </div>
            </div>

            {/* Clone response */}
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="bg-card border border-border rounded-xl rounded-tl-sm px-5 py-4 relative overflow-hidden">
                  <div className="aura-blob w-24 h-24 bg-aura-violet/10 -bottom-6 -right-6" style={{ animationDelay: `${i * 2}s` }} />
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse-soft" />
                      Legacy Clone — Institutional Logic
                    </p>
                    <div
                      className="text-sm leading-relaxed space-y-2 prose-sm"
                      dangerouslySetInnerHTML={{
                        __html: conv.response
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                </div>

                {/* Sources */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {conv.sources.map((s, j) => (
                    <span
                      key={j}
                      className="text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeClone;
