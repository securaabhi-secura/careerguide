import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { TopBar } from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function QuizResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState(location.state?.results || null);
  const [loading, setLoading] = useState(!location.state?.results);

  useEffect(() => {
    if (results) return;
    api("/quiz/latest")
      .then((d) => {
        if (d.results) setResults(d.results);
        else navigate("/quiz", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [results, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar title="Quiz Results" onBack={true} />
        <p className="text-center text-muted py-20">Loading your results…</p>
      </div>
    );
  }

  if (!results) return null;

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-white">
      <TopBar title="Quiz Results" onBack={true} />
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold text-brand-dark">Great, {firstName}! 🎉</h2>
        <p className="text-muted text-sm mt-1">
          Based on your answers, we found the best career matches for you.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {results.map((c, i) => (
            <Link
              key={c.id}
              to={`/careers/${c.id}`}
              className="card flex items-center gap-3"
            >
              <span className="h-8 w-8 rounded-full bg-brand-soft text-brand font-bold grid place-items-center text-sm flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-dark">{c.title}</p>
                <p className="text-xs text-muted line-clamp-1">{c.tagline}</p>
              </div>
              <span className="text-brand font-bold text-sm flex-shrink-0">{c.match}% Match</span>
            </Link>
          ))}
        </div>

        <Link to="/explore" className="btn-primary w-full block mt-6 mb-6">
          View All Careers
        </Link>
      </div>
    </div>
  );
}
