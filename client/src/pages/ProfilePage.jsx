import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const items = [
    { label: "Personal Information", to: "/profile/edit" },
    { label: "Saved Careers", to: "/saved" },
    { label: "Settings", to: "/settings" },
    { label: "Help & Support", to: "/settings" },
  ];

  return (
    <AppLayout>
      <div className="bg-gradient-to-br from-brand to-brand-light px-5 pt-8 pb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/20 grid place-items-center text-2xl font-bold">
            {user?.fullName?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.fullName}</p>
            <p className="text-white/80 text-sm">{user?.classLevel || "Student"}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center justify-between py-3.5 border-b border-border"
          >
            <span className="text-sm text-brand-dark">{item.label}</span>
            <Icon.ChevronRight className="h-4 w-4 text-muted" />
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 py-4 text-red-600 text-sm font-medium"
        >
          <Icon.Logout className="h-4 w-4" />
          Logout
        </button>
      </div>
    </AppLayout>
  );
}
