import { Search, ChevronRight, ShieldCheck, BadgeCheck, Headset, LayoutGrid, Church, Building2, Trees, Navigation, Calendar, Wallet, FileCheck2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo } from "react";

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
  const topHalls = cityHalls.length > 0 ? cityHalls : HALLS.slice().sort((a, b) => b.rating - a.rating);

  const categories = [
    { id: "all", Icon: LayoutGrid, label: "All Halls" },
    { id: "wedding_hall", Icon: Church, label: "Wedding" },
    { id: "banquet", Icon: Building2, label: "Banquet" },
    { id: "lawn", Icon: Trees, label: "Lawns" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Search bar — Flipkart/Zomato style */}
      <section className="px-4 md:px-6 pt-3 md:pt-6 pb-4 bg-background">
        <button
          onClick={() => navigate("/search")}
          className="w-full h-[48px] bg-card rounded-xl flex items-center gap-3 px-4 border border-border shadow-soft active:scale-[0.99] transition-transform"
        >
          <Search className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={2} />
          <span className="text-[14px] text-muted-foreground flex-1 text-left">
            Search halls, banquets, lawns in {city}
          </span>
        </button>
      </section>

      {/* Hero promo banner */}
      <section className="px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-navy p-5 md:p-8">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30">
              <Sparkles className="w-3 h-3 text-gold" strokeWidth={2.4} />
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Wedding Season</span>
            </div>
            <h1 className="font-heading text-[26px] md:text-[42px] leading-[1.15] font-semibold text-primary-foreground mt-3">
              Book wedding halls<br/>with just <span className="text-gold">5% advance</span>
            </h1>
            <p className="text-[13px] text-primary-foreground/80 mt-2 max-w-[280px] leading-relaxed">
              Verified venues. Instant booking. 100% refund if not confirmed.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-4 h-10 px-5 bg-gold text-gold-foreground text-[13px] font-bold rounded-lg active:scale-95 transition-transform inline-flex items-center gap-1.5"
            >
              Explore Halls <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories — Flipkart-style icon row */}
      <section className="px-4 md:px-6 pt-6">
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="flex flex-col items-center gap-2 py-3 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center">
                <cat.Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-4 md:px-6 pt-6">
        <div className="grid grid-cols-3 gap-2 bg-card border border-border rounded-xl p-3">
          {[
            { Icon: BadgeCheck, label: "Verified\nVenues" },
            { Icon: ShieldCheck, label: "Secure\nPayments" },
            { Icon: Headset, label: "24/7\nSupport" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1.5">
              <t.Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
              <span className="text-[10.5px] font-semibold text-foreground leading-tight whitespace-pre-line">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Halls near you */}
      {nearHalls.length > 0 && (
        <section className="pt-7">
          <div className="px-4 md:px-6 flex items-end justify-between mb-3">
            <div>
              <h2 className="font-heading text-[19px] font-semibold text-foreground leading-tight flex items-center gap-2">
                <Navigation className="w-[15px] h-[15px] text-primary" strokeWidth={2.4} />
                Halls near you
              </h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {nearestEnabled ? "Sorted by distance" : `Closest in ${city}`}
              </p>
            </div>
            <button onClick={() => navigate("/search")} className="text-[12px] font-semibold text-primary flex items-center gap-0.5">
              See all <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
            {nearHalls.slice(0, 6).map((h) => (
              <HallCard key={h.id} hall={h} variant="scroll" />
            ))}
          </div>
        </section>
      )}

      {/* Top rated halls */}
      <section className="pt-7">
          <div className="px-4 md:px-6 flex items-end justify-between mb-3">
          <div>
            <h2 className="font-heading text-[19px] font-semibold text-foreground leading-tight">Top rated in {city}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Highest customer ratings</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] font-semibold text-primary flex items-center gap-0.5">
            See all <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => (
            <HallCard key={h.id} hall={h} variant="scroll" />
          ))}
        </div>
      </section>

      {/* How it works — clean numbered list */}
      <section className="px-4 md:px-6 pt-8 pb-2">
        <h2 className="font-heading text-[19px] font-semibold text-foreground mb-4">How it works</h2>
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {[
            { Icon: Calendar, title: "Pick date & slot", desc: "Choose morning or evening slot for your event." },
            { Icon: Wallet, title: "Pay 5% advance", desc: "Block the date instantly. Rest paid at venue." },
            { Icon: FileCheck2, title: "Get confirmation", desc: "Owner confirms within 2 hours with receipt." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex items-start gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[14px] text-foreground">{title}</h4>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
              </div>
              <span className="text-[11px] font-bold text-muted-foreground/50 tabular-nums">0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer help */}
      <section className="px-4 md:px-6 pt-6 pb-4">
        <a
          href="tel:+919999988888"
          className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3.5 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center">
              <Headset className="w-[18px] h-[18px] text-success" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">Need help with booking?</div>
              <div className="text-[11.5px] text-muted-foreground mt-0.5">Mon–Sun, 9 AM – 9 PM · +91 99999 88888</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </a>
        <p className="text-[10.5px] text-muted-foreground/80 text-center mt-4 leading-relaxed">
          BookMyHall · Made in India 🇮🇳<br/>
          {user ? `Logged in as ${user.name?.split(" ")[0]}` : "India's trusted hall booking platform"}
        </p>
      </section>
    </div>
  );
};

export default HomePage;