import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

const questions = [
  {
    category: "Origin",
    question:
      "Forget your product for a moment. Describe the world your company exists to create — what's different about how people work, grow, and leave something behind?",
  },
  {
    category: "Founding Moment",
    question:
      "Before this company had a name — maybe before it had a co-founder — you saw this problem so clearly it felt personal. What's that story?",
  },
  {
    category: "Contrarian Thesis",
    question:
      "What do you believe about your market that most people in it still think is wrong?",
  },
  {
    category: "Cultural Truth",
    question:
      "What's the one thing a new hire needs to understand in their first 30 days that isn't written down anywhere — the thing that separates the people who thrive here from the ones who struggle?",
  },
  {
    category: "Graveyard Decisions",
    question:
      "Tell me about a decision you made that didn't survive — one that taught you something nobody else on your team knows yet.",
  },
];

const DiscoveryInterview = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [isListening, setIsListening] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(32).fill(0));

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef("");

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current?.state !== "closed") audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    setWaveformData(new Array(32).fill(0));
  }, []);

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const sampled = Array.from({ length: 32 }, (_, i) => {
      const idx = Math.floor((i / 32) * data.length);
      return data[idx] / 255;
    });
    setWaveformData(sampled);
    animFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, 2000);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    cleanupAudio();
    setIsListening(false);

    // Save transcript
    if (transcriptRef.current.trim()) {
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentQ] = transcriptRef.current.trim();
        return updated;
      });
      // Auto-advance after brief pause
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ((prev) => prev + 1);
          transcriptRef.current = "";
        } else {
          setIsSynthesizing(true);
          setTimeout(() => navigate("/founder/dashboard"), 3000);
        }
      }, 800);
    }
  }, [currentQ, cleanupAudio, navigate]);

  const startListening = useCallback(async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition. Please use Chrome.");
      return;
    }

    transcriptRef.current = "";

    // Set up audio visualization
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();
    } catch {
      // Continue without visualization
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript;
      }
      transcriptRef.current = full;
      resetSilenceTimer();
    };

    recognition.onerror = () => {
      stopListening();
    };

    recognition.onend = () => {
      // If still supposed to be listening, it ended unexpectedly
      setIsListening(false);
      cleanupAudio();
    };

    recognition.start();
    setIsListening(true);
    resetSilenceTimer();
  }, [drawWaveform, resetSilenceTimer, stopListening, cleanupAudio]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      transcriptRef.current = "";
    }
  };

  const handleSkip = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      transcriptRef.current = "";
    } else {
      setIsSynthesizing(true);
      setTimeout(() => navigate("/founder/dashboard"), 3000);
    }
  };

  if (isSynthesizing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="aura-blob w-72 h-72 bg-aura-cyan/20 top-1/4 left-1/4" />
        <div className="aura-blob w-56 h-56 bg-aura-magenta/15 bottom-1/3 right-1/4" style={{ animationDelay: "2s" }} />
        <div className="aura-blob w-64 h-64 bg-aura-green/10 top-1/2 right-1/3" style={{ animationDelay: "4s" }} />
        <div className="relative z-10 text-center max-w-lg px-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-8 flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 rounded-full bg-primary/30" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-4 tracking-tight">
            Synthesis in Progress
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            We're translating your voice into a living knowledge architecture.
            This becomes the foundation every new hire learns from.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="aura-blob w-80 h-80 bg-aura-cyan/8 -top-32 -left-32" />
      <div className="aura-blob w-60 h-60 bg-aura-magenta/6 bottom-20 right-10" style={{ animationDelay: "3s" }} />
      <div className="aura-blob w-48 h-48 bg-aura-violet/5 top-1/2 left-1/3" style={{ animationDelay: "5s" }} />

      {/* Header */}
      <header className="relative z-10 p-8 pb-0">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-aura">era</span>
          <span className="text-muted-foreground font-light">.ai</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
          Discovery Protocol
        </p>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-8 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Question {currentQ + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-0.5 opacity-40" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Category */}
          <p className="text-[10px] uppercase tracking-[0.25em] text-aura-cyan font-medium mb-6">
            {question.category}
          </p>

          {/* Question */}
          <h3
            className="text-xl md:text-2xl italic leading-relaxed mb-16 text-foreground/90 max-w-xl mx-auto"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "{question.question}"
          </h3>

          {/* Mic Button */}
          <div className="flex flex-col items-center gap-8">
            <button
              onClick={toggleListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                isListening
                  ? "bg-aura-magenta text-accent-foreground aura-glow-magenta scale-110"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 mic-breathe"
              }`}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {/* Outer ring animation when listening */}
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

            {/* Waveform */}
            {isListening && (
              <div className="flex items-center gap-[3px] h-12">
                {waveformData.map((val, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-aura-magenta/60 transition-all duration-75"
                    style={{
                      height: `${Math.max(4, val * 48)}px`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Idle prompt */}
            {!isListening && (
              <p className="text-xs text-muted-foreground/60">
                Tap to speak. Silence ends the capture.
              </p>
            )}

            {/* Listening indicator */}
            {isListening && (
              <p className="text-xs text-aura-magenta/80 animate-pulse">
                Listening…
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="relative z-10 px-8 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQ === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Skip <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryInterview;
