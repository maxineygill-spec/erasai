import { useState, useEffect, useRef, useCallback } from "react";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@600;700&display=swap";

// ── Questions ─────────────────────────────────────────────────────────────────
const FOUNDER_QUESTIONS = [
  "In one paragraph, describe the future your company is building. Not the product — the world it creates.",
  "What does exceptional look like on your team? Describe a moment — real or imagined — where someone embodied exactly what you're building toward.",
  "Walk me through your current tech stack and architecture. Assume I'm a smart new hire on day one — what do I need to understand first?",
  "What is the one thing most new hires get wrong in their first 30 days? What's the gap between what they assume and what's actually true here?",
  "Six months from now, what does success look like for the person you're about to hire? What will they know, do, and feel?",
  "What knowledge lives only in your head right now — processes, decisions, relationships — that your team needs but can't access?",
];

const EMPLOYEE_QUESTIONS = [
  "Tell me honestly — what's your current skill level with the core technologies or domain of this role?",
  "Think about a time you learned something difficult and it actually stuck. How did that happen?",
  "What would make you feel genuinely proud at the end of your first 90 days here?",
  "What's the skill or capability you most want to develop — the one that feels slightly out of reach right now?",
  "What's one question about this role, team, or product that you haven't been able to find an answer to yet?",
];

// ── Theme constants ───────────────────────────────────────────────────────────
const WARM_BG     = "#f7f5f1";
const TEAL        = "#2BAE9A";
const Q_COLOR     = "rgba(22,20,16,0.88)";
const AG_COLOR    = "rgba(22,20,16,0.50)";
const MUTE_COLOR  = "rgba(22,20,16,0.28)";
const THINK_COLOR = "rgba(43,174,154,0.65)";
const MIC_IDLE    = "rgba(22,20,16,0.28)";
const PROG_BG     = "rgba(0,0,0,0.07)";

const ROLE_CONFIG = {
  founder: {
    label: "I'm a Founder",
    sub: "Capture your vision, define what great looks like, and build the knowledge architecture your team will grow into.",
    icon: "◎",
    hex: TEAL,
    blobHex: "#4361EE",
    cr: 67, cg: 97, cb: 238,
    pageBg: WARM_BG,
    qColor: Q_COLOR, agColor: AG_COLOR, muteColor: MUTE_COLOR,
    thinkColor: THINK_COLOR, micIdle: MIC_IDLE, progressBg: PROG_BG,
    dark: false,
    questions: FOUNDER_QUESTIONS,
    btnText: "Begin Founder Interview",
  },
  employee: {
    label: "I'm joining a team",
    sub: "Map where you are, where you want to go, and receive a personalized learning path built around your growth.",
    icon: "✦",
    hex: TEAL,
    blobHex: "#6B9E7E",
    cr: 107, cg: 158, cb: 126,
    pageBg: WARM_BG,
    qColor: Q_COLOR, agColor: AG_COLOR, muteColor: MUTE_COLOR,
    thinkColor: THINK_COLOR, micIdle: MIC_IDLE, progressBg: PROG_BG,
    dark: false,
    questions: EMPLOYEE_QUESTIONS,
    btnText: "Begin My Discovery",
  },
} as const;

type Role = keyof typeof ROLE_CONFIG;
type AgentState = "idle" | "speaking" | "listening" | "thinking" | "complete";

// ── Perlin noise ──────────────────────────────────────────────────────────────
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }

const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];
})();

function noise2(x: number, y: number): number {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const g = (h: number, gx: number, gy: number) => {
    const idx = h & 3;
    return ([1, -1, 1, -1][idx]) * gx + ([1, 1, -1, -1][idx]) * gy;
  };
  const aa = PERM[PERM[X] + Y],     ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y], bb = PERM[PERM[X + 1] + Y + 1];
  return lerp(
    lerp(g(aa, xf, yf),     g(ba, xf - 1, yf),     u),
    lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u),
    v
  );
}

