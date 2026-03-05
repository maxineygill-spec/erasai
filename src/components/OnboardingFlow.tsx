import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Step {
  category: string;
  question: string;
}

interface OnboardingFlowProps {
  steps: Step[];
  synthesisMessage: string;
  redirectTo: string;
}

const OnboardingFlow = ({ steps, synthesisMessage, redirectTo }: OnboardingFlowProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleContinue = () => {
    if (!currentAnswer.trim()) return;
    const updated = [...answers];
    updated[currentStep] = currentAnswer;
    setAnswers(updated);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer(answers[currentStep + 1] || "");
    } else {
      setIsSynthesizing(true);
      setTimeout(() => navigate(redirectTo), 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const updated = [...answers];
      updated[currentStep] = currentAnswer;
      setAnswers(updated);
      setCurrentStep(currentStep - 1);
      setCurrentAnswer(answers[currentStep - 1] || "");
    }
  };

  if (isSynthesizing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="aura-blob w-64 h-64 bg-aura-cyan/20 top-1/4 left-1/4" />
        <div className="aura-blob w-48 h-48 bg-aura-magenta/15 bottom-1/3 right-1/4" style={{ animationDelay: "2s" }} />
        <div className="aura-blob w-56 h-56 bg-aura-green/10 top-1/2 right-1/3" style={{ animationDelay: "4s" }} />
        <div className="relative z-10 text-center max-w-lg px-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center animate-pulse-soft">
            <div className="w-8 h-8 rounded-full bg-primary/30" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-4">Synthesis in Progress</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{synthesisMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="aura-blob w-60 h-60 bg-aura-cyan/10 -top-20 -left-20" />

      {/* Header */}
      <header className="relative z-10 p-8 pb-0">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-aura">era</span>
          <span className="text-muted-foreground font-light">.ai</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
          LIVING COMPASS
        </p>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-8 pt-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 py-12">
        <div className="max-w-3xl w-full">
          <div className="bg-card border border-border rounded-xl p-10 relative overflow-hidden">
            <div className="aura-blob w-36 h-36 bg-aura-magenta/10 bottom-0 right-0" style={{ animationDelay: "2s" }} />
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-aura-cyan font-medium mb-6">
                {step.category}
              </p>
              <h3 className="font-serif text-xl md:text-2xl italic leading-relaxed mb-10 text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {step.question}
              </h3>

              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Speak or type your response..."
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleContinue();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 self-start ${
                    isListening
                      ? "bg-aura-magenta text-accent-foreground aura-glow-magenta"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!currentAnswer.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30"
                >
                  {currentStep === steps.length - 1 ? "Complete" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
