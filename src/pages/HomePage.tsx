import { Search, ArrowRight, ShieldCheck, Wallet, CalendarCheck, Sparkles, LayoutGrid, Church, Building2, Trees } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo } from "react";

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
    { id: "all", Icon: LayoutGrid, label: "All Venues" },
    { id: "wedding_hall", Icon: Church, label: "Wedding Halls" },
    { id: "banquet", Icon: Building2, label: "Banquet Halls" },
    { id: "lawn", Icon: Trees, label: "Lawns & Gardens" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="px-5 pt-6 pb-8 bg-gradient-navy relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-light" strokeWidth={1.8} />
            <span className="text-[10px] font-semibold text-primary-foreground/90 uppercase tracking-[0.16em]">
              {user ? `Hello, ${user.name?.split(" ")[0]}` : "Welcome"}
            </span>
          </div>
          <h1 className="font-heading text-[34px] leading-[1.05] font-medium text-primary-foreground tracking-tight">
            The right venue<br />for every occasion.
          </h1>
          <p className="text-[13px] text-primary-foreground/70 mt-3 max-w-[280px]">
            Verified wedding halls, banquets and lawns across {city}.
          </p>

          <button
            onClick={() => navigate("/search")}
            className="mt-6 w-full h-[54px] bg-card rounded-xl flex items-center gap-3 px-4 shadow-elevated active:scale-[0.98] transition-transform"
          >
            <Search className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <span className="text-[14px] font-medium text-muted-foreground flex-1 text-left">
              Search venues in {city}
            </span>
            <ArrowRight className="w-4 h-4 text-foreground" strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 pt-5 -mt-2">
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
            <h2 className="font-heading text-[22px] font-medium text-foreground leading-tight">Top venues in {city}</h2>
            <p className="text-[12px] text-muted-foreground mt-1">Highest rated this month</p>
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
        <h2 className="font-heading text-[22px] font-medium text-foreground mt-1 mb-5">Three simple steps</h2>
        <div className="space-y-3">
          {[
            { Icon: Search, title: "Search & shortlist", desc: "Browse verified venues by date, slot and budget." },
            { Icon: Wallet, title: "Pay 5% to confirm", desc: "Lock your date with a small advance — pay the rest at the venue." },
            { Icon: CalendarCheck, title: "Get confirmation", desc: "The owner confirms your booking. You receive a digital receipt." },
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

      {/* Trust strip */}
      <section className="px-5 pt-6 pb-2">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="font-heading font-medium text-[15px] text-foreground">Secure payments, full refund</h4>
            <p className="text-[12px] text-muted-foreground mt-0.5">Refundable if the owner does not confirm.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;