// ── Blob ──────────────────────────────────────────────────────────────────────
function Blob({
  state, cr, cg, cb, amplitude,
}: {
  state: AgentState;
  cr: number; cg: number; cb: number;
  amplitude: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const stateRef  = useRef(state);
  const ampRef    = useRef(amplitude);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const SIZE = canvas.width; // 360 px
    const cx = SIZE / 2, cy = SIZE / 2;
    const PTS = 200;

    const SPEEDS: Record<AgentState, number> = {
      idle: 0.0009, speaking: 0.0022, listening: 0.0016,
      thinking: 0.0010, complete: 0.0006,
    };
    const BASE_R = SIZE * 0.32;
    const WOBBLE: Record<AgentState, number> = {
      idle:      SIZE * 0.055,
      speaking:  SIZE * 0.095,
      listening: SIZE * 0.075,
      thinking:  SIZE * 0.038,
      complete:  SIZE * 0.025,
    };

    function draw() {
      const s = stateRef.current;
      tRef.current += SPEEDS[s];
      const t = tRef.current;
      const mic = ampRef.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      const pts: [number, number][] = [];
      for (let i = 0; i < PTS; i++) {
        const angle = (i / PTS) * Math.PI * 2;
        const nx = Math.cos(angle) * 0.9 + t * 0.5;
        const ny = Math.sin(angle) * 0.9 + t * 0.38;
        const n1 = noise2(nx, ny);
        const n2 = noise2(nx * 1.7 + 4.3, ny * 1.7 + 1.8) * 0.18;
        const nMic = s === "listening"
          ? noise2(nx * 2.2 + t * 1.5, ny * 2.2) * mic * 0.30
          : 0;
        const n = (n1 + n2 + nMic + 1.18) / 2.36;
        const r = BASE_R + WOBBLE[s] * n;
        pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
      }

      // Smooth closed Catmull-Rom spline
      ctx.beginPath();
      for (let i = 0; i < PTS; i++) {
        const [px, py] = pts[(i - 1 + PTS) % PTS];
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % PTS];
        const [x3, y3] = pts[(i + 2) % PTS];
        const cp1x = x1 + (x2 - px) / 6, cp1y = y1 + (y2 - py) / 6;
        const cp2x = x2 - (x3 - x1) / 6, cp2y = y2 - (y3 - y1) / 6;
        if (i === 0) ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      }
      ctx.closePath();

      ctx.save();
      ctx.clip();

      const maxR = BASE_R + WOBBLE[s];
      const fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.05);
      fill.addColorStop(0,    `rgba(${cr},${cg},${cb},1.00)`);
      fill.addColorStop(0.55, `rgba(${cr},${cg},${cb},0.92)`);
      fill.addColorStop(0.80, `rgba(${cr},${cg},${cb},0.55)`);
      fill.addColorStop(0.93, `rgba(${cr},${cg},${cb},0.15)`);
      fill.addColorStop(1,    `rgba(${cr},${cg},${cb},0.00)`);
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [cr, cg, cb]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={360}
      style={{ width: 280, height: 280, display: "block" }}
    />
  );
}

// ── useTypewriter ─────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) { setDone(true); return; }

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

