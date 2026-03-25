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
