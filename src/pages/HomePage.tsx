import { Search, ChevronRight, ShieldCheck, BadgeCheck, Headset, LayoutGrid, Church, Building2, Trees, Navigation, Calendar as CalendarIcon, IndianRupee, Sun, Moon, Star, Quote, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const navigate = useNavigate();
  const { city, user } = useApp();
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<"morning" | "night" | null>(null);

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

  const categories = [
    { id: "all", Icon: LayoutGrid, label: "All Venues" },
    { id: "wedding_hall", Icon: Church, label: "Wedding Halls" },
    { id: "banquet", Icon: Building2, label: "Banquet" },
    { id: "lawn", Icon: Trees, label: "Lawns" },
  ];

  const search = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (slot) params.set("slot", slot);
    navigate(`/search${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="animate-fade-up">
      {/* HERO — booking panel on tinted surface */}
      <section className="surface-tint border-b border-border">
        <div className="px-4 md:px-6 pt-6 md:pt-12 pb-6 md:pb-12 max-w-5xl mx-auto">
          <div className="md:text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-[11px] font-semibold text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Trusted by 12,400+ couples across Maharashtra
            </div>
            <h1 className="font-heading text-[26px] md:text-[40px] leading-[1.1] font-bold text-foreground mt-3 tracking-tight">
              Book the perfect venue<br className="hidden md:block" />
              <span className="text-primary"> with just 5% advance.</span>
            </h1>
            <p className="text-[13.5px] md:text-[15px] text-muted-foreground mt-2 md:mt-3 max-w-xl md:mx-auto leading-relaxed">
              Verified halls, transparent pricing, instant confirmation. 100% refund if the owner cannot host you.
            </p>
          </div>

          {/* Search panel */}
          <div className="mt-5 md:mt-7 bg-card border border-border rounded-xl shadow-card p-2 md:p-3">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1.2fr_auto] gap-2">
              <button
                onClick={() => navigate("/search")}
                className="h-12 md:h-14 flex items-center gap-3 px-3.5 rounded-md hover:bg-muted/60 text-left transition-colors border border-transparent md:border-r md:border-border md:rounded-none md:rounded-l-md"
              >
                <Search className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={2.2} />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">City / Hall</div>
                  <div className="text-[13.5px] font-semibold text-foreground truncate mt-0.5">{city}</div>
                </div>
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-12 md:h-14 flex items-center gap-3 px-3.5 rounded-md hover:bg-muted/60 text-left transition-colors border border-transparent md:border-r md:border-border md:rounded-none">
                    <CalendarIcon className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={2.2} />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Event Date</div>
                      <div className="text-[13.5px] font-semibold text-foreground truncate mt-0.5">
                        {date ? format(date, "EEE, dd MMM yyyy") : "Select date"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    onSelect={(d) => setDate(d ?? null)}
                    disabled={(d) => d < new Date(Date.now() - 86400000)}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>

              <div className="h-12 md:h-14 flex items-stretch gap-1 px-1.5 md:px-2 rounded-md md:rounded-none md:border-r md:border-border">
                {([
                  { id: "morning" as const, Icon: Sun, label: "Morning" },
                  { id: "night" as const,   Icon: Moon, label: "Night" },
                ]).map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setSlot(slot === id ? null : id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 rounded-md text-[12.5px] font-semibold transition-all",
                      slot === id ? "bg-primary-light text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.2} />
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={search}
                className="h-12 md:h-14 px-6 bg-gold text-gold-foreground rounded-md font-bold text-[14px] shadow-gold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                Search
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* USP strip */}
          <div className="mt-5 md:mt-7 grid grid-cols-3 gap-2 md:gap-4">
            {[
              { Icon: BadgeCheck,  t: "Verified venues",      s: "Inspected & rated" },
              { Icon: ShieldCheck, t: "Secure payments",      s: "100% refund if cancelled by owner" },
              { Icon: Headset,     t: "Dedicated support",    s: "9 AM – 9 PM, all days" },
            ].map((u) => (
              <div key={u.t} className="flex items-start gap-2 md:gap-3 bg-card border border-border rounded-md p-2.5 md:p-4">
                <u.Icon className="w-[18px] h-[18px] md:w-5 md:h-5 text-success shrink-0 mt-0.5" strokeWidth={2.2} />
                <div className="min-w-0">
                  <div className="text-[12px] md:text-[13.5px] font-semibold text-foreground leading-tight">{u.t}</div>
                  <div className="text-[10.5px] md:text-[12px] text-muted-foreground mt-0.5 leading-tight">{u.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-6 pt-6 md:pt-10 max-w-6xl mx-auto w-full">
        <h2 className="text-[16px] md:text-[18px] font-bold text-foreground mb-3">Browse by venue type</h2>
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="flex flex-col items-center justify-center gap-2 py-4 md:py-5 bg-card border border-border rounded-md hover:border-primary/40 hover:shadow-soft active:scale-[0.98] transition-all"
            >
              <cat.Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={1.8} />
              <span className="text-[11.5px] md:text-[13px] font-semibold text-foreground text-center leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Halls near you */}
      {nearHalls.length > 0 && (
        <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
          <div className="px-4 md:px-6 flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[16px] md:text-[20px] font-bold text-foreground leading-tight flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-primary" strokeWidth={2.2} />
                Halls near you
              </h2>
              <p className="text-[11.5px] md:text-[13px] text-muted-foreground mt-0.5">Closest verified venues in {city}</p>
            </div>
            <button onClick={() => navigate("/search")} className="text-[12px] md:text-[13px] font-semibold text-primary flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
            {nearHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
          </div>
        </section>
      )}

      {/* Top rated */}
      <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-6 flex items-end justify-between mb-3">
          <div>
            <h2 className="text-[16px] md:text-[20px] font-bold text-foreground leading-tight flex items-center gap-1.5">
              <Star className="w-4 h-4 text-warning fill-warning" strokeWidth={2.2} />
              Top-rated in {city}
            </h2>
            <p className="text-[11.5px] md:text-[13px] text-muted-foreground mt-0.5">Highest customer ratings &amp; reviews</p>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] md:text-[13px] font-semibold text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* Budget */}
      <section className="pt-7 md:pt-10 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-6 flex items-end justify-between mb-3">
          <div>
            <h2 className="text-[16px] md:text-[20px] font-bold text-foreground leading-tight flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-success" strokeWidth={2.4} />
              Budget-friendly venues
            </h2>
            <p className="text-[11.5px] md:text-[13px] text-muted-foreground mt-0.5">Quality venues starting under ₹50,000 / slot</p>
          </div>
          <button onClick={() => navigate("/search?sort=price_low")} className="text-[12px] md:text-[13px] font-semibold text-primary flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
          {budgetHalls.map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-6 pt-10 md:pt-14 max-w-6xl mx-auto w-full">
        <h2 className="text-[16px] md:text-[22px] font-bold text-foreground">Booking made simple</h2>
        <p className="text-[12.5px] md:text-[14px] text-muted-foreground mt-1">Three steps from search to confirmed venue.</p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { n: "01", t: "Search & shortlist", d: "Compare halls by price, capacity, food and availability for your date." },
            { n: "02", t: "Pay 5% to lock",     d: "Secure UPI / card payment. Date is held for you the moment payment succeeds." },
            { n: "03", t: "Owner confirms",     d: "We notify the owner, they confirm within 2 hours. Pay the balance at venue." },
          ].map((s) => (
            <div key={s.n} className="bg-card border border-border rounded-lg p-4 md:p-5">
              <div className="text-[11px] font-bold text-primary tracking-widest">STEP {s.n}</div>
              <div className="font-semibold text-[15px] md:text-[16px] text-foreground mt-1">{s.t}</div>
              <p className="text-[12.5px] md:text-[13.5px] text-muted-foreground leading-relaxed mt-1.5">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / testimonial */}
      <section className="px-4 md:px-6 pt-10 md:pt-14 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { name: "Aarti & Saurabh", city: "Pune", rating: 5, text: "Booked Palm Garden in 10 minutes. Owner called within an hour to confirm. Smooth, transparent, no broker fees." },
            { name: "Mr. Joshi",       city: "Nagpur", rating: 5, text: "Helpful support team — they helped me reschedule a confirmed booking without any extra charge." },
            { name: "Priya M.",        city: "Mumbai", rating: 5, text: "The 5% advance system gave us confidence. Receipt was professional and accepted at the venue without questions." },
          ].map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-lg p-4 md:p-5">
              <Quote className="w-5 h-5 text-primary/30" strokeWidth={2.2} />
              <p className="text-[13px] md:text-[13.5px] text-foreground leading-relaxed mt-2">{t.text}</p>
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" strokeWidth={0} />
                ))}
              </div>
              <div className="text-[12px] font-semibold text-foreground mt-1">{t.name} <span className="text-muted-foreground font-normal">· {t.city}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Help footer */}
      <section className="px-4 md:px-6 pt-8 md:pt-12 pb-10 max-w-6xl mx-auto w-full">
        <a
          href="tel:+919999988888"
          className="flex items-center justify-between bg-primary-light/60 border border-primary/15 rounded-lg px-4 md:px-5 py-4 hover:bg-primary-light transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Headset className="w-[18px] h-[18px]" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[13.5px] md:text-[14.5px] font-semibold text-foreground">Need help with your booking?</div>
              <div className="text-[11.5px] md:text-[12.5px] text-muted-foreground mt-0.5">Mon–Sun · 9 AM – 9 PM · +91 99999 88888</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </a>
        <p className="text-[11px] text-muted-foreground/80 text-center mt-6">
          BookMyHall · Operated from Maharashtra, India · {user ? `Logged in as ${user.name?.split(" ")[0]}` : "Trusted hall booking platform"}
        </p>
      </section>
    </div>
  );
};

export default HomePage;
