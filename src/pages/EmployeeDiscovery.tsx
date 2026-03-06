import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { employeeQuestions } from "@/data/employeeQuestions";
import { VoiceCapture } from "@/components/VoiceCapture";
import { SynthesisDisplay } from "@/components/SynthesisDisplay";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { synthesize, saveLedger } from "@/lib/api";
import type { Response as DiscoveryResponse } from "@/types/discovery";

const EMPLOYEE_COMPLETION_HEADLINE = "Your growth trajectory has been mapped.";
const EMPLOYEE_COMPLETION_SUBTEXT =
  "Ten questions. A compass for everything that comes next. This is the beginning of your era here.";
const TRANSITION_DURATION_MS = 2000;

export default function EmployeeDiscovery() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<
    "idle" | "listening" | "processing" | "displaying" | "complete"
  >("idle");
  const [responses, setResponses] = useState<DiscoveryResponse[]>([]);
  const [currentSynthesis, setCurrentSynthesis] =
    useState<DiscoveryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    transcript,
    setTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const question = employeeQuestions[currentIndex];
  const progress = ((currentIndex + 1) / employeeQuestions.length) * 100;
  const isLastQuestion = currentIndex === employeeQuestions.length - 1;

  const handleStartCapture = useCallback(() => {
    setError(null);
    setTranscript("");
    startListening();
    setState("listening");
  }, [startListening, setTranscript]);

  const handleStopCapture = useCallback(async () => {
    stopListening();
    if (!transcript.trim() || transcript.trim().length < 10) {
      setState("idle");
      return;
    }
    setState("processing");
    setError(null);
    try {
      const result = await synthesize({
        transcript: transcript.trim(),
        question: question.text,
        category: question.category,
        protocol: "employee",
        questionIndex: currentIndex,
      });
      const response: DiscoveryResponse = {
        questionId: question.id,
        question: question.text,
        category: question.category,
        transcript: transcript.trim(),
        insight: result.insight,
        pattern: result.pattern,
        timestamp: result.timestamp,
      };
      setResponses((prev) => [...prev, response]);
      setCurrentSynthesis(response);
      setState("displaying");
      setTranscript("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Synthesis failed");
      setState("idle");
    }
  }, [transcript, question, currentIndex, stopListening, setTranscript]);

  const handleContinueFromSynthesis = useCallback(() => {
    setCurrentSynthesis(null);
    if (isLastQuestion) {
      setState("complete");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setState("idle");
  }, [isLastQuestion]);

  const handleViewLivingLedger = useCallback(async () => {
    const userId =
      (window as unknown as { __erasUserId?: string }).__erasUserId ??
      "00000000-0000-0000-0000-000000000000";
    try {
      await saveLedger({
        userId,
        protocol: "employee",
        responses,
        completedAt: new Date().toISOString(),
      });
    } catch {
      // still navigate
    }
    navigate("/living-ledger");
  }, [responses, navigate]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      handleStopCapture();
    } else {
      handleStartCapture();
    }
  }, [isListening, handleStartCapture, handleStopCapture]);

  if (state === "displaying" && currentSynthesis) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="aura-blob w-72 h-72 bg-aura-cyan/20 top-1/4 left-1/4" />
        <div
          className="aura-blob w-56 h-56 bg-aura-magenta/15 bottom-1/3 right-1/4"
          style={{ animationDelay: "2s" }}
        />
        <div className="relative z-10 w-full max-w-2xl">
          <SynthesisDisplay
            insight={currentSynthesis.insight}
            pattern={currentSynthesis.pattern}
            onContinue={handleContinueFromSynthesis}
          />
        </div>
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="aura-blob w-80 h-80 bg-aura-cyan/10 -top-32 -left-32" />
        <div
          className="aura-blob w-60 h-60 bg-aura-magenta/8 bottom-20 right-10"
          style={{ animationDelay: "2s" }}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
          <h2
            className="text-2xl md:text-3xl font-heading font-bold text-center mb-4 max-w-xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {EMPLOYEE_COMPLETION_HEADLINE}
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg">
            {EMPLOYEE_COMPLETION_SUBTEXT}
          </p>
          <div className="w-full max-w-lg max-h-64 overflow-y-auto rounded-lg border border-border bg-card/50 p-4 mb-10">
            <ul className="space-y-3">
              {responses.map((r, i) => (
                <li
                  key={i}
                  className="text-sm"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {r.insight}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={handleViewLivingLedger}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            View your Living Ledger →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="aura-blob w-80 h-80 bg-aura-cyan/8 -top-32 -left-32" />
      <div
        className="aura-blob w-60 h-60 bg-aura-magenta/6 bottom-20 right-10"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="aura-blob w-48 h-48 bg-aura-violet/5 top-1/2 left-1/3"
        style={{ animationDelay: "5s" }}
      />

      <header className="relative z-10 p-8 pb-0">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-aura">era</span>
          <span className="text-muted-foreground font-light">.ai</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
          Employee Discovery
        </p>
      </header>

      <div className="relative z-10 px-8 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Question {currentIndex + 1} of {employeeQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-0.5 opacity-40" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 py-12">
        <div className="max-w-2xl w-full text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-aura-cyan font-medium mb-6">
            {question.category}
          </p>
          <h3
            className="text-xl md:text-2xl italic leading-relaxed mb-16 text-foreground/90 max-w-xl mx-auto"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            &quot;{question.text}&quot;
          </h3>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          <VoiceCapture
            isListening={isListening}
            isSupported={isSupported}
            onToggle={toggleListening}
          />
        </div>
      </div>

      <div className="relative z-10 px-8 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              currentIndex > 0 && setCurrentIndex((i) => i - 1)
            }
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={() =>
              !isLastQuestion && setCurrentIndex((i) => i + 1)
            }
            className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Skip <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
