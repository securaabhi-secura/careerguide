import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: Icon.Home },
  { to: "/explore", label: "Explore", icon: Icon.Explore },
  { to: "/saved", label: "Saved", icon: Icon.Saved },
  { to: "/chat", label: "AI Chat", icon: Icon.Chat },
  { to: "/profile", label: "Profile", icon: Icon.Profile },
];

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-white md:px-4 md:py-6 md:gap-1">
        <div className="flex items-center gap-2 px-2 pb-6">
          <div className="h-9 w-9 rounded-xl bg-brand grid place-items-center text-white font-bold">CG</div>
          <span className="font-semibold text-lg">CareerGuide</span>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </aside>

      <div className="flex-1 flex justify-center">
        <div className="w-full sm:max-w-[480px] md:max-w-[640px] bg-white min-h-screen pb-20 md:pb-8 md:my-0 md:shadow-none relative">
          {children}
          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] bg-white border-t border-border grid grid-cols-5 py-2 z-20">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] font-medium ${
              isActive ? "text-brand" : "text-muted"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label === "AI Chat" ? "Chat" : item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function TopBar({ title, onBack, right }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white/90 backdrop-blur z-10 border-b border-border">
      <div className="flex items-center gap-3">
        {onBack !== undefined && (
          <button
            onClick={() => (onBack === true ? navigate(-1) : onBack())}
            aria-label="Go back"
            className="text-brand-dark"
          >
            <Icon.Back className="h-5 w-5" />
          </button>
        )}
        <h1 className="font-semibold text-lg text-brand-dark">{title}</h1>
      </div>
      {right}
    </div>
  );
}
