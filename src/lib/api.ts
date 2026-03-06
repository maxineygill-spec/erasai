import type { Response } from "@/types/discovery";

export interface SynthesizePayload {
  transcript: string;
  question: string;
  category: string;
  protocol: "founder" | "employee";
  questionIndex: number;
}

export interface SynthesizeResult {
  insight: string;
  pattern: string;
  timestamp: string;
  questionIndex?: number;
}

export async function synthesize(payload: SynthesizePayload): Promise<SynthesizeResult> {
  const res = await fetch("/api/synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Synthesis failed");
  }
  return res.json();
}

export interface SaveLedgerPayload {
  userId: string;
  protocol: "founder" | "employee";
  responses: Response[];
  completedAt: string;
}

export async function saveLedger(payload: SaveLedgerPayload): Promise<{ success: boolean; id: string }> {
  const res = await fetch("/api/ledger/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Failed to save");
  }
  return res.json();
}
