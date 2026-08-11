import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SLIDES = [
  {
    title: "Discover Your",
    highlight: "Best Career",
    desc: "Take advanced quizzes and get AI-powered career recommendations.",
  },
  {
    title: "Plan Your",
    highlight: "Future",
    desc: "Explore career details, top colleges, courses, salary, and a step-by-step roadmap.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("cg_onboarded", "1");
    navigate("/login", { replace: true });
  };

  const slide = SLIDES[step];

  return (
    <div className="min-h-screen flex flex-col bg-white px-6 py-6">
      <div className="flex justify-end">
        <button onClick={finish} className="text-brand text-sm font-medium">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="h-56 w-56 rounded-full bg-brand-soft grid place-items-center">
          <svg viewBox="0 0 24 24" className="h-28 w-28 text-brand" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-brand-dark">
          {slide.title} <span className="text-brand">{slide.highlight}</span>
        </h2>
        <p className="text-muted text-sm max-w-xs">{slide.desc}</p>
      </div>

      <div className="flex items-center justify-between pb-4">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-brand" : "w-2 bg-brand-soft"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => (step < SLIDES.length - 1 ? setStep(step + 1) : finish())}
          className="bg-brand text-white font-semibold px-6 py-3 rounded-xl2"
        >
          {step < SLIDES.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
}
