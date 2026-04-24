import { Home, Search, CalendarCheck, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", Icon: Home, label: "Home" },
  { path: "/search", Icon: Search, label: "Search" },
  { path: "/bookings", Icon: CalendarCheck, label: "Bookings" },
  { path: "/profile", Icon: User, label: "Profile" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-8px_24px_rgba(26,60,110,0.06)] safe-bottom">
      <div className="max-w-md mx-auto h-[64px] px-4 flex items-center justify-around">
        {tabs.map(({ path, Icon, label }) => {
          const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              {active && <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-gold" />}
              <Icon
                className={`w-[22px] h-[22px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={active ? 2.4 : 1.8}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.12 : 0}
              />
              <span className={`text-[11px] font-semibold transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};