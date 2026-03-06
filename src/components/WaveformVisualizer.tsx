import { useEffect, useRef, useCallback, useState } from "react";

interface WaveformVisualizerProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export function WaveformVisualizer({
  isActive,
  barCount = 32,
  className = "",
}: WaveformVisualizerProps) {
  const [data, setData] = useState<number[]>(() => new Array(barCount).fill(0));
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setData(new Array(barCount).fill(0));
  }, [barCount]);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyserRef.current = analyser;

        const tick = () => {
          if (!analyserRef.current || !mounted) return;
          const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(buffer);
          const sampled = Array.from({ length: barCount }, (_, i) => {
            const idx = Math.floor((i / barCount) * buffer.length);
            return buffer[idx] / 255;
          });
          setData(sampled);
          animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
      } catch {
        // continue without waveform
      }
    };

    init();
    return () => {
      mounted = false;
      cleanup();
    };
  }, [isActive, barCount, cleanup]);

  return (
    <div
      className={`flex items-center justify-center gap-[3px] h-12 ${className}`}
      aria-hidden
    >
      {data.map((val, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-aura-magenta/60 transition-all duration-75"
          style={{ height: `${Math.max(4, val * 48)}px` }}
        />
      ))}
    </div>
  );
}
