import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface SynthesisDisplayProps {
  insight: string;
  pattern: string;
  onContinue: () => void;
}

export function SynthesisDisplay({
  insight,
  pattern,
  onContinue,
}: SynthesisDisplayProps) {
  const { speak, cancel } = useSpeechSynthesis();
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    speak(insight);
    return () => cancel();
  }, [insight, speak, cancel]);

  useEffect(() => {
    const t = setTimeout(() => setShowContinue(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative rounded-xl border border-border bg-card/95 backdrop-blur p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Lock className="w-3.5 h-3.5" />
        <span>Captured</span>
      </div>

      <p
        className="text-xl md:text-2xl leading-snug text-foreground mb-6 pr-20"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {insight}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed font-body">
        {pattern}
      </p>

      {showContinue && (
        <div className="mt-8 flex justify-center animate-in fade-in duration-300">
          <Button onClick={onContinue} variant="default" size="lg">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
