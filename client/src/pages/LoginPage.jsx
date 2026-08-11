import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold text-brand-dark mt-6">Welcome Back! 👋</h1>
      <p className="text-muted text-sm mt-1">Login to continue</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </Field>

        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-brand text-white font-semibold py-3.5 rounded-xl2 mt-2 disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        Don't have an account?{" "}
        <Link to="/signup" className="text-brand font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-brand-dark">{label}</span>
      {children}
    </label>
  );
}
