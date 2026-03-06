import { Mic, MicOff } from "lucide-react";
import { WaveformVisualizer } from "./WaveformVisualizer";
interface VoiceCaptureProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  transcript?: string;
  idleLabel?: string;
  listeningLabel?: string;
}

export function VoiceCapture({
  isListening,
  isSupported,
  onToggle,
  transcript,
  idleLabel = "Tap to speak. Silence ends the capture.",
  listeningLabel = "Listening…",
}: VoiceCaptureProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <button
        type="button"
        onClick={onToggle}
        disabled={!isSupported}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
          isListening
            ? "bg-aura-magenta text-accent-foreground aura-glow-magenta scale-110"
            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 mic-breathe"
        }`}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-aura-magenta/40 animate-ping" />
            <span className="absolute -inset-3 rounded-full border border-aura-magenta/20 mic-pulse-ring" />
          </>
        )}
        {isListening ? (
          <MicOff className="w-6 h-6 relative z-10" />
        ) : (
          <Mic className="w-6 h-6 relative z-10" />
        )}
      </button>

      <WaveformVisualizer isActive={isListening} />

      {!isListening && (
        <p className="text-xs text-muted-foreground/60">{idleLabel}</p>
      )}
      {isListening && (
        <p className="text-xs text-aura-magenta/80 animate-pulse">
          {listeningLabel}
        </p>
      )}
      {!isSupported && (
        <p className="text-xs text-amber-600 dark:text-amber-400 max-w-xs text-center">
          For the best experience, open Eras in Chrome.
        </p>
      )}
    </div>
  );
}
