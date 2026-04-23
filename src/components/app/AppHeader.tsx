import { Bell, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { useState } from "react";
import { CITIES } from "@/data/halls";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, city, setCity, notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [openCity, setOpenCity] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-md mx-auto h-[60px] px-4 flex items-center justify-between gap-3">
        <Sheet open={openCity} onOpenChange={setOpenCity}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1.5 max-w-[140px] active:scale-95 transition-transform">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none">City</div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[13px] font-semibold text-foreground truncate">{city}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[70vh]">
            <SheetHeader>
              <SheetTitle className="font-heading">Choose your city</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2 mt-4 pb-6">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setOpenCity(false); }}
                  className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${city === c ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 font-heading text-[20px] font-medium text-foreground tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          BookMyHall
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-light/60 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[20px] h-[20px] text-foreground" strokeWidth={2.2} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-xl bg-gradient-navy text-primary-foreground font-bold text-[14px] flex items-center justify-center overflow-hidden shadow-soft"
            >
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.[0]?.toUpperCase() || "U"
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="h-9 px-4 bg-primary text-primary-foreground text-[13px] font-semibold rounded-full shadow-soft active:scale-95 transition-transform"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};