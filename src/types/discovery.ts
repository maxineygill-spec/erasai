export interface Question {
  id: number;
  category: string;
  text: string;
  transition?: string;
}

export interface Response {
  questionId: number;
  question: string;
  category: string;
  transcript: string;
  insight: string;
  pattern: string;
  timestamp: string;
}

export interface DiscoverySession {
  userId: string;
  protocol: "founder" | "employee";
  responses: Response[];
  completedAt?: string;
}

export type ProtocolState =
  | "idle"
  | "listening"
  | "processing"
  | "displaying"
  | "transitioning"
  | "complete";
