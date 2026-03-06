import { getSystemPrompt as getFounderPrompt } from "./founderSynthesis";
import { getSystemPrompt as getEmployeePrompt } from "./employeeSynthesis";

export function getSystemPrompt(protocol: string, category: string): string {
  const founder = getFounderPrompt(protocol, category);
  if (founder) return founder;
  return getEmployeePrompt(protocol, category);
}
