import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout, TopBar } from "../components/AppLayout";
import { api } from "../lib/api";

export default function ExplorePage() {
  const [careers, setCareers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api("/careers").then((d) => setCareers(d.careers)).catch(() => {});
  }, []);

  const filtered = careers.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppLayout>
      <TopBar title="Explore" />
      <div className="px-5 pt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search careers…"
          className="input"
          aria-label="Search careers"
        />
      </div>

      <div className="px-5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
        {filtered.map((c) => (
          <Link key={c.id} to={`/careers/${c.id}`} className="card">
            <p className="font-semibold text-brand-dark">{c.title}</p>
            <p className="text-xs text-muted mt-1 line-clamp-2">{c.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {c.tags.map((t) => (
                <span key={t} className="text-[11px] bg-brand-soft text-brand px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted text-sm col-span-full text-center py-10">
            No careers match "{query}".
          </p>
        )}
      </div>
    </AppLayout>
  );
}
