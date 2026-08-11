import { useEffect, useState } from "react";
import { AppLayout, TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

const CATEGORIES = ["All", "Engineering", "Medical", "Design", "Management"];

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (query) params.set("q", query);
    api(`/colleges?${params.toString()}`).then((d) => setColleges(d.colleges)).catch(() => {});
  }, [category, query]);

  return (
    <AppLayout>
      <TopBar title="Top Colleges" />
      <div className="px-5 pt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search colleges…"
          className="input"
          aria-label="Search colleges"
        />
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-sm px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                category === c ? "bg-brand text-white" : "bg-brand-soft text-brand"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-3 pb-8">
        {colleges.map((c) => (
          <div key={c.id} className="card flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-brand-soft grid place-items-center text-brand font-bold flex-shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-brand-dark text-sm">{c.name}</p>
              <p className="text-xs text-muted">{c.location}</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-brand-dark flex-shrink-0">
              <Icon.Star className="h-4 w-4 text-amber-400" />
              {c.rating}
            </span>
          </div>
        ))}
        {colleges.length === 0 && (
          <p className="text-center text-muted py-10">No colleges found.</p>
        )}
      </div>
    </AppLayout>
  );
}
