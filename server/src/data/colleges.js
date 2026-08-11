export const COLLEGES = [
  { id: "iit-bombay", name: "IIT Bombay", location: "Mumbai, Maharashtra", rating: 4.8, category: "Engineering" },
  { id: "delhi-university", name: "Delhi University", location: "Delhi, India", rating: 4.5, category: "Management" },
  { id: "bits-pilani", name: "BITS Pilani", location: "Pilani, Rajasthan", rating: 4.7, category: "Engineering" },
  { id: "vit-vellore", name: "VIT Vellore", location: "Vellore, Tamil Nadu", rating: 4.4, category: "Engineering" },
  { id: "amity-university", name: "Amity University", location: "Noida, Uttar Pradesh", rating: 4.3, category: "Management" },
  { id: "aiims-delhi", name: "AIIMS Delhi", location: "Delhi, India", rating: 4.9, category: "Medical" },
  { id: "nid-ahmedabad", name: "NID Ahmedabad", location: "Ahmedabad, Gujarat", rating: 4.6, category: "Design" },
];

// Rule-based AI counselor: keyword matching -> canned, still helpful responses.
// No external AI calls, fully deterministic and free.
const RULES = [
  {
    keywords: ["class 12", "after 12th", "which career", "best career"],
    reply: "It depends on your interests, skills and goals. I can help you find the best career for you. Would you like to take a quick assessment?",
    suggestQuiz: true,
  },
  {
    keywords: ["salary", "pay", "money", "lpa"],
    reply: "Salaries vary a lot by role and experience. Check the Career Details page for each career's typical salary range in India. Want me to pull up a specific career?",
  },
  {
    keywords: ["engineer", "engineering", "software", "coding", "programming"],
    reply: "Engineering and software roles are in high demand right now. Software Engineer and Data Scientist are strong picks if you enjoy solving problems and technology. Want to see the roadmap for either?",
  },
  {
    keywords: ["doctor", "medical", "medicine", "mbbs"],
    reply: "Medicine is a long but rewarding path — NEET, MBBS, internship, then optional specialization. Want me to show the full Doctor roadmap?",
  },
  {
    keywords: ["design", "ux", "ui", "creative"],
    reply: "If you enjoy creativity and visual thinking, UX Designer or Digital Marketer could be a great fit. Want to see the skills you'd need?",
  },
  {
    keywords: ["college", "university", "admission"],
    reply: "You can browse top colleges by category on the Colleges tab. Want a recommendation based on a specific career?",
  },
  {
    keywords: ["quiz", "assessment", "test"],
    reply: "The Career Quiz takes about 2 minutes and gives you personalized matches. Ready to start it?",
    suggestQuiz: true,
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: "Hey! I'm your AI Career Counselor. Ask me about careers, colleges, or salaries — or take the quiz for personalized matches.",
  },
];

export function counselorReply(message) {
  const text = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return { reply: rule.reply, suggestQuiz: !!rule.suggestQuiz };
    }
  }
  return {
    reply:
      "That's a great question. I can help you find the best career for you based on your interests. Would you like to take a quick assessment?",
    suggestQuiz: true,
  };
}
