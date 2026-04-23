import { Search, ArrowRight, ShieldCheck, Wallet, CalendarCheck, LayoutGrid, Church, Building2, Trees, Star, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo } from "react";
import heroImg from "@/assets/hall-3.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { city, user } = useApp();

  const cityHalls = useMemo(
    () => HALLS.filter((h) => h.city === city).sort((a, b) => b.rating - a.rating),
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
      <section className="relative overflow-hidden">
        <div className="relative h-[360px]">
          <img src={heroImg} alt="Wedding hall" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/95" />
          <div className="relative h-full px-5 pt-6 pb-7 flex flex-col">
            <div className="text-[10px] font-semibold text-gold-light uppercase tracking-[0.2em]">
              {user ? `Hello, ${user.name?.split(" ")[0]}` : "Welcome"}
            </div>
            <h1 className="font-heading text-[36px] leading-[1.05] font-medium text-primary-foreground tracking-tight mt-2">
              Book the perfect<br/>hall, the easy way.
            </h1>
            <p className="text-[14px] text-primary-foreground/85 mt-3 max-w-[320px] leading-relaxed">
              Find wedding halls, banquets and lawns in {city}. Pay only 5% to confirm your date.
            </p>
            <div className="mt-auto">
              <button
                onClick={() => navigate("/search")}
                className="w-full h-[56px] bg-card rounded-2xl flex items-center gap-3 px-4 shadow-elevated active:scale-[0.98] transition-transform"
              >
                <Search className="w-5 h-5 text-primary" strokeWidth={2} />
                <span className="text-[14px] font-medium text-foreground flex-1 text-left">
                  Search halls in {city}
                </span>
                <span className="px-3 py-1.5 bg-gold text-gold-foreground text-[11px] font-semibold rounded-md">SEARCH</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust stats strip */}
        <div className="bg-card border-y border-border">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { v: "500+", l: "Halls listed" },
              { v: "10", l: "Cities" },
              { v: "4.8★", l: "Avg rating" },
            ].map((s) => (
              <div key={s.l} className="py-3 text-center">
                <div className="font-heading text-[18px] font-medium text-foreground tabular-nums">{s.v}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-semibold mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 pt-5">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="shrink-0 flex items-center gap-2 h-10 px-4 rounded-full bg-card border border-border text-[13px] font-medium text-foreground active:scale-95 hover:border-primary transition-all"
            >
              <cat.Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Top halls */}
      <section className="pt-8">
        <div className="px-5 flex items-end justify-between mb-3">
          <div>
            <h2 className="font-heading text-[22px] font-medium text-foreground leading-tight">Top halls in {city}</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Most loved by customers</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] font-semibold text-foreground flex items-center gap-1 underline-offset-4 hover:underline">
            See all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 px-5 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => (
            <HallCard key={h.id} hall={h} variant="scroll" />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pt-10 pb-2">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">How it works</div>
        <h2 className="font-heading text-[22px] font-medium text-foreground mt-1 mb-5">Book in 3 steps</h2>
        <div className="space-y-3">
          {[
            { Icon: Search, title: "Find your hall", desc: "Pick a date, choose morning or night, and see all open halls in your city." },
            { Icon: Wallet, title: "Pay just 5%", desc: "Block your date with a small advance. Pay the rest at the hall." },
            { Icon: CalendarCheck, title: "Get the receipt", desc: "Owner confirms your booking. Download your receipt anytime." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 flex items-start gap-4 border border-border/60">
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="font-heading font-medium text-[16px] text-foreground">{title}</h4>
                <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
              </div>
              <span className="font-heading text-[12px] text-muted-foreground/60 tabular-nums">0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust + Support */}
      <section className="px-5 pt-6 pb-2 grid grid-cols-1 gap-3">
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