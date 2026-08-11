import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout, TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

export default function SavedPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api("/saved-careers")
      .then((d) => setCareers(d.careers))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const unsave = async (id) => {
    setCareers((prev) => prev.filter((c) => c.id !== id));
    try {
      await api(`/saved-careers/${id}`, { method: "DELETE" });
    } catch {
      load();
    }
  };

  return (
    <AppLayout>
      <TopBar title="Saved Careers" />
      <div className="px-5 pt-4 flex flex-col gap-3 pb-8">
        {loading && <p className="text-muted text-center py-10">Loading…</p>}
        {!loading && careers.length === 0 && (
          <p className="text-muted text-center py-10">
            You haven't saved any careers yet. Explore careers and tap the heart to save them here.
          </p>
        )}
        {careers.map((c) => (
          <div key={c.id} className="card flex items-center gap-3">
            <Link to={`/careers/${c.id}`} className="flex-1 min-w-0">
              <p className="font-semibold text-brand-dark text-sm">{c.title}</p>
              <p className="text-xs text-muted line-clamp-1">{c.tagline}</p>
            </Link>
            <button onClick={() => unsave(c.id)} aria-label="Remove from saved" className="text-brand flex-shrink-0">
              <Icon.HeartFilled className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
