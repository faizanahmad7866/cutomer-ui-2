import { Bell, MapPin, ChevronDown, Navigation, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { useState } from "react";
import { CITIES } from "@/data/halls";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, city, setCity, setNearestEnabled, notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [openCity, setOpenCity] = useState(false);
  const [locating, setLocating] = useState(false);

  // Approximate lat/lng for supported Maharashtra cities — used for nearest match
  const CITY_COORDS: Record<string, [number, number]> = {
    Mumbai: [19.076, 72.8777], Pune: [18.5204, 73.8567], Nagpur: [21.1458, 79.0882],
    Nashik: [19.9975, 73.7898], Amravati: [20.9374, 77.7796], Akola: [20.7096, 77.0021],
    Wardha: [20.7453, 78.6022], Chandrapur: [19.9615, 79.2961],
  };

  const detectCity = () => {
    if (!navigator.geolocation) return toast.error("Location not supported on this device");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let best = CITIES[0]; let min = Infinity;
        Object.entries(CITY_COORDS).forEach(([c, [la, ln]]) => {
          const d = Math.hypot(la - latitude, ln - longitude);
          if (d < min) { min = d; best = c; }
        });
        setCity(best);
        setNearestEnabled(true);
        setLocating(false);
        setOpenCity(false);
        toast.success(`Showing halls near ${best}`);
      },
      () => { setLocating(false); toast.error("Unable to get your location"); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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
            <button
              onClick={detectCity}
              disabled={locating}
              className="mt-4 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {locating ? "Finding your location..." : "Use my current location"}
            </button>
            <div className="grid grid-cols-2 gap-2 mt-4 pb-6">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setNearestEnabled(false); setOpenCity(false); }}
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