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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-bottom md:hidden"
      aria-label="Primary"
    >
      <div className="h-[58px] px-1 flex items-stretch justify-around">
        {tabs.map(({ path, Icon, label }) => {
          const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 active:bg-secondary transition-colors"
            >
              <Icon
                className={active ? "w-[22px] h-[22px] text-primary" : "w-[22px] h-[22px] text-muted-foreground"}
                strokeWidth={active ? 2.2 : 1.8}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.16 : 0}
              />
              <span
                className={
                  "text-[10.5px] font-semibold tracking-tight " +
                  (active ? "text-primary" : "text-muted-foreground")
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};