import { TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { Link } from "react-router-dom";

const ITEMS = [
  { label: "Account Settings", to: "/profile/edit" },
  { label: "Privacy Policy", to: "#" },
  { label: "Terms & Conditions", to: "#" },
  { label: "Rate Us", to: "#" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white pb-8">
      <TopBar title="Settings" onBack={true} />
      <div className="px-5 pt-4 flex flex-col">
        {ITEMS.map((item) => (
          <Link key={item.label} to={item.to} className="flex items-center justify-between py-3.5 border-b border-border">
            <span className="text-sm text-brand-dark">{item.label}</span>
            <Icon.ChevronRight className="h-4 w-4 text-muted" />
          </Link>
        ))}
        <div className="flex items-center justify-between py-3.5">
          <span className="text-sm text-brand-dark">App Version</span>
          <span className="text-sm text-muted">1.0.0</span>
        </div>
      </div>
    </div>
  );
}
