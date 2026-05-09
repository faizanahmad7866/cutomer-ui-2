import { Search, ChevronRight, Building2, Trees, Navigation, Calendar as CalendarIcon, Heart, Sparkles, Star, ShieldCheck, Wallet, Headphones, MapPin, TrendingUp, Tag, Clock, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo } from "react";
import cityMumbai from "@/assets/city-mumbai.jpg";
import cityPune from "@/assets/city-pune.jpg";
import cityNagpur from "@/assets/city-nagpur.jpg";
import cityNashik from "@/assets/city-nashik.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { city } = useApp();

  const cityHalls = useMemo(
    () => HALLS.filter((h) => h.city === city).sort((a, b) => b.rating - a.rating),
    [city]
  );
  const nearHalls = useMemo(
    () => HALLS.filter((h) => h.city === city).slice().sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99)),
    [city]
  );
  const topHalls = cityHalls.length > 0 ? cityHalls : HALLS.slice().sort((a, b) => b.rating - a.rating);
  const budgetHalls = useMemo(
    () => HALLS.slice().sort((a, b) => Math.min(a.priceMorning, a.priceNight) - Math.min(b.priceMorning, b.priceNight)).slice(0, 6),
    []
  );

  const occasions = [
    { id: "wedding_hall", Icon: Heart,    label: "Wedding",    color: "bg-rose-50 text-rose-600" },
    { id: "banquet",      Icon: Building2, label: "Reception",  color: "bg-amber-50 text-amber-600" },
    { id: "lawn",         Icon: Trees,    label: "Engagement", color: "bg-emerald-50 text-emerald-600" },
    { id: "all",          Icon: Sparkles, label: "Sangeet",    color: "bg-violet-50 text-violet-600" },
    { id: "all",          Icon: Building2, label: "Corporate",  color: "bg-sky-50 text-sky-600" },
    { id: "all",          Icon: Sparkles, label: "Birthday",   color: "bg-pink-50 text-pink-600" },
    { id: "all",          Icon: Sparkles, label: "Haldi",      color: "bg-yellow-50 text-yellow-600" },
    { id: "all",          Icon: Building2, label: "Anniversary", color: "bg-indigo-50 text-indigo-600" },
  ];

  const cityTiles = [
    { name: "Mumbai", img: cityMumbai, count: HALLS.filter(h=>h.city==="Mumbai").length },
    { name: "Pune",   img: cityPune,   count: HALLS.filter(h=>h.city==="Pune").length },
    { name: "Nagpur", img: cityNagpur, count: HALLS.filter(h=>h.city==="Nagpur").length },
    { name: "Nashik", img: cityNashik, count: HALLS.filter(h=>h.city==="Nashik").length },
  ];

  return (
    <div className="bg-background">
      {/* ============= COMPACT HERO + SEARCH (Zomato style) ============= */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px, 48px 48px" }} />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-12 pb-20 md:pb-24">
          <div className="text-center md:text-left max-w-3xl md:mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-[10.5px] font-bold text-white tracking-wide mb-3">
              <Sparkles className="w-3 h-3" strokeWidth={2.6} fill="currentColor" />
              INDIA&apos;S #1 HALL BOOKING APP
            </div>
            <h1 className="text-white font-bold text-[26px] sm:text-[34px] md:text-[44px] leading-[1.1] tracking-tight">
              Book the perfect venue<br className="hidden sm:block" /> for your big day
            </h1>
            <p className="text-white/85 text-[13px] md:text-[15px] mt-2.5 font-medium">
              1,800+ verified halls · Confirmed in 60 seconds · 5% advance only
            </p>
          </div>

          {/* Search bar — sits inside hero, overlapping bottom */}
          <div className="mt-6 md:mt-8 max-w-3xl md:mx-auto">
            <button
              onClick={() => navigate("/search")}
              className="w-full bg-white rounded-xl shadow-elevated p-2 flex items-center gap-2 hover:shadow-2xl transition-shadow"
            >
              <div className="flex-1 flex items-center gap-3 px-3 py-2.5 min-w-0">
                <Search className="w-5 h-5 text-primary shrink-0" strokeWidth={2.6} />
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Search venues</div>
                  <div className="text-[14px] font-semibold text-foreground truncate mt-0.5">
                    Halls, lawns, banquets in <span className="text-primary">{city}</span>
                  </div>
                </div>
              </div>
              <span className="hidden md:inline-flex h-11 px-5 items-center bg-primary text-primary-foreground rounded-lg font-bold text-[13px]">Search</span>
            </button>

            {/* Quick filters */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { Icon: TrendingUp, label: "Top rated" },
                { Icon: Tag, label: "Under ₹50k" },
                { Icon: Navigation, label: "Near me" },
                { Icon: Clock, label: "Available today" },
                { Icon: BadgeCheck, label: "Verified only" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  onClick={() => navigate("/search")}
                  className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[12px] font-semibold transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= TRUST STRIP (Zomato/Flipkart style) ============= */}
      <section className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4 grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
          {[
            { Icon: ShieldCheck, t: "100% Verified", s: "Every venue inspected" },
            { Icon: Wallet, t: "Pay just 5%", s: "Rest at the venue" },
            { Icon: Headphones, t: "24×7 Support", s: "Real humans, fast" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-2.5 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <Icon className="w-[18px] h-[18px] md:w-5 md:h-5 text-primary" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="text-[12.5px] md:text-[14px] font-bold text-foreground leading-tight">{t}</div>
                <div className="text-[10.5px] md:text-[12px] text-muted-foreground leading-tight mt-0.5 truncate">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============= OCCASIONS — dense icon grid (Swiggy/Blinkit style) ============= */}
      <section className="px-4 md:px-8 pt-6 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight">What&apos;s the occasion?</h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {occasions.map((cat, i) => (
            <button
              key={i}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-soft`}>
                <cat.Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
              </div>
              <span className="text-[11.5px] md:text-[13px] font-semibold text-foreground text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ============= OFFER BANNER STRIP (Flipkart style) ============= */}
      <section className="px-4 md:px-8 pt-6 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { tag: "LIMITED OFFER", title: "Flat ₹5,000 OFF", sub: "On bookings above ₹1L · Code: BIGDAY", from: "from-rose-500", to: "to-pink-600" },
            { tag: "NEW",           title: "Zero cancellation fees", sub: "Cancel up to 7 days before event", from: "from-emerald-500", to: "to-teal-600" },
            { tag: "FEATURED",      title: "Premium 5★ venues", sub: "Hand-curated luxury banquets", from: "from-violet-500", to: "to-indigo-600" },
          ].map((o) => (
            <button
              key={o.title}
              onClick={() => navigate("/search")}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${o.from} ${o.to} p-4 md:p-5 text-left text-white active:scale-[0.99] transition-transform shadow-card`}
            >
              <div className="text-[9.5px] font-bold tracking-[0.14em] opacity-90">{o.tag}</div>
              <div className="text-[16px] md:text-[18px] font-bold mt-1">{o.title}</div>
              <div className="text-[12px] opacity-90 mt-0.5">{o.sub}</div>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-80" strokeWidth={2.4} />
            </button>
          ))}
        </div>
      </section>

      {/* Section: Near you */}
      {nearHalls.length > 0 && (
        <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
          <div className="px-4 md:px-8 flex items-end justify-between mb-3 md:mb-4">
            <div>
              <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight">Venues near you</h2>
              <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">In and around {city}</p>
            </div>
            <button onClick={() => navigate("/search")} className="text-[12.5px] font-bold text-primary hover:text-primary-dark flex items-center gap-0.5 shrink-0">
              See all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
            {nearHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
          </div>
        </section>
      )}

      {/* Top rated */}
      <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-8 flex items-end justify-between mb-3 md:mb-4">
          <div>
            <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight flex items-center gap-2">
              Top rated in {city}
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-success text-white rounded text-[10px] font-bold">
                <Star className="w-2.5 h-2.5 fill-white" strokeWidth={0} /> 4.5+
              </span>
            </h2>
            <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Based on real reviews from couples</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12.5px] font-bold text-primary hover:text-primary-dark flex items-center gap-0.5 shrink-0">
            See all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* TOP CITIES */}
      <section className="px-4 md:px-8 pt-7 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-3 md:mb-4">
          <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight">Explore by city</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cityTiles.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/search?city=${c.name}`)}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-card hover:shadow-elevated transition-all"
            >
              <img src={c.img} alt={`Venues in ${c.name}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="text-white font-bold text-[16px] md:text-[18px] leading-tight flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2.4} /> {c.name}
                </div>
                <div className="text-white/85 text-[11px] mt-0.5 font-semibold">{c.count} venues</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-8 flex items-end justify-between mb-3 md:mb-4">
          <div>
            <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight">Budget-friendly picks</h2>
            <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Beautiful venues under ₹50,000 / slot</p>
          </div>
          <button onClick={() => navigate("/search?sort=price_low")} className="text-[12.5px] font-bold text-primary hover:text-primary-dark flex items-center gap-0.5 shrink-0">
            See all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
          {budgetHalls.map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* HOW IT WORKS — compact 3-step bar */}
      <section className="mt-10 md:mt-14 bg-muted/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <h2 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight text-center">Book in 3 simple steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
            {[
              { n: "01", t: "Search & Compare", s: "Browse 1,800+ verified venues with real photos, prices and reviews." },
              { n: "02", t: "Pay 5% advance", s: "Lock your date instantly. Pay the rest at the venue." },
              { n: "03", t: "Celebrate", s: "Show up, enjoy your day. We handle the paperwork." },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-xl p-5 border border-border">
                <div className="text-[40px] font-bold text-primary/15 leading-none">{s.n}</div>
                <div className="text-[15px] md:text-[16px] font-bold text-foreground mt-2">{s.t}</div>
                <div className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Priya & Rohan", city: "Mumbai", text: "Booked Sahyadri Banquet for our reception. The team was super helpful and the hall was exactly as shown in photos." },
            { name: "Anjali Kulkarni", city: "Pune", text: "Saved almost ₹40,000 compared to direct booking. Verified reviews helped us pick the perfect lawn." },
            { name: "Mr. & Mrs. Shah", city: "Nashik", text: "5% advance was a game changer. Confirmed in minutes, no haggling, transparent pricing." },
          ].map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-0.5 text-primary mb-2">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={0} />)}
              </div>
              <p className="text-[13px] text-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-3 pt-3 border-t border-border text-[12px] font-bold text-foreground">{t.name}<span className="font-normal text-muted-foreground"> · {t.city}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">B</div>
              <span className="font-bold text-[16px]">BookMyHall</span>
            </div>
            <p className="text-[12px] text-white/60 mt-3 leading-relaxed">India&apos;s largest online platform for booking wedding halls, lawns and banquets.</p>
          </div>
          {[
            { h: "Company", l: ["About us", "Careers", "Press", "Contact"] },
            { h: "For couples", l: ["Browse venues", "How it works", "Pricing", "Reviews"] },
            { h: "For owners", l: ["List your venue", "Owner login", "Partner help", "Resources"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-[13px] font-bold mb-3">{c.h}</div>
              <ul className="space-y-2">
                {c.l.map((x) => <li key={x}><a className="text-[12.5px] text-white/70 hover:text-white transition-colors">{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11.5px] text-white/55">
            <div>© 2026 BookMyHall Technologies Pvt. Ltd. · All rights reserved.</div>
            <div className="flex gap-4">
              <a className="hover:text-white">Privacy</a>
              <a className="hover:text-white">Terms</a>
              <a className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;