// ── RoleSelect ────────────────────────────────────────────────────────────────
function RoleSelect({ onSelect }: { onSelect: (role: Role) => void }) {
  const [hovered, setHovered] = useState<Role | null>(null);

  return (
    <div style={{
      minHeight: "100dvh",
      background: WARM_BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Inter Tight', sans-serif",
    }}>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.18em",
        color: TEAL,
        textTransform: "uppercase",
        marginBottom: 16,
      }}>
        ERAS AI
      </p>

      <h1 style={{
        fontSize: "clamp(26px, 5vw, 40px)",
        fontWeight: 300,
        color: Q_COLOR,
        textAlign: "center",
        lineHeight: 1.25,
        marginBottom: 12,
        maxWidth: 560,
      }}>
        Who are you here as?
      </h1>

      <p style={{
        fontSize: 15,
        color: AG_COLOR,
        textAlign: "center",
        marginBottom: 52,
        maxWidth: 400,
        lineHeight: 1.6,
      }}>
        Your session is shaped around your perspective.
      </p>

      <div style={{
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        maxWidth: 700,
      }}>
        {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
          const cfg = ROLE_CONFIG[role];
          const isHovered = hovered === role;
          return (
            <button
              key={role}
              onMouseEnter={() => setHovered(role)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(role)}
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                background: isHovered ? cfg.blobHex : "#fff",
                border: `1.5px solid ${isHovered ? cfg.blobHex : "rgba(22,20,16,0.10)"}`,
                borderRadius: 18,
                padding: "32px 28px",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.18s, border-color 0.18s, transform 0.15s",
                transform: isHovered ? "translateY(-3px)" : "none",
                boxShadow: isHovered
                  ? `0 12px 32px ${cfg.blobHex}44`
                  : "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{
                fontSize: 28,
                marginBottom: 14,
                color: isHovered ? "#fff" : cfg.blobHex,
                transition: "color 0.18s",
              }}>
                {cfg.icon}
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: isHovered ? "#fff" : Q_COLOR,
                marginBottom: 10,
                transition: "color 0.18s",
              }}>
                {cfg.label}
              </div>
              <div style={{
                fontSize: 13.5,
                color: isHovered ? "rgba(255,255,255,0.82)" : AG_COLOR,
                lineHeight: 1.6,
                transition: "color 0.18s",
              }}>
                {cfg.sub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Interview ─────────────────────────────────────────────────────────────────
function Interview({
  role,
  onComplete,
}: {
  role: Role;
  onComplete: (answers: string[]) => void;
}) {
  const cfg       = ROLE_CONFIG[role];
  const questions = cfg.questions as readonly string[];
  const total     = questions.length;

  const [qIdx,       setQIdx]       = useState(0);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [answers,    setAnswers]    = useState<string[]>(() => Array(total).fill(""));
  const [transcript, setTranscript] = useState("");
  const [amplitude,  setAmplitude]  = useState(0);
  const [textMode,   setTextMode]   = useState(false);
  const [textInput,  setTextInput]  = useState("");
  const [started,    setStarted]    = useState(false);
  const [recording,  setRecording]  = useState(false);
  const [micErr,     setMicErr]     = useState<string | null>(null);

  const recognitionRef   = useRef<any>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const streamRef        = useRef<MediaStream | null>(null);
  const silenceRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef           = useRef<number>(0);
  const transcriptRef    = useRef("");
  const qIdxRef          = useRef(0);
  const answersRef       = useRef<string[]>(Array(total).fill(""));
  const advanceOnEndRef  = useRef(false);

  useEffect(() => { qIdxRef.current   = qIdx;    }, [qIdx]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Typewriter runs as soon as started; resets each time qIdx changes
  const { displayed, done: questionDone } = useTypewriter(
    started ? questions[qIdx] : "",
    20,
  );

  // ── Audio amplitude loop ───────────────────────────────────────────────────
  const drawAmplitude = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const avg = data.reduce((s, v) => s + v, 0) / data.length;
    setAmplitude(avg / 128);
    rafRef.current = requestAnimationFrame(drawAmplitude);
  }, []);

  // ── Cleanup helpers ────────────────────────────────────────────────────────
  const cleanupAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current?.state !== "closed") audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    streamRef.current   = null;
    setAmplitude(0);
  }, []);

  // ── startAmp / stopAmp helpers ─────────────────────────────────────────────
  const startAmp = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyserRef.current = analyser;
    drawAmplitude();
  }, [drawAmplitude]);

  const stopAmp = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (audioCtxRef.current?.state !== "closed") audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    setAmplitude(0);
  }, []);

  useEffect(() => () => {
    const r = (window as any)._era_rec;
    if (r) { try { r.stop(); } catch {} }
    if (silenceRef.current) clearTimeout(silenceRef.current);
    cleanupAudio();
  }, [cleanupAudio]);

  // ── Advance to next question or call onComplete ────────────────────────────
  const advance = useCallback((savedAnswer: string) => {
    const idx     = qIdxRef.current;
    const updated = [...answersRef.current];
    updated[idx]  = savedAnswer;
    setAnswers(updated);
    answersRef.current = updated;

    setAgentState("thinking");
    setTimeout(() => {
      if (idx + 1 < total) {
        setQIdx(idx + 1);
        setTranscript("");
        transcriptRef.current = "";
        setTextInput("");
        setAgentState("speaking");
      } else {
        setAgentState("complete");
        setTimeout(() => onComplete(updated), 1200);
      }
    }, 900);
  }, [total, onComplete]);

  const handleAnswer = advance;

  // ── Stop recording ─────────────────────────────────────────────────────────
  const stopRec = useCallback(() => {
    const r = (window as any)._era_rec;
    if (r) { try { r.stop(); } catch {} }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    stopAmp();
    setRecording(false);
  }, [stopAmp]);

  // ── Start recording ────────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    setMicErr(null);
    const SR = (window as any).SpeechRecognition ||
               (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicErr("Speech recognition requires Chrome.");
      setTextMode(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startAmp(stream);
    } catch {
      // amplitude won't work but speech still can
    }
    let accumulated = "";
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          accumulated = (accumulated + " " + e.results[i][0].transcript).trim();
        }
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "no-speech") return;
      setRecording(false);
      stopAmp();
      setMicErr("Mic error — please try again or use text mode.");
    };
    rec.onend = () => {
      setRecording(false);
      stopAmp();
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (accumulated.trim().length > 2) {
        handleAnswer(accumulated.trim());
      } else {
        setMicErr("Nothing captured — please try again.");
      }
    };
    (window as any)._era_rec = rec;
    rec.start();
    setRecording(true);
  }, [startAmp, stopAmp, handleAnswer]);

  // Once typewriter finishes the question, begin listening
  useEffect(() => {
    if (questionDone && agentState === "speaking") {
      setAgentState("listening");
      if (!textMode) startListening();
    }
  }, [questionDone, agentState, textMode, startListening]);

  // ── Text-mode submit ───────────────────────────────────────────────────────
  const submitText = useCallback(() => {
    const val = textInput.trim();
    if (!val) return;
    advance(val);
  }, [textInput, advance]);

  // ── Nav helpers ────────────────────────────────────────────────────────────
  const skip = useCallback(() => {
    const r = (window as any)._era_rec;
    if (r) { try { r.stop(); } catch {} (window as any)._era_rec = null; }
    if (silenceRef.current) clearTimeout(silenceRef.current);
    stopAmp();
    setRecording(false);
    advance(answersRef.current[qIdxRef.current] ?? "");
  }, [stopAmp, advance]);

  const back = useCallback(() => {
    if (qIdxRef.current === 0) return;
    const r = (window as any)._era_rec;
    if (r) { try { r.stop(); } catch {} (window as any)._era_rec = null; }
    if (silenceRef.current) clearTimeout(silenceRef.current);
    stopAmp();
    setRecording(false);
    setTranscript("");
    transcriptRef.current = "";
    setTextInput("");
    setQIdx((i) => i - 1);
    setAgentState("speaking");
  }, [cleanupAudio]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const progress = ((qIdx + 1) / total) * 100;

  const STATE_LABEL: Record<AgentState, string> = {
    idle:      "",
    speaking:  "ERAS is asking…",
    listening: textMode ? "Type your answer below" : "Listening…",
    thinking:  "Processing…",
    complete:  "Complete",
  };

  const micColor =
    agentState === "listening" ? cfg.blobHex : cfg.micIdle;

  // ── Pre-start splash ───────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{
        minHeight: "100dvh", background: cfg.pageBg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter Tight', sans-serif",
      }}>
        <Blob state="idle" cr={cfg.cr} cg={cfg.cg} cb={cfg.cb} amplitude={0} />

        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
          fontSize: 13, letterSpacing: "0.18em", color: TEAL,
          textTransform: "uppercase", marginTop: 28, marginBottom: 12,
        }}>ERAS AI</p>

        <h2 style={{
          fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 300,
          color: cfg.qColor, textAlign: "center",
          lineHeight: 1.3, marginBottom: 12, maxWidth: 480,
        }}>
          {total} questions. Your answers shape everything.
        </h2>

        <p style={{
          fontSize: 14, color: cfg.agColor, textAlign: "center",
          marginBottom: 44, maxWidth: 380, lineHeight: 1.65,
        }}>
          Speak naturally. Pause when done — ERAS listens and moves on.
          No mic? You can type instead.
        </p>

        <button
          onClick={() => { setStarted(true); setAgentState("speaking"); }}
          style={{
            background: cfg.blobHex, color: "#fff",
            border: "none", borderRadius: 50,
            padding: "14px 44px", fontSize: 15,
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 500, cursor: "pointer",
            letterSpacing: "0.02em",
            boxShadow: `0 8px 24px ${cfg.blobHex}44`,
          }}
        >
          {cfg.btnText}
        </button>
      </div>
    );
  }

  // ── Main interview view ────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100dvh", background: cfg.pageBg,
      display: "flex", flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Inter Tight', sans-serif",
      padding: "0 20px",
    }}>

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 680,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 0 0",
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
          fontSize: 13, letterSpacing: "0.18em",
          color: TEAL, textTransform: "uppercase",
        }}>ERAS AI</span>
        <span style={{ fontSize: 12, color: cfg.muteColor, letterSpacing: "0.08em" }}>
          {qIdx + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: "100%", maxWidth: 680,
        height: 2, background: cfg.progressBg,
        borderRadius: 2, margin: "10px 0 0", overflow: "hidden",
      }}>
        <div style={{
          width: `${progress}%`, height: "100%",
          background: cfg.blobHex,
          transition: "width 0.55s ease",
        }} />
      </div>

      {/* Blob */}
      <div style={{ margin: "28px 0 16px", position: "relative" }}>
        <Blob
          state={agentState}
          cr={cfg.cr} cg={cfg.cg} cb={cfg.cb}
          amplitude={amplitude}
        />
        <div style={{
          position: "absolute", bottom: 10, left: 0, right: 0,
          textAlign: "center", fontSize: 11,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: agentState === "listening" ? cfg.blobHex : cfg.muteColor,
          transition: "color 0.3s", pointerEvents: "none",
        }}>
          {STATE_LABEL[agentState]}
        </div>
      </div>

      {/* Question text (typewriter) */}
      <div style={{
        width: "100%", maxWidth: 600, minHeight: 88,
        textAlign: "center",
        fontSize: "clamp(16px, 2.8vw, 21px)",
        fontWeight: 300, fontStyle: "italic",
        color: cfg.qColor, lineHeight: 1.55,
        marginBottom: 24,
      }}>
        {displayed}
        {agentState === "speaking" && (
          <span style={{
            display: "inline-block", width: 2, height: "1em",
            background: cfg.blobHex, marginLeft: 3,
            verticalAlign: "text-bottom",
            animation: "aura-blink 0.9s step-end infinite",
          }} />
        )}
      </div>

      {/* Text mode: textarea + submit */}
      {textMode ? (
        <div style={{ width: "100%", maxWidth: 560, marginBottom: 20 }}>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitText();
            }}
            disabled={agentState === "thinking" || agentState === "complete"}
            placeholder="Type your answer here…"
            rows={4}
            style={{
              width: "100%", padding: "14px 16px",
              fontSize: 15, fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 300, color: cfg.qColor,
              background: "rgba(255,255,255,0.72)",
              border: "1.5px solid rgba(22,20,16,0.11)",
              borderRadius: 12, resize: "none", outline: "none",
              boxSizing: "border-box", lineHeight: 1.6,
            }}
          />
          <button
            onClick={submitText}
            disabled={!textInput.trim() || agentState === "thinking"}
            style={{
              marginTop: 10, width: "100%",
              background: cfg.blobHex, color: "#fff",
              border: "none", borderRadius: 50,
              padding: "12px 0", fontSize: 14,
              fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 500, cursor: "pointer",
              opacity: textInput.trim() ? 1 : 0.4,
              transition: "opacity 0.2s",
            }}
          >
            Submit  ↵  (⌘ Enter)
          </button>
        </div>
      ) : (
        /* Voice mode: live transcript preview */
        transcript && agentState === "listening" && (
          <p style={{
            width: "100%", maxWidth: 560,
            fontSize: 14, color: cfg.agColor,
            lineHeight: 1.65, textAlign: "center",
            marginBottom: 18, fontStyle: "italic",
          }}>
            "{transcript}"
          </p>
        )
      )}

      {/* Mic button (voice mode) */}
      {!textMode && (
        <button
          onClick={() => { if (agentState === "listening") stopRec(); }}
          disabled={agentState !== "listening"}
          aria-label="Stop recording"
          style={{
            width: 64, height: 64, borderRadius: "50%",
            border: `2px solid ${micColor}`,
            background: agentState === "listening"
              ? `${cfg.blobHex}18`
              : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: agentState === "listening" ? "pointer" : "default",
            transition: "border-color 0.3s, background 0.3s",
            marginBottom: 8, position: "relative",
          }}
        >
          {agentState === "listening" && (
            <span style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              border: `1.5px solid ${cfg.blobHex}55`,
              animation: "aura-ping 1.4s ease-out infinite",
            }} />
          )}
          {/* Mic SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={micColor} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="9"  y1="22" x2="15" y2="22"/>
          </svg>
        </button>
      )}

      {/* Switch to text mode */}
      {!textMode && agentState === "listening" && (
        <button
          onClick={() => {
            try { recognitionRef.current?.stop(); } catch {}
            cleanupAudio();
            setTextMode(true);
          }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: cfg.muteColor,
            textDecoration: "underline", marginBottom: 4,
          }}
        >
          Switch to text mode
        </button>
      )}

      {/* Bottom nav */}
      <div style={{
        width: "100%", maxWidth: 560,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "auto", padding: "20px 0 32px",
      }}>
        <button
          onClick={back}
          disabled={qIdx === 0}
          style={{
            background: "none", border: "none",
            cursor: qIdx === 0 ? "default" : "pointer",
            fontSize: 13,
            color: qIdx === 0 ? "transparent" : cfg.muteColor,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back
        </button>
        <button
          onClick={skip}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: cfg.muteColor,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          Skip →
        </button>
      </div>

      {/* Injected keyframes */}
      <style>{`
        @keyframes aura-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes aura-ping  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.55);opacity:0} }
      `}</style>
    </div>
  );
}

