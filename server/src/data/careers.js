// Rule-based recommendation data. No AI calls — pure trait-matching logic.
// Each trait a user can pick in the quiz maps to a weight (0-1) on each career.
// Match % = (dot product of user trait vector and career trait vector) / (career vector magnitude sum)

export const TRAITS = [
  "solving_problems",
  "creativity_design",
  "helping_people",
  "working_numbers",
  "leading_managing",
  "exploring_technology",
  "writing_communicating",
];

export const CAREERS = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    tagline: "Analyze data and build models to solve real-world problems.",
    tags: ["High Demand", "High Salary"],
    salaryRange: "₹8 - ₹25 LPA",
    topSkills: ["Python", "Statistics", "SQL", "Machine Learning"],
    roadmap: [
      { step: "Learn the Basics", detail: "Math, Statistics, Python" },
      { step: "Data Analysis", detail: "Excel, SQL, Data Visualization" },
      { step: "Machine Learning", detail: "ML Basics, Algorithms" },
      { step: "Projects", detail: "Build real-world projects" },
      { step: "Internships", detail: "Gain practical experience" },
      { step: "Job & Career Growth", detail: "Apply & grow in your career" },
    ],
    traits: { solving_problems: 0.9, working_numbers: 1, exploring_technology: 0.8, creativity_design: 0.2, helping_people: 0.1, leading_managing: 0.2, writing_communicating: 0.2 },
  },
  {
    id: "psychologist",
    title: "Psychologist",
    tagline: "Understand human behavior and help people improve their mental wellbeing.",
    tags: ["Growing Field"],
    salaryRange: "₹4 - ₹15 LPA",
    topSkills: ["Empathy", "Counseling", "Research", "Communication"],
    roadmap: [
      { step: "Foundations", detail: "Psychology basics, human behavior" },
      { step: "Specialize", detail: "Clinical, counseling, or organizational track" },
      { step: "Supervised Practice", detail: "Internships under licensed professionals" },
      { step: "Licensure", detail: "Certification / registration" },
      { step: "Practice", detail: "Private practice, hospitals, or schools" },
    ],
    traits: { helping_people: 1, writing_communicating: 0.7, solving_problems: 0.4, creativity_design: 0.2, working_numbers: 0.2, leading_managing: 0.3, exploring_technology: 0.1 },
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    tagline: "Design intuitive, delightful digital experiences for real users.",
    tags: ["High Demand", "Creative"],
    salaryRange: "₹5 - ₹18 LPA",
    topSkills: ["Figma", "User Research", "Prototyping", "Visual Design"],
    roadmap: [
      { step: "Design Foundations", detail: "Color, typography, layout" },
      { step: "Tools", detail: "Figma, prototyping tools" },
      { step: "User Research", detail: "Interviews, usability testing" },
      { step: "Portfolio", detail: "Build 3-5 case studies" },
      { step: "Internship", detail: "Apply skills on real products" },
    ],
    traits: { creativity_design: 1, solving_problems: 0.5, helping_people: 0.4, writing_communicating: 0.4, exploring_technology: 0.3, working_numbers: 0.1, leading_managing: 0.2 },
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    tagline: "Build and ship the software that powers everyday life.",
    tags: ["High Demand", "IT & Software"],
    salaryRange: "₹6 - ₹22 LPA",
    topSkills: ["DSA", "System Design", "JavaScript/Python", "Git"],
    roadmap: [
      { step: "Learn Programming", detail: "Pick a language, learn fundamentals" },
      { step: "Data Structures & Algorithms", detail: "Core CS problem solving" },
      { step: "Build Projects", detail: "Ship real apps end-to-end" },
      { step: "Internships", detail: "Real-world engineering experience" },
      { step: "Job & Growth", detail: "Apply, interview, keep leveling up" },
    ],
    traits: { exploring_technology: 1, solving_problems: 0.9, working_numbers: 0.4, creativity_design: 0.3, helping_people: 0.1, leading_managing: 0.2, writing_communicating: 0.2 },
  },
  {
    id: "product-manager",
    title: "Product Manager",
    tagline: "Lead products that make an impact and users love.",
    tags: ["High Demand", "Leadership"],
    salaryRange: "₹15 - ₹30 LPA",
    topSkills: ["Strategy", "Communication", "Analytics", "Prioritization"],
    roadmap: [
      { step: "Understand the Craft", detail: "Product thinking, user needs" },
      { step: "Build Domain Skills", detail: "Analytics, market research" },
      { step: "Ship Something", detail: "Lead a small project end-to-end" },
      { step: "Internship / APM roles", detail: "Get hands-on PM experience" },
      { step: "Grow into PM", detail: "Own a product area" },
    ],
    traits: { leading_managing: 1, writing_communicating: 0.7, solving_problems: 0.5, working_numbers: 0.4, exploring_technology: 0.3, creativity_design: 0.3, helping_people: 0.3 },
  },
  {
    id: "doctor",
    title: "Doctor",
    tagline: "Diagnose, treat, and care for patients across their lifetime.",
    tags: ["High Demand", "Healthcare"],
    salaryRange: "₹8 - ₹25 LPA",
    topSkills: ["Biology", "Clinical Skills", "Empathy", "Decision Making"],
    roadmap: [
      { step: "NEET / Pre-Med", detail: "Biology, chemistry, physics foundation" },
      { step: "MBBS", detail: "Medical college coursework" },
      { step: "Internship", detail: "Supervised clinical rotations" },
      { step: "Specialization", detail: "Optional PG / specialty" },
      { step: "Practice", detail: "Hospital or private practice" },
    ],
    traits: { helping_people: 1, solving_problems: 0.7, working_numbers: 0.3, writing_communicating: 0.4, leading_managing: 0.3, creativity_design: 0.1, exploring_technology: 0.2 },
  },
  {
    id: "cybersecurity-analyst",
    title: "Cyber Security Analyst",
    tagline: "Protect systems and data from digital threats.",
    tags: ["High Demand"],
    salaryRange: "₹6 - ₹20 LPA",
    topSkills: ["Networking", "Security Tools", "Risk Analysis", "Scripting"],
    roadmap: [
      { step: "Networking Basics", detail: "TCP/IP, systems fundamentals" },
      { step: "Security Fundamentals", detail: "Threats, tools, best practices" },
      { step: "Certifications", detail: "Security+, CEH, etc." },
      { step: "Hands-on Labs", detail: "CTFs, home labs" },
      { step: "Job & Growth", detail: "SOC analyst and beyond" },
    ],
    traits: { exploring_technology: 1, solving_problems: 0.8, working_numbers: 0.3, helping_people: 0.2, creativity_design: 0.1, leading_managing: 0.2, writing_communicating: 0.2 },
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    tagline: "Grow brands and reach audiences across digital channels.",
    tags: ["High Demand"],
    salaryRange: "₹4 - ₹14 LPA",
    topSkills: ["SEO", "Content Strategy", "Analytics", "Social Media"],
    roadmap: [
      { step: "Marketing Fundamentals", detail: "Core concepts, funnels" },
      { step: "Channels", detail: "SEO, paid ads, social, email" },
      { step: "Analytics", detail: "Measure and optimize campaigns" },
      { step: "Portfolio", detail: "Run real or mock campaigns" },
      { step: "Job & Growth", detail: "Apply and specialize" },
    ],
    traits: { creativity_design: 0.6, writing_communicating: 0.8, working_numbers: 0.4, exploring_technology: 0.4, leading_managing: 0.3, solving_problems: 0.3, helping_people: 0.2 },
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    title: "Which activities do you enjoy the most?",
    subtitle: "Select all that apply",
    multi: true,
    options: [
      { trait: "solving_problems", label: "Solving Problems", icon: "puzzle" },
      { trait: "creativity_design", label: "Creativity & Design", icon: "palette" },
      { trait: "helping_people", label: "Helping People", icon: "heart" },
      { trait: "working_numbers", label: "Working with Numbers", icon: "bar-chart" },
      { trait: "leading_managing", label: "Leading & Managing", icon: "flag" },
      { trait: "exploring_technology", label: "Exploring Technology", icon: "cpu" },
    ],
  },
  {
    id: "q2",
    title: "Which subjects do you enjoy the most?",
    subtitle: "Choose one or more options",
    multi: true,
    options: [
      { trait: "working_numbers", label: "Mathematics", icon: "calculator" },
      { trait: "solving_problems", label: "Science", icon: "flask" },
      { trait: "writing_communicating", label: "English", icon: "book" },
      { trait: "exploring_technology", label: "Computer Science", icon: "code" },
      { trait: "creativity_design", label: "Arts", icon: "palette" },
      { trait: "helping_people", label: "Social Studies", icon: "users" },
    ],
  },
  {
    id: "q3",
    title: "What type of work excites you the most?",
    subtitle: "Choose one option",
    multi: false,
    options: [
      { trait: "exploring_technology", label: "Solving technical problems", icon: "code" },
      { trait: "creativity_design", label: "Creating designs", icon: "palette" },
      { trait: "helping_people", label: "Helping people", icon: "users" },
      { trait: "writing_communicating", label: "Writing and expressing ideas", icon: "edit" },
      { trait: "leading_managing", label: "Leading and managing teams", icon: "flag" },
    ],
  },
  {
    id: "q4",
    title: "Which environment do you prefer working in?",
    subtitle: "Choose one option",
    multi: false,
    options: [
      { trait: "solving_problems", label: "Structured & Analytical", icon: "bar-chart" },
      { trait: "creativity_design", label: "Creative & Flexible", icon: "palette" },
      { trait: "helping_people", label: "People-focused", icon: "heart" },
      { trait: "leading_managing", label: "Fast-paced & Leadership-driven", icon: "flag" },
    ],
  },
  {
    id: "q5",
    title: "What motivates you the most?",
    subtitle: "Choose one option",
    multi: false,
    options: [
      { trait: "helping_people", label: "Helping people & making an impact", icon: "heart" },
      { trait: "working_numbers", label: "Solving complex problems", icon: "puzzle" },
      { trait: "creativity_design", label: "Creating something new", icon: "palette" },
      { trait: "leading_managing", label: "Leading & inspiring others", icon: "flag" },
    ],
  },
  {
    id: "q6",
    title: "Which skill do you enjoy using most?",
    subtitle: "Choose one option",
    multi: false,
    options: [
      { trait: "exploring_technology", label: "Working with Technology", icon: "cpu" },
      { trait: "writing_communicating", label: "Communication", icon: "edit" },
      { trait: "working_numbers", label: "Analytical Thinking", icon: "bar-chart" },
      { trait: "leading_managing", label: "Organizing & Leading", icon: "flag" },
    ],
  },
];

export function scoreCareers(selectedTraits) {
  // selectedTraits: array of trait keys the user picked (with duplicates counted as weight)
  const counts = {};
  for (const t of selectedTraits) counts[t] = (counts[t] || 0) + 1;
  const maxCount = Math.max(1, ...Object.values(counts));

  const userVector = {};
  for (const t of TRAITS) userVector[t] = (counts[t] || 0) / maxCount;

  const results = CAREERS.map((career) => {
    let dot = 0;
    let careerMag = 0;
    for (const t of TRAITS) {
      const cw = career.traits[t] || 0;
      dot += cw * userVector[t];
      careerMag += cw;
    }
    const match = careerMag > 0 ? Math.round((dot / careerMag) * 100) : 0;
    return { ...career, match: Math.max(5, Math.min(99, match)) };
  });

  results.sort((a, b) => b.match - a.match);
  return results;
}
