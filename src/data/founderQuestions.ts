import type { Question } from "@/types/discovery";

export const founderQuestions: Question[] = [
  {
    id: 1,
    category: "Origin",
    text: "Forget your product for a moment. Describe the world your company exists to create — what's different about how people work, grow, and leave something behind?",
    transition: "Now let's go back to where this began.",
  },
  {
    id: 2,
    category: "Founding Moment",
    text: "Before this company had a name — maybe before it had a co-founder — you saw this problem so clearly it felt personal. What's that story?",
    transition: "Let's talk about what you see that others don't.",
  },
  {
    id: 3,
    category: "Contrarian Thesis",
    text: "What do you believe about your market that most people in it still think is wrong?",
    transition: "Now, the people you're building with.",
  },
  {
    id: 4,
    category: "Cultural Truth",
    text: "What's the one thing a new hire needs to understand in their first 30 days that isn't written down anywhere — the thing that separates the people who thrive here from the ones who struggle?",
    transition: "Every founder has a graveyard. Let's visit yours.",
  },
  {
    id: 5,
    category: "Graveyard Decision",
    text: "Tell me about a call you made that killed something promising — a feature, a partnership, a hire. What did you learn that you haven't said out loud before?",
    transition: "Let's talk about the relationships that hold this together.",
  },
  {
    id: 6,
    category: "Relational Capital",
    text: "Who is one person — customer, advisor, investor — where the relationship only works because of you personally, and what would someone need to know to not break it?",
    transition: "This next one is the hardest. Take your time.",
  },
  {
    id: 7,
    category: "Bus Test",
    text: "What's the problem in this company that only you currently see clearly — and that no one else could solve if you weren't here tomorrow?",
    transition: "One last question. This one is about the future.",
  },
  {
    id: 8,
    category: "The Inheritor",
    text: "Describe the person who could one day carry this company forward without you. Not their credentials — their relationship to hard problems, to people, to the work itself. What do they know how to do that most people never learn?",
  },
];
