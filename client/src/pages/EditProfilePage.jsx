import { useState } from "react";
import { TopBar } from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [classLevel, setClassLevel] = useState(user?.classLevel || "");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const data = await api("/profile", { method: "PATCH", body: { fullName, classLevel } });
      setUser(data.user);
      setMsg("Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    try {
      await api("/profile/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      setPwMsg("Password changed. Please log in again on other devices.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <TopBar title="Personal Information" onBack={true} />

      <form onSubmit={saveProfile} className="px-5 pt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-dark">Full Name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-dark">Class / Level</span>
          <input value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="input" placeholder="e.g. Class 12 Student" />
        </label>
        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>

      <form onSubmit={changePassword} className="px-5 pt-8 flex flex-col gap-4">
        <h2 className="font-semibold text-brand-dark">Change Password</h2>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="input"
        />
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (8+ chars, letter + number)"
          className="input"
        />
        {pwMsg && <p className="text-green-600 text-sm">{pwMsg}</p>}
        {pwError && <p className="text-red-600 text-sm">{pwError}</p>}
        <button type="submit" className="btn-secondary">Update Password</button>
      </form>
    </div>
  );
}
