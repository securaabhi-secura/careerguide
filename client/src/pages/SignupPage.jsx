import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field } from "./LoginPage";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const passwordOk = form.password.length >= 8 && /[A-Za-z]/.test(form.password) && /[0-9]/.test(form.password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the Terms & Conditions to continue");
      return;
    }
    if (!passwordOk) {
      setError("Password must be at least 8 characters with a letter and a number");
      return;
    }
    setSubmitting(true);
    try {
      await register(form.fullName.trim(), form.email.trim(), form.password, form.phone.trim());
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold text-brand-dark mt-6">Create Your Account</h1>
      <p className="text-muted text-sm mt-1">Sign up to get started</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Field label="Full Name">
          <input required value={form.fullName} onChange={update("fullName")} className="input" placeholder="Ananya Sharma" />
        </Field>
        <Field label="Email">
          <input type="email" required value={form.email} onChange={update("email")} className="input" placeholder="you@example.com" />
        </Field>
        <Field label="Phone Number (optional)">
          <input value={form.phone} onChange={update("phone")} className="input" placeholder="+91 98765 43210" />
        </Field>
        <Field label="Password">
          <input type="password" required value={form.password} onChange={update("password")} className="input" placeholder="At least 8 characters" />
        </Field>
        <p className={`text-xs -mt-2 ${form.password && !passwordOk ? "text-amber-600" : "text-muted"}`}>
          Use 8+ characters with at least one letter and one number.
        </p>

        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
          I agree to the <span className="text-brand">Terms &amp; Conditions</span>
        </label>

        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-brand text-white font-semibold py-3.5 rounded-xl2 mt-2 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
