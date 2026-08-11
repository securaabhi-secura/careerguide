import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

export default function CareerDetailsPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/careers/${id}`).then((d) => setCareer(d.career)).catch(() => setError("Career not found"));
    api("/saved-careers")
      .then((d) => setSaved(d.careers.some((c) => c.id === id)))
      .catch(() => {});
  }, [id]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await api(`/saved-careers/${id}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await api("/saved-careers", { method: "POST", body: { careerId: id } });
        setSaved(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !career) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar title="Career" onBack={true} />
        <p className="text-center text-muted py-20">{error}</p>
      </div>
    );
  }
  if (!career) return null;

  return (
    <div className="min-h-screen bg-white pb-8">
      <TopBar
        title={career.title}
        onBack={true}
        right={
          <button onClick={toggleSave} aria-label={saved ? "Unsave career" : "Save career"} className="text-brand">
            {saved ? <Icon.HeartFilled className="h-6 w-6" /> : <Icon.Heart className="h-6 w-6" />}
          </button>
        }
      />

      <div className="px-5 pt-5">
        <div className="flex flex-wrap gap-2">
          {career.tags?.map((t) => (
            <span key={t} className="text-xs bg-brand-soft text-brand px-2.5 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
        <p className="text-muted text-sm mt-4 leading-relaxed">{career.tagline}</p>

        <h3 className="font-semibold text-brand-dark mt-6 mb-2">Top Skills</h3>
        <div className="flex flex-wrap gap-2">
          {career.topSkills?.map((s) => (
            <span key={s} className="text-xs border border-border px-2.5 py-1 rounded-full text-brand-dark">
              {s}
            </span>
          ))}
        </div>

        <div className="card mt-6">
          <p className="text-xs text-muted">Average Salary (Experience Based)</p>
          <p className="text-2xl font-bold text-brand-dark mt-1">{career.salaryRange}</p>
        </div>

        <h3 className="font-semibold text-brand-dark mt-6 mb-3">Roadmap</h3>
        <ol className="flex flex-col gap-4">
          {career.roadmap?.map((step, i) => (
            <li key={step.step} className="flex gap-3">
              <span className="h-7 w-7 rounded-full bg-brand text-white text-xs font-bold grid place-items-center flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-brand-dark text-sm">{step.step}</p>
                <p className="text-xs text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <button onClick={toggleSave} className="btn-primary w-full mt-8">
          {saved ? "Saved to Your List ✓" : "Save Career"}
        </button>
        <Link to="/colleges" className="btn-secondary w-full mt-3 block">
          Explore Related Colleges
        </Link>
      </div>
    </div>
  );
}