// ── AuraAgent (root) ──────────────────────────────────────────────────────────
type Screen = "select" | "interview" | "complete";

export default function AuraAgent() {
  const [screen,  setScreen]  = useState<Screen>("select");
  const [role,    setRole]    = useState<Role | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  // Inject Google Fonts once
  useEffect(() => {
    if (document.getElementById("aura-fonts")) return;
    const link = document.createElement("link");
    link.id   = "aura-fonts";
    link.rel  = "stylesheet";
    link.href = FONT_LINK;
    document.head.appendChild(link);
  }, []);

  if (screen === "select") {
    return (
      <RoleSelect
        onSelect={(r) => {
          setRole(r);
          setScreen("interview");
        }}
      />
    );
  }

  if (screen === "interview" && role) {
    return (
      <Interview
        role={role}
        onComplete={(ans) => {
          setAnswers(ans);
          setScreen("complete");
        }}
      />
    );
  }

  // ── Complete screen ──────────────────────────────────────────────────────
  const cfg = role ? ROLE_CONFIG[role] : ROLE_CONFIG.founder;
  return (
    <div style={{
      minHeight: "100dvh", background: cfg.pageBg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Inter Tight', sans-serif",
    }}>
      <Blob state="complete" cr={cfg.cr} cg={cfg.cg} cb={cfg.cb} amplitude={0} />

      <p style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
        fontSize: 13, letterSpacing: "0.18em", color: TEAL,
        textTransform: "uppercase", marginTop: 28, marginBottom: 14,
      }}>ERAS AI</p>

      <h2 style={{
        fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 300,
        color: cfg.qColor, textAlign: "center",
        lineHeight: 1.3, marginBottom: 12, maxWidth: 480,
      }}>
        That's everything.
      </h2>

      <p style={{
        fontSize: 15, color: cfg.agColor, textAlign: "center",
        marginBottom: 16, maxWidth: 400, lineHeight: 1.7,
      }}>
        {answers.filter(Boolean).length} of {answers.length} questions answered.
        Your responses have been captured.
      </p>

      <button
        onClick={() => {
          setScreen("select");
          setRole(null);
          setAnswers([]);
        }}
        style={{
          marginTop: 28,
          background: "none",
          border: `1.5px solid rgba(22,20,16,0.15)`,
          borderRadius: 50, padding: "11px 32px",
          fontSize: 13, fontFamily: "'Inter Tight', sans-serif",
          color: cfg.agColor, cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        Start over
      </button>
    </div>
  );
}
