import { useState } from "react";
import { Brain, Mic, ArrowRight } from "lucide-react";

const questions = [
  {
    q: "What is the single most important skill you want to develop in the next 12 months?",
    category: "Growth Vector",
  },
  {
    q: "Describe a moment in your career when you felt the deepest sense of purpose.",
    category: "Purpose Alignment",
  },
  {
    q: "If you could solve one problem for this organization, what would it be?",
    category: "Strategic Impact",
  },
  {
    q: "What knowledge do you carry that isn't documented anywhere?",
    category: "Tacit Knowledge",
  },
  {
    q: "How do you prefer to learn — through doing, observing, or reflecting?",
    category: "Learning Style",
  },
];

const DiscoveryInterview = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);

  const syncScore = Math.min(100, Math.round((answers.length / questions.length) * 100));
  const question = questions[currentQ];

  const handleSubmit = () => {
    if (!currentAnswer.trim()) return;
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const isComplete = answers.length >= questions.length;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
          Onboarding Simulation
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Discovery Interview
        </h2>
      </div>

      {/* Sync Score */}
      <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
        <div className="aura-blob w-40 h-40 bg-aura-green/20 -top-10 -right-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Growth Sync Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-5xl font-bold text-gradient-aura">
                {syncScore}
              </span>
              <span className="text-muted-foreground text-sm">/ 100</span>
            </div>
          </div>
          <div className="w-32 h-32 rounded-full border-4 border-border flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="hsl(174, 80%, 50%)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${syncScore * 2.89} 289`}
                className="transition-all duration-700"
              />
            </svg>
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Question Card */}
      {!isComplete ? (
        <div className="bg-card border border-border rounded-xl p-8 relative overflow-hidden">
          <div className="aura-blob w-36 h-36 bg-aura-magenta/10 bottom-0 right-0" style={{ animationDelay: "2s" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-aura-cyan font-medium">
                {question.category}
              </span>
              <span className="text-muted-foreground text-xs">
                — Question {currentQ + 1} of {questions.length}
              </span>
            </div>

            <h3 className="font-heading text-xl font-semibold mb-8 leading-relaxed">
              {question.q}
            </h3>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Speak or type your response..."
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-aura-magenta text-accent-foreground aura-glow-magenta"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!currentAnswer.trim()}
                  className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-30"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center aura-glow-green">
          <h3 className="font-heading text-xl font-semibold mb-2">
            Growth Sync Complete
          </h3>
          <p className="text-sm text-muted-foreground">
            Your purpose alignment has been mapped. The Living Ledger is now calibrated.
          </p>
        </div>
      )}

      {/* Previous answers */}
      {answers.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Captured Responses
          </p>
          {answers.map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-wider text-primary mb-1">
                {questions[i].category}
              </p>
              <p className="text-sm">{a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoveryInterview;
