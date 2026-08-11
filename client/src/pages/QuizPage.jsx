import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

const ICONS = {
  puzzle: Icon.Puzzle,
  palette: Icon.Palette,
  heart: Icon.Heart,
  "bar-chart": Icon.BarChart,
  flag: Icon.Flag,
  cpu: Icon.Cpu,
  calculator: Icon.BarChart,
  flask: Icon.Puzzle,
  book: Icon.Palette,
  code: Icon.Cpu,
  users: Icon.Heart,
  edit: Icon.Palette,
};

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/quiz/questions").then((d) => setQuestions(d.questions)).catch(() => {});
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar title="Career Quiz" onBack={true} />
        <p className="text-center text-muted py-20">Loading quiz…</p>
      </div>
    );
  }

  const q = questions[step];
  const selected = answers[q.id] || [];

  const toggle = (trait) => {
    setAnswers((prev) => {
      const current = prev[q.id] || [];
      if (q.multi) {
        const next = current.includes(trait)
          ? current.filter((t) => t !== trait)
          : [...current, trait];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: [trait] };
    });
  };

  const next = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const data = await api("/quiz/submit", { method: "POST", body: { answers } });
      navigate("/quiz/results", { state: { results: data.results } });
    } catch (err) {
      setError(err.message || "Could not submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar title="Career Quiz" onBack={true} />

      <div className="px-5 pt-3">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-brand-soft"}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted mt-2">
          Question {step + 1} of {questions.length}
        </p>
      </div>

      <div className="px-5 pt-5 flex-1">
        <h2 className="text-xl font-bold text-brand-dark">{q.title}</h2>
        <p className="text-muted text-sm mt-1">{q.subtitle}</p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {q.options.map((opt) => {
            const IconComp = ICONS[opt.icon] || Icon.Puzzle;
            const isSelected = selected.includes(opt.trait);
            return (
              <button
                key={opt.trait}
                onClick={() => toggle(opt.trait)}
                className={`flex flex-col gap-2 items-start p-4 rounded-2xl border-2 text-left transition-colors ${
                  isSelected ? "border-brand bg-brand-soft" : "border-border bg-white"
                }`}
              >
                <span className={`h-9 w-9 rounded-xl grid place-items-center ${isSelected ? "bg-brand text-white" : "bg-brand-soft text-brand"}`}>
                  <IconComp className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-brand-dark">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm px-5" role="alert">{error}</p>}

      <div className="px-5 py-5 sticky bottom-0 bg-white border-t border-border">
        <button
          onClick={next}
          disabled={selected.length === 0 || submitting}
          className="btn-primary w-full disabled:opacity-50"
        >
          {submitting ? "Submitting…" : step < questions.length - 1 ? "Next" : "See My Results"}
        </button>
      </div>
    </div>
  );
}
