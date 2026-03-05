import OnboardingFlow from "@/components/OnboardingFlow";

const employeeSteps = [
  {
    category: "Knowledge Baseline",
    question: "Tell me honestly — what's your current skill level with the core technologies or domain of this role?",
  },
  {
    category: "Learning DNA",
    question: "Think about a time you learned something difficult and it actually stuck. How did that happen?",
  },
  {
    category: "Intrinsic Drive",
    question: "What would make you feel genuinely proud at the end of your first 90 days here?",
  },
  {
    category: "Growth Vector",
    question: "What's the skill or capability you most want to develop — the one that feels slightly out of reach right now?",
  },
  {
    category: "Context Gap",
    question: "What's one question about this role, team, or product that you haven't been able to find an answer to yet?",
  },
];

const EmployeeOnboarding = () => (
  <OnboardingFlow
    steps={employeeSteps}
    synthesisMessage="We're matching your growth profile against the founder's knowledge architecture to build your personalized learning path."
    redirectTo="/employee/ledger"
  />
);

export default EmployeeOnboarding;
