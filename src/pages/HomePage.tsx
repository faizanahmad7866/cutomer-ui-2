import { Search, ArrowRight, ShieldCheck, Wallet, PartyPopper, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS, CATEGORY_LABELS } from "@/data/halls";
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
    { id: "all", emoji: "✨", label: "All Halls" },
    { id: "wedding_hall", emoji: "💒", label: "Wedding Hall" },
    { id: "banquet", emoji: "🏛️", label: "Banquet" },
    { id: "lawn", emoji: "🌿", label: "Lawn" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="px-5 pt-6 pb-8 bg-gradient-navy relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            <span className="text-[11px] font-semibold text-primary-foreground uppercase tracking-wider">
              {user ? `Hi ${user.name?.split(" ")[0]}` : "Welcome"}
            </span>
          </div>
          <h1 className="font-heading text-[28px] leading-[1.15] font-bold text-primary-foreground tracking-tight">
            Find the perfect hall<br />for your big day
          </h1>
          <p className="text-[13px] text-primary-foreground/70 mt-2">
            Wedding halls, banquets & lawns in {city}
          </p>

          <button
            onClick={() => navigate("/search")}
            className="mt-5 w-full h-[54px] bg-card rounded-2xl flex items-center gap-3 px-4 shadow-elevated active:scale-[0.98] transition-transform"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[14px] font-semibold text-muted-foreground flex-1 text-left">
              Search hall in {city}...
            </span>
            <ArrowRight className="w-5 h-5 text-gold" />
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
              className="shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-full bg-card border border-border shadow-soft text-[13px] font-semibold text-foreground active:scale-95 hover:border-primary transition-all"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Top halls */}
      <section className="pt-7">
        <div className="px-5 flex items-end justify-between mb-3">
          <div>
            <h2 className="font-heading text-[19px] font-bold text-foreground leading-tight">Top Halls in {city}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Highest rated this month</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] font-bold text-gold flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 px-5 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => (
            <HallCard key={h.id} hall={h} variant="scroll" />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pt-9 pb-2">
        <h2 className="font-heading text-[19px] font-bold text-foreground mb-4">Booking made simple</h2>
        <div className="space-y-3">
          {[
            { Icon: Search, title: "Search & Shortlist", desc: "Browse halls in your city by date, slot and budget." },
            { Icon: Wallet, title: "Pay only 5% Advance", desc: "Lock your date instantly with a small advance payment." },
            { Icon: PartyPopper, title: "Get Confirmed", desc: "Owner confirms your booking and you receive a digital pass." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 flex items-start gap-3.5 shadow-soft border border-border/50">
              <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading font-semibold text-[15px] text-foreground">{title}</h4>
                <p className="text-[13px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-5 pt-6">
        <div className="bg-gradient-to-br from-gold-light to-card border border-gold/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-[14px] text-foreground">100% Safe Payments</h4>
            <p className="text-[12px] text-muted-foreground">Refundable if owner doesn't confirm. Zero risk to you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;