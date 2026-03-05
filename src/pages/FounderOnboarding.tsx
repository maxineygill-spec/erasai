import OnboardingFlow from "@/components/OnboardingFlow";

const founderSteps = [
  {
    category: "North Star",
    question: "In one paragraph, describe the future your company is building. Not the product — the world it creates.",
  },
  {
    category: "Culture Blueprint",
    question: "What does exceptional look like on your team? Describe a moment — real or imagined — where someone embodied exactly what you're building toward.",
  },
  {
    category: "Knowledge Architecture",
    question: "Walk me through your current tech stack and architecture. Assume I'm a smart new hire on day one — what do I need to understand first?",
  },
  {
    category: "Onboarding Intelligence",
    question: "What is the one thing most new hires get wrong in their first 30 days? What's the gap between what they assume and what's actually true here?",
  },
  {
    category: "Success Model",
    question: "Six months from now, what does success look like for the person you're about to hire? What will they know, do, and feel?",
  },
  {
    category: "Institutional Logic",
    question: "What knowledge lives only in your head right now — processes, decisions, relationships — that your team needs but can't access?",
  },
];

const FounderOnboarding = () => (
  <OnboardingFlow
    steps={founderSteps}
    synthesisMessage="We're translating your vision into a knowledge architecture. This becomes the foundation every new hire learns from."
    redirectTo="/founder/dashboard"
  />
);

export default FounderOnboarding;
