import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronRight, MapPin, Calendar as CalendarIcon, Users, Sun, Moon, Star,
  ShieldCheck, Wallet, Headphones, BadgeCheck, Building2, Trees, Tent, Hotel,
  Castle, Landmark, Sprout, Warehouse, ArrowRight, Phone,
} from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useApp } from "@/store/appStore";
import { HALLS, CITIES } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import heroWedding from "@/assets/hero-wedding.jpg";

const OCCASIONS = [
  { Icon: Castle,    label: "Wedding Hall", q: "wedding_hall" },
  { Icon: Building2, label: "Banquet",      q: "banquet" },
  { Icon: Trees,     label: "Lawn",         q: "lawn" },
  { Icon: Hotel,     label: "Resort",       q: "" },
  { Icon: Warehouse, label: "Farmhouse",    q: "" },
  { Icon: Sprout,    label: "Marriage Garden", q: "" },
  { Icon: Landmark,  label: "Convention",   q: "banquet" },
  { Icon: Tent,      label: "Hotel",        q: "" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { city, setCity } = useApp();

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<"morning" | "night" | null>(null);
  const [guests, setGuests] = useState<number>(0);
  const [cityOpen, setCityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [slotOpen, setSlotOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const cityHalls = useMemo(
    () => HALLS.filter((h) => h.city === city),
    [city]
  );
  const fallback = cityHalls.length ? cityHalls : HALLS;

  const topRated = useMemo(
    () => [...fallback].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [fallback]
  );
  const underBudget = useMemo(
    () => [...HALLS]
      .filter((h) => Math.min(h.priceMorning, h.priceNight) <= 50000)
      .sort((a, b) => Math.min(a.priceMorning, a.priceNight) - Math.min(b.priceMorning, b.priceNight))
      .slice(0, 8),
    []
  );
  const bigFat = useMemo(
    () => [...HALLS].filter((h) => h.capacity >= 800).sort((a, b) => b.capacity - a.capacity).slice(0, 8),
    []
  );
  const newlyAdded = useMemo(() => [...HALLS].slice(-8).reverse(), []);

  const submitSearch = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (slot) params.set("slot", slot);
    if (guests > 0) params.set("guests", String(guests));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-background">
      {/* ============ HERO — Booking.com style: solid navy + heavy search card ============ */}
      <section className="relative bg-primary">
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-14 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[44px] leading-[1.05] font-semibold text-white tracking-tight">
              Find your perfect wedding venue
            </h1>
            <p className="mt-3 text-[14px] md:text-[16px] text-white/85 max-w-xl">
              Search verified halls, banquets & lawns across Maharashtra. Real photos. Real prices.{" "}
              <span className="font-semibold text-white">Pay just 5% to confirm.</span>
            </p>
          </div>
        </div>

        {/* Search card — floats over hero/section boundary */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 -mb-10 md:-mb-12">
          <div className="relative z-10 -mt-12 md:-mt-16">
            <div className="bg-card rounded-lg border-2 border-gold shadow-elevated overflow-hidden md:flex md:items-stretch md:divide-x md:divide-border">
              {/* Location */}
              <Sheet open={cityOpen} onOpenChange={setCityOpen}>
                <SheetTrigger asChild>
                  <button className="w-full md:flex-1 flex items-start gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors border-b border-border md:border-b-0">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.2} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Location</div>
                      <div className="text-[14px] font-semibold text-foreground truncate">{city}</div>
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                  <SheetHeader><SheetTitle>Choose your city</SheetTitle></SheetHeader>
                  <div className="grid grid-cols-2 gap-2 mt-4 pb-4">
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setCityOpen(false); }}
                        className={`h-11 rounded-md border text-sm font-semibold transition-all ${
                          city === c ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                        }`}
                      >{c}</button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Date */}
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full md:flex-1 flex items-start gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors border-b border-border md:border-b-0">
                    <CalendarIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.2} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Date</div>
                      <div className="text-[14px] font-semibold text-foreground truncate">
                        {date ? format(date, "dd MMM yyyy") : "Add date"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    onSelect={(d) => { setDate(d ?? null); setDateOpen(false); }}
                    disabled={(d) => d < new Date(Date.now() - 86400000)}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>

              {/* Slot */}
              <Popover open={slotOpen} onOpenChange={setSlotOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full md:flex-1 flex items-start gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors border-b border-border md:border-b-0">
                    {slot === "night" ? (
                      <Moon className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.2} />
                    ) : (
                      <Sun className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.2} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Slot</div>
                      <div className="text-[14px] font-semibold text-foreground truncate">
                        {slot === "morning" ? "Morning · 9 AM – 4 PM" : slot === "night" ? "Night · 6 PM – 12 AM" : "Any slot"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  {[
                    { id: "morning" as const, Icon: Sun,  label: "Morning", time: "9 AM – 4 PM" },
                    { id: "night"   as const, Icon: Moon, label: "Night",   time: "6 PM – 12 AM" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSlot(s.id); setSlotOpen(false); }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-md text-left hover:bg-secondary ${
                        slot === s.id ? "bg-primary-light" : ""
                      }`}
                    >
                      <s.Icon className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-[13px] font-semibold text-foreground">{s.label}</div>
                        <div className="text-[11px] text-muted-foreground">{s.time}</div>
                      </div>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Guests */}
              <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full md:flex-1 flex items-start gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors border-b border-border md:border-b-0">
                    <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.2} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">Guests</div>
                      <div className="text-[14px] font-semibold text-foreground truncate">
                        {guests > 0 ? `${guests}+ guests` : "Add guests"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="end">
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 250, 500, 1000, 1500, 2000].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setGuests(n); setGuestsOpen(false); }}
                        className={`h-10 rounded-md border text-[12.5px] font-semibold tabular-nums ${
                          guests === n ? "border-primary bg-primary-light text-primary" : "border-border text-foreground hover:border-primary/40"
                        }`}
                      >{n}+</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search button */}
              <button
                onClick={submitSearch}
                className="w-full md:w-auto md:px-8 h-14 md:h-auto bg-info hover:bg-info/90 text-info-foreground font-bold text-[15px] tracking-tight flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                aria-label="Search venues"
              >
                <Search className="w-4 h-4" strokeWidth={2.6} />
                Search
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Trust strip — sits below hero */}
      <section className="bg-card border-b border-border mt-16 md:mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-2 text-[12px] md:text-[13px] font-medium text-foreground">
          <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-success" /> 12,000+ bookings</span>
          <span className="hidden md:inline text-border">·</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success" /> Verified venues only</span>
          <span className="hidden md:inline text-border">·</span>
          <span className="inline-flex items-center gap-1.5"><Wallet className="w-4 h-4 text-gold-dark" /> Pay just 5% to confirm</span>
          <span className="hidden md:inline text-border">·</span>
          <span className="inline-flex items-center gap-1.5"><Headphones className="w-4 h-4 text-info" /> 24×7 support</span>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <div className="flex items-end justify-between mb-4 md:mb-5">
          <div>
            <h2 className="font-serif text-[22px] md:text-[28px] font-semibold text-foreground leading-tight">Browse by venue type</h2>
            <p className="text-[12.5px] md:text-[13.5px] text-muted-foreground mt-0.5">From intimate halls to grand convention centres</p>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {OCCASIONS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.q ? `/search?category=${cat.q}` : "/search")}
              className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <cat.Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.8} />
              </div>
              <span className="text-[11.5px] md:text-[12.5px] font-semibold text-foreground text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ============ TOP RATED ============ */}
      <Rail
        title={`Top rated in ${city}`}
        subtitle="Highest-reviewed venues this month"
        halls={topRated}
        onSeeAll={() => navigate("/search?sort=rating")}
      />

      {/* ============ OFFER BANNER ============ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <div className="rounded-xl bg-gold p-5 md:p-6 flex items-center gap-4 md:gap-6 shadow-soft">
          <div className="hidden md:flex w-14 h-14 rounded-full bg-gold-foreground/10 items-center justify-center shrink-0">
            <Wallet className="w-7 h-7 text-gold-foreground" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold-foreground/70">Limited offer</div>
            <h3 className="font-serif text-[18px] md:text-[24px] font-semibold text-gold-foreground leading-tight mt-0.5">
              Flat ₹5,000 off on bookings above ₹1,00,000
            </h3>
            <p className="text-[12px] md:text-[13.5px] text-gold-foreground/80 mt-1">
              Use code <span className="font-bold tracking-wide">BIGDAY</span> · Valid till 30 June
            </p>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="hidden sm:inline-flex h-10 px-4 bg-gold-foreground text-gold rounded-md font-bold text-[13px] items-center gap-1.5 hover:bg-gold-foreground/90 transition-colors"
          >
            Browse <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <Rail
        title="Under ₹50,000"
        subtitle="Beautiful venues that respect your budget"
        halls={underBudget}
        onSeeAll={() => navigate("/search?sort=price_low")}
      />

      <Rail
        title="Big fat weddings · 1000+ guests"
        subtitle="Grand venues for grander celebrations"
        halls={bigFat}
        onSeeAll={() => navigate("/search")}
      />

      <Rail
        title="Newly added"
        subtitle="Latest venues onboarded on HalloFindr"
        halls={newlyAdded}
        onSeeAll={() => navigate("/search")}
      />

      {/* ============ HOW IT WORKS ============ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">How it works</p>
          <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-foreground mt-2">Book your venue in 3 steps</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
          <div className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-px bg-border" aria-hidden />
          {[
            { Icon: Search,      n: "01", t: "Search & shortlist", s: "Filter by city, date, capacity and budget. Real photos, real prices." },
            { Icon: Wallet,      n: "02", t: "Pay just 5% advance", s: "Secure your date instantly with UPI, card or net banking." },
            { Icon: BadgeCheck,  n: "03", t: "Celebrate with peace", s: "Pay the rest at the venue. We handle the paperwork." },
          ].map((s) => (
            <div key={s.n} className="relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-primary shadow-soft relative z-10">
                <s.Icon className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground tabular-nums">{s.n}</div>
              <div className="font-semibold text-[16px] text-foreground mt-1">{s.t}</div>
              <p className="text-[13px] text-muted-foreground mt-1.5 max-w-xs leading-relaxed">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dark">Reviews</p>
            <h2 className="font-serif text-[22px] md:text-[28px] font-semibold text-foreground mt-1">Couples who trusted HalloFindr</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Priya & Rohan Sharma", city: "Mumbai", venue: "Sahyadri Banquet, Bandra W", text: "Booked our reception in 10 minutes. Pricing was exactly what was quoted on the app. The owner called within an hour to confirm." },
            { name: "Anjali Kulkarni",      city: "Pune",   venue: "Greenwood Lawns, Baner",   text: "Compared 8 venues on a single screen. Saved nearly ₹40,000 vs walking in. The 5% advance model is a lifesaver." },
            { name: "Mr. & Mrs. Shah",      city: "Nashik", venue: "Royal Heritage, College Rd", text: "Verified photos matched the actual hall. No hidden costs, no broker calls. Will recommend to family." },
          ].map((t) => (
            <article key={t.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-1 text-gold mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" strokeWidth={0} />)}
              </div>
              <p className="text-[14px] text-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-[14px] flex items-center justify-center">
                  {t.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-foreground truncate">{t.name}</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{t.venue} · {t.city}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="mt-14 md:mt-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-white text-primary flex items-center justify-center font-serif italic font-bold">H</div>
              <span className="font-bold text-[17px]">HalloFindr</span>
            </div>
            <p className="text-[12.5px] text-white/65 mt-3 leading-relaxed max-w-xs">
              Maharashtra's most trusted platform to discover and book wedding halls, banquets and lawns.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[12px] text-white/70">
              <Phone className="w-3.5 h-3.5" />
              <a href="tel:+919999988888" className="hover:text-white">+91 99999 88888</a>
            </div>
          </div>

          {[
            { h: "Company",     l: ["About us", "Careers", "Press", "Contact"] },
            { h: "For couples", l: ["Browse venues", "How it works", "Pricing", "Cancellation policy"] },
            { h: "For owners",  l: ["List your venue", "Owner login", "Partner support", "Pricing for owners"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/50 mb-3">{c.h}</div>
              <ul className="space-y-2.5">
                {c.l.map((x) => (
                  <li key={x}>
                    <a className="text-[13px] text-white/85 hover:text-white transition-colors cursor-pointer">{x}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* City links — SEO */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/50 mb-2">Wedding venues across Maharashtra</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {CITIES.map((c) => (
                <a key={c} className="text-[12.5px] text-white/75 hover:text-white cursor-pointer">Wedding halls in {c}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11.5px] text-white/55">
            <div>© 2026 HalloFindr Technologies Pvt. Ltd. · CIN: U72200MH2024PTC123456</div>
            <div className="flex gap-4">
              <a className="hover:text-white cursor-pointer">Privacy</a>
              <a className="hover:text-white cursor-pointer">Terms</a>
              <a className="hover:text-white cursor-pointer">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* -------- Reusable horizontal-scroll rail -------- */
function Rail({
  title, subtitle, halls, onSeeAll,
}: {
  title: string; subtitle?: string; halls: typeof HALLS; onSeeAll: () => void;
}) {
  if (halls.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto pt-8 md:pt-12">
      <div className="px-4 md:px-6 flex items-end justify-between mb-4">
        <div className="min-w-0">
          <h2 className="font-serif text-[20px] md:text-[26px] font-semibold text-foreground tracking-tight truncate">{title}</h2>
          {subtitle && <p className="text-[12.5px] md:text-[13.5px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onSeeAll} className="text-[12.5px] font-bold text-primary hover:text-primary-dark inline-flex items-center gap-0.5 shrink-0">
          See all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
        </button>
      </div>
      <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-6 scrollbar-none">
        {halls.slice(0, 8).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
      </div>
    </section>
  );
}

export default HomePage;