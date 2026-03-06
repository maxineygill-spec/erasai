# Eras AI PRD v2 — Gap Analysis

Comparison of current codebase vs PRD (Discovery Protocol Full Stack Rebuild).  
**Date:** March 2026

---

## 1. Backend — **All missing**

| PRD requirement | Current state |
|-----------------|---------------|
| `server/` directory | ❌ Does not exist |
| `server/index.ts` (Express on 3001, CORS, routes) | ❌ |
| `server/routes/synthesize.ts` (POST /api/synthesize) | ❌ |
| `server/routes/ledger.ts` (POST /api/ledger/save) | ❌ |
| `server/prompts/founderSynthesis.ts` | ❌ |
| `server/prompts/employeeSynthesis.ts` | ❌ |
| Vite proxy `/api` → localhost:3001 | ❌ Not in vite.config.ts |

**Dependencies:** express, cors, openai, @supabase/supabase-js, dotenv (and dev: @types/express, @types/cors, ts-node, nodemon) are **not** in package.json.

---

## 2. Frontend — Types, data, lib

| PRD requirement | Current state |
|-----------------|---------------|
| `src/types/discovery.ts` (Question, Response, DiscoverySession, ProtocolState) | ❌ Does not exist |
| `src/data/founderQuestions.ts` (8 questions + transitions) | ❌ DiscoveryInterview has 5 inline questions, different text |
| `src/data/employeeQuestions.ts` (10 questions) | ❌ Does not exist |
| `src/lib/supabase.ts` | ❌ Only `src/lib/utils.ts` exists |
| `src/lib/api.ts` (fetch wrappers for /api) | ❌ Does not exist |

---

## 3. Frontend — Hooks & components

| PRD requirement | Current state |
|----------------|---------------|
| `src/hooks/useSpeechRecognition.ts` | ❌ Logic inline in DiscoveryInterview.tsx |
| `src/hooks/useSpeechSynthesis.ts` | ❌ Does not exist |
| `src/components/VoiceCapture.tsx` | ❌ Logic inline in DiscoveryInterview |
| `src/components/SynthesisDisplay.tsx` (insight + pattern, Playfair, voice playback, Captured badge, Continue after 4s) | ❌ Does not exist |
| `src/components/WaveformVisualizer.tsx` | ❌ Waveform inline in DiscoveryInterview |

---

## 4. Frontend — Pages

| PRD requirement | Current state |
|----------------|---------------|
| **DiscoveryInterview.tsx** (Founder protocol) | ⚠️ Exists but: no API synthesis, 5 questions not 8, no transition lines, no SynthesisDisplay, no voice playback, no completion screen with insights scroll, no ledger save; goes to FounderDashboard |
| **EmployeeDiscovery.tsx** (Employee protocol) | ❌ Does not exist (only EmployeeOnboarding, EmployeeLedger) |
| **LivingLedger.tsx** | ✅ Exists; uses mock data — **not** connected to Supabase |
| KnowledgeClone.tsx, EnduranceCommand.tsx | ✅ Exist (no changes per PRD) |

---

## 5. Routing & config

| PRD requirement | Current state |
|----------------|---------------|
| Route to Living Ledger (for completion CTA) | ❌ LivingLedger not in App.tsx routes |
| Route for Employee Discovery | ❌ No EmployeeDiscovery route |
| `.env` / `.env.example` | ❌ Not present; .env not in .gitignore |
| Server script in package.json | ❌ No script to run Express |

---

## 6. Discovery flow vs PRD

**Current DiscoveryInterview flow:**  
Voice → transcript saved locally → “Synthesis in Progress” (no API) → navigate to FounderDashboard.  
No insight/pattern, no SpeechSynthesis, no per-question synthesis, no completion screen, no ledger save.

**PRD flow:**  
Voice → POST /api/synthesize → SynthesisDisplay (insight + pattern, spoken aloud) → Continue after 4s → transition line → next question → … → completion screen (headline + subtext + scroll of insights + “View your Living Ledger”) → POST /api/ledger/save → navigate to Living Ledger.

---

## 7. Summary

- **Backend:** Fully missing (server, routes, prompts, proxy, deps).
- **Frontend:** Missing types, question data files, Supabase client, API client, speech hooks, VoiceCapture, SynthesisDisplay, WaveformVisualizer, EmployeeDiscovery page; DiscoveryInterview needs full rebuild; LivingLedger needs Supabase.
- **Config:** Missing .env, proxy, server script, .gitignore update for .env.

Implementation order will follow PRD §10 (server → synthesize → proxy → hooks → DiscoveryInterview → SynthesisDisplay → ledger → EmployeeDiscovery → Living Ledger route + data).
