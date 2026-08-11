import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function HomePage() {
  const { user } = useAuth();
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    api("/careers").then((d) => setCareers(d.careers.slice(0, 3))).catch(() => {});
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <AppLayout>
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-brand-dark">Hi, {firstName}! 👋</p>
          <p className="text-muted text-sm">What do you want to explore today?</p>
        </div>
        <Link to="/profile" aria-label="Notifications" className="relative text-brand-dark">
          <Icon.Bell className="h-6 w-6" />
        </Link>
      </div>

      <div className="px-5">
        <Link
          to="/quiz"
          className="block rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white p-5"
        >
          <p className="font-semibold text-lg">Discover the best career for you</p>
          <p className="text-white/80 text-sm mt-1">Take a quiz and get AI recommendations</p>
          <span className="inline-block mt-3 bg-white text-brand text-sm font-semibold px-4 py-2 rounded-xl">
            Start Quiz →
          </span>
        </Link>
      </div>

      <Section title="Explore" to="/explore" className="mt-6">
        <div className="grid grid-cols-4 gap-3 px-5">
          {[
            { label: "Careers", icon: Icon.Explore, to: "/explore" },
            { label: "Colleges", icon: Icon.Saved, to: "/colleges" },
            { label: "Roadmaps", icon: Icon.Flag, to: "/quiz" },
            { label: "AI Counselor", icon: Icon.Bot, to: "/chat" },
          ].map((it) => (
            <Link key={it.label} to={it.to} className="flex flex-col items-center gap-1.5 text-center">
              <span className="h-14 w-14 rounded-2xl bg-brand-soft grid place-items-center text-brand">
                <it.icon className="h-6 w-6" />
              </span>
              <span className="text-xs text-muted">{it.label}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Recommended for You" to="/explore" className="mt-6 pb-6">
        <div className="flex gap-3 overflow-x-auto px-5 pb-1">
          {careers.map((c) => (
            <Link
              key={c.id}
              to={`/careers/${c.id}`}
              className="min-w-[150px] card flex-shrink-0"
            >
              <p className="font-semibold text-sm text-brand-dark">{c.title}</p>
              <p className="text-xs text-muted mt-1 line-clamp-2">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>
    </AppLayout>
  );
}

function Section({ title, to, children, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-semibold text-brand-dark">{title}</h2>
        <Link to={to} className="text-brand text-sm font-medium">
          View all
        </Link>
      </div>
      {children}
    </div>
  );
}
