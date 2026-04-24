import { Search, ArrowRight, ShieldCheck, Wallet, CalendarCheck, LayoutGrid, Church, Building2, Trees, Phone, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo } from "react";
import heroImg from "@/assets/hall-3.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { city, user, nearestEnabled } = useApp();

  const cityHalls = useMemo(
    () => HALLS.filter((h) => h.city === city).sort((a, b) => b.rating - a.rating),
    [city]
  );
  const nearHalls = useMemo(
    () => HALLS.filter((h) => h.city === city).slice().sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99)),
    [city]
  );
  const allHalls = HALLS.slice().sort((a, b) => b.rating - a.rating);
  const topHalls = cityHalls.length > 0 ? cityHalls : allHalls;

  const categories = [
    { id: "all", Icon: LayoutGrid, label: "All Halls" },
    { id: "wedding_hall", Icon: Church, label: "Wedding Halls" },
    { id: "banquet", Icon: Building2, label: "Banquet Halls" },
    { id: "lawn", Icon: Trees, label: "Lawns" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Hero with image */}
      <section className="relative overflow-hidden md:rounded-3xl md:mt-6 md:mx-5">
        <div className="relative h-[360px] md:h-[440px]">
          <img src={heroImg} alt="Wedding hall" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/95" />
          <div className="relative h-full px-5 md:px-12 pt-6 md:pt-14 pb-7 md:pb-12 flex flex-col max-w-3xl">
            <div className="text-[10px] font-semibold text-gold-light uppercase tracking-[0.2em]">
              {user ? `Hello, ${user.name?.split(" ")[0]}` : "Welcome"}
            </div>
            <h1 className="font-heading text-[36px] md:text-[56px] leading-[1.05] font-medium text-primary-foreground tracking-tight mt-2">
              Find a hall.<br/>Book in minutes.
            </h1>
            <p className="text-[14px] md:text-[16px] text-primary-foreground/85 mt-3 md:mt-5 max-w-[480px] leading-relaxed">
              Check availability and pay just 5% to lock your date in {city}.
            </p>
            <div className="mt-auto md:max-w-[560px]">
              <button
                onClick={() => navigate("/search")}
                className="w-full h-[56px] md:h-[64px] bg-card rounded-2xl flex items-center gap-3 px-4 md:px-5 shadow-elevated active:scale-[0.98] transition-transform"
              >
                <Search className="w-5 h-5 text-primary" strokeWidth={2} />
                <span className="text-[14px] md:text-[15px] font-medium text-foreground flex-1 text-left">
                  Search halls in {city}
                </span>
                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-gold text-gold-foreground text-[11px] md:text-[12px] font-semibold rounded-md tracking-wider">SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 md:px-10 pt-5 md:pt-8">
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 md:mx-0 px-5 md:px-0 md:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="shrink-0 flex items-center gap-2 h-10 md:h-11 px-4 md:px-5 rounded-full bg-card border border-border text-[13px] md:text-[14px] font-medium text-foreground active:scale-95 hover:border-primary hover:bg-primary-light/40 transition-all"
            >
              <cat.Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Halls near you */}
      {nearHalls.length > 0 && (
        <section className="pt-7 md:pt-12">
          <div className="px-5 md:px-10 flex items-end justify-between mb-3 md:mb-5">
            <div>
              <h2 className="font-heading text-[22px] md:text-[28px] font-medium text-foreground leading-tight flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" strokeWidth={2} />
                Halls near you
              </h2>
              <p className="text-[12px] md:text-[13px] text-muted-foreground mt-1">
                {nearestEnabled ? "Sorted by distance from your location" : `Closest halls in ${city}`}
              </p>
            </div>
            <button onClick={() => navigate("/search")} className="text-[12px] font-semibold text-foreground flex items-center gap-1 underline-offset-4 hover:underline">
              See all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
          {/* Mobile: horizontal scroll. Desktop: grid */}
          <div className="flex md:hidden gap-3.5 overflow-x-auto pb-2 px-5 scrollbar-none">
            {nearHalls.slice(0, 6).map((h) => (
              <HallCard key={h.id} hall={h} variant="scroll" />
            ))}
          </div>
          <div className="hidden md:grid px-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {nearHalls.slice(0, 4).map((h) => (
              <HallCard key={h.id} hall={h} />
            ))}
          </div>
        </section>
      )}

      {/* Top halls */}
      <section className="pt-8 md:pt-14">
        <div className="px-5 md:px-10 flex items-end justify-between mb-3 md:mb-5">
          <div>
            <h2 className="font-heading text-[22px] md:text-[28px] font-medium text-foreground leading-tight">Top halls in {city}</h2>
            <p className="text-[12px] md:text-[13px] text-muted-foreground mt-1">Highest rated in your city</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] font-semibold text-foreground flex items-center gap-1 underline-offset-4 hover:underline">
            See all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex md:hidden gap-3.5 overflow-x-auto pb-2 px-5 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => (
            <HallCard key={h.id} hall={h} variant="scroll" />
          ))}
        </div>
        <div className="hidden md:grid px-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {topHalls.slice(0, 8).map((h) => (
            <HallCard key={h.id} hall={h} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 md:px-10 pt-10 md:pt-16 pb-2">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">How it works</div>
        <h2 className="font-heading text-[22px] md:text-[28px] font-medium text-foreground mt-1 mb-5">Book in 3 steps</h2>
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-5">
          {[
            { Icon: Search, title: "Find your hall", desc: "Pick a date, choose morning or night, and see all open halls in your city." },
            { Icon: Wallet, title: "Pay just 5%", desc: "Block your date with a small advance. Pay the rest at the hall." },
            { Icon: CalendarCheck, title: "Get the receipt", desc: "Owner confirms your booking. Download your receipt anytime." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 md:p-6 flex items-start gap-4 border border-border/60 md:flex-col md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-border flex items-center justify-center shrink-0 bg-primary-light/40">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="font-heading font-medium text-[16px] md:text-[18px] text-foreground">{title}</h4>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
              </div>
              <span className="font-heading text-[12px] text-muted-foreground/60 tabular-nums md:hidden">0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust + Support */}
      <section className="px-5 md:px-10 pt-6 md:pt-10 pb-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="font-heading font-medium text-[15px] text-foreground">Safe payments</h4>
            <p className="text-[12px] text-muted-foreground mt-0.5">Get full refund if the owner does not confirm.</p>
          </div>
        </div>
        <a href="tel:+919999988888" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform">
          <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-success" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-medium text-[15px] text-foreground">Need help?</h4>
            <p className="text-[12px] text-muted-foreground mt-0.5">Call us anytime at +91 99999 88888</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </a>
      </section>
    </div>
  );
};

export default HomePage;