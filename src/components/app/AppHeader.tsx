import { Bell, MapPin, ChevronDown, Navigation, Loader2, Search, CalendarCheck, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { useEffect, useState } from "react";
import { CITIES } from "@/data/halls";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777], Pune: [18.5204, 73.8567], Nagpur: [21.1458, 79.0882],
  Nashik: [19.9975, 73.7898], Amravati: [20.9374, 77.7796], Akola: [20.7096, 77.0021],
  Wardha: [20.7453, 78.6022], Chandrapur: [19.9615, 79.2961],
};

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, city, setCity, setNearestEnabled, notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [openCity, setOpenCity] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-40 bg-primary text-primary-foreground transition-shadow ${
        scrolled ? "shadow-elevated" : ""
      }`}
    >
      <div className="w-full max-w-6xl mx-auto h-[56px] md:h-[64px] px-4 md:px-6 flex items-center gap-2 md:gap-3">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 shrink-0" aria-label="HalloFindr home">
          <div className="w-8 h-8 rounded-md bg-gold text-gold-foreground flex items-center justify-center font-bold text-[14px]" aria-hidden>
            <span className="font-serif italic">H</span>
          </div>
          <span className="hidden sm:inline font-bold text-[16px] md:text-[17px] text-primary-foreground tracking-tight">
            HalloFindr
          </span>
        </button>

        {/* City selector */}
        <Sheet open={openCity} onOpenChange={setOpenCity}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1.5 h-9 px-2.5 rounded-md hover:bg-white/10 transition-colors min-w-0 ml-1" aria-label={`Change city, current: ${city}`}>
              <MapPin className="w-[15px] h-[15px] text-gold shrink-0" strokeWidth={2.4} />
              <span className="text-[13px] font-semibold text-primary-foreground truncate max-w-[100px]">{city}</span>
              <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/70 shrink-0" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
            <SheetHeader>
              <SheetTitle>Choose your city</SheetTitle>
            </SheetHeader>
            <button
              onClick={detectCity}
              disabled={locating}
              className="mt-4 w-full h-11 rounded-md bg-primary-light text-primary font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60 border border-primary/20"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" strokeWidth={2.2} />}
              {locating ? "Finding your location…" : "Use my current location"}
            </button>
            <div className="grid grid-cols-2 gap-2 mt-4 pb-6">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setNearestEnabled(false); setOpenCity(false); }}
                  className={`h-11 rounded-md border text-sm font-semibold transition-all ${
                    city === c ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop search bar — inline */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <button
            onClick={() => navigate("/search")}
            className="w-full h-10 px-4 flex items-center gap-3 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 transition-colors text-left"
          >
            <Search className="w-4 h-4 text-primary-foreground/70" strokeWidth={2.2} />
            <span className="text-[13.5px] text-primary-foreground/80 truncate">
              Search venues in <span className="font-semibold text-primary-foreground">{city}</span>
            </span>
          </button>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Primary">
          {[
            { label: "Bookings", path: "/bookings", Icon: CalendarCheck },
            { label: "Profile", path: "/profile", Icon: UserRound },
          ].map(({ label, path, Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="h-9 px-3 rounded-md text-[13px] font-semibold text-primary-foreground hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Mobile search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            aria-label="Search venues"
          >
            <Search className="w-[18px] h-[18px] text-primary-foreground" strokeWidth={2.2} />
          </button>

          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-primary-foreground" strokeWidth={2} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-gold text-gold-foreground text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-gold text-gold-foreground font-bold text-[13px] flex items-center justify-center overflow-hidden"
              aria-label="Profile"
            >
              {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : (user.name?.[0]?.toUpperCase() || "U")}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="h-9 px-4 bg-card text-primary text-[13px] font-bold rounded-md active:scale-[0.97] transition-transform"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-card md:hidden animate-fade-up">
          <div className="h-[56px] px-3 flex items-center gap-2 border-b border-border">
            <button
              onClick={() => setSearchOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-secondary"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 h-10 flex items-center gap-2 px-3 rounded-md bg-secondary border border-border">
              <Search className="w-4 h-4 text-muted-foreground" strokeWidth={2.2} />
              <input
                autoFocus
                placeholder={`Search halls, lawns in ${city}`}
                className="flex-1 bg-transparent outline-none text-[14px] font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchOpen(false);
                    navigate(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                  }
                }}
              />
            </div>
          </div>
          <div className="px-4 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Popular</p>
            <div className="flex flex-wrap gap-2">
              {["Wedding halls", "Banquets", "Lawns", "Under ₹50k", "1000+ guests", "Available this weekend"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setSearchOpen(false); navigate("/search"); }}
                  className="h-8 px-3 rounded-full bg-secondary border border-border text-[12.5px] font-semibold text-foreground"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
