import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const seenOnboarding = localStorage.getItem("cg_onboarded") === "1";
    const timer = setTimeout(() => {
      if (user) navigate("/home", { replace: true });
      else if (seenOnboarding) navigate("/login", { replace: true });
      else navigate("/onboarding", { replace: true });
    }, 900);
    return () => clearTimeout(timer);
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand to-brand-light flex flex-col items-center justify-center text-white gap-4">
      <div className="h-20 w-20 rounded-xl2 bg-white/15 grid place-items-center">
        <GraduationCap />
      </div>
      <h1 className="text-2xl font-semibold">CareerGuide</h1>
      <p className="text-white/80 text-sm">AI-Powered Career Guidance for Students</p>
      <div className="mt-10 h-1.5 w-40 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full w-2/3 bg-white animate-pulse rounded-full" />
      </div>
    </div>
  );
}

function GraduationCap() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="white">
      <path d="M12 3 1 8l11 5 9-4.1V17h2V8L12 3Z" />
      <path d="M5 11.2V16c0 1.9 3.1 4 7 4s7-2.1 7-4v-4.8l-7 3.2-7-3.2Z" />
    </svg>
  );
}
