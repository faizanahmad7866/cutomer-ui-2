import { Search, ChevronRight, Building2, Trees, Navigation, Calendar as CalendarIcon, IndianRupee, Sun, Star, Quote, ArrowRight, Sparkles, Heart, Phone, Award, Users as UsersIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import heroWedding from "@/assets/hero-wedding.jpg";
import cityMumbai from "@/assets/city-mumbai.jpg";
import cityPune from "@/assets/city-pune.jpg";
import cityNagpur from "@/assets/city-nagpur.jpg";
import cityNashik from "@/assets/city-nashik.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { city } = useApp();
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<"morning" | "night" | null>(null);
  const [guests, setGuests] = useState<string>("");

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
    { id: "wedding_hall", Icon: Heart,    label: "Wedding",    sub: "Mandap & rituals" },
    { id: "banquet",      Icon: Building2, label: "Reception", sub: "AC banquet halls" },
    { id: "lawn",         Icon: Trees,    label: "Engagement", sub: "Open lawns" },
    { id: "all",          Icon: Sparkles, label: "Sangeet",    sub: "DJ & dance floor" },
  ];

  const cityTiles = [
    { name: "Mumbai", img: cityMumbai, count: HALLS.filter(h=>h.city==="Mumbai").length },
    { name: "Pune",   img: cityPune,   count: HALLS.filter(h=>h.city==="Pune").length },
    { name: "Nagpur", img: cityNagpur, count: HALLS.filter(h=>h.city==="Nagpur").length },
    { name: "Nashik", img: cityNashik, count: HALLS.filter(h=>h.city==="Nashik").length },
  ];

  const search = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (slot) params.set("slot", slot);
    if (guests) params.set("guests", guests);
    navigate(`/search${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="animate-fade-up">
      {/* ============= HERO — full-bleed cinematic ============= */}
      <section className="relative -mt-px">
        <div className="relative h-[520px] md:h-[640px] w-full overflow-hidden">
          <img
            src={heroWedding}
            alt="Elegant wedding mandap with marigold flowers and chandeliers"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent" />

          <div className="relative z-10 h-full max-w-6xl mx-auto px-5 md:px-8 flex flex-col justify-center items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] md:text-[12px] font-semibold text-white">
              <Sparkles className="w-3 h-3 text-gold" strokeWidth={2.4} fill="currentColor" />
              India&apos;s Most Trusted Wedding Venue Platform
            </div>
            <h1 className="font-heading text-white mt-4 md:mt-5 text-[34px] sm:text-[44px] md:text-[64px] leading-[1.05] font-semibold tracking-tight max-w-3xl">
              Your Perfect <em className="italic text-gold not-italic md:italic font-medium">Wedding</em> Venue,
              <br className="hidden sm:block" />
              <span className="font-light italic">just a click away.</span>
            </h1>
            <p className="text-white/85 text-[14px] md:text-[16px] mt-3 md:mt-4 max-w-xl leading-relaxed">
              Discover &amp; book hand-picked banquet halls, lawns and resorts across Maharashtra — confirm with just 5% advance.
            </p>
          </div>

          {/* Floating search pill — overlapping bottom */}
          <div className="absolute left-0 right-0 -bottom-12 md:-bottom-10 z-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto bg-card rounded-2xl md:rounded-full shadow-elevated border border-border/60 p-2 md:p-2">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_1.2fr_1fr_auto] gap-1">
                {/* Location */}
                <button
                  onClick={() => navigate("/search")}
                  className="h-14 md:h-16 flex items-center gap-3 px-4 md:px-5 rounded-xl md:rounded-full hover:bg-muted text-left transition-colors min-w-0"
                >
                  <MapPin className="w-[18px] h-[18px] text-gold shrink-0" strokeWidth={2.2} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Location</div>
                    <div className="text-[14px] font-semibold text-foreground truncate mt-1">{city}</div>
                  </div>
                </button>

                <div className="hidden md:block w-px bg-border my-3" />

                {/* Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="h-14 md:h-16 flex items-center gap-3 px-4 md:px-5 rounded-xl md:rounded-full hover:bg-muted text-left transition-colors min-w-0">
                      <CalendarIcon className="w-[18px] h-[18px] text-gold shrink-0" strokeWidth={2.2} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Event Date</div>
                        <div className="text-[14px] font-semibold text-foreground truncate mt-1">
                          {date ? format(date, "EEE, dd MMM") : "Add dates"}
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

                <div className="hidden md:block w-px bg-border my-3" />

                {/* Slot */}
                <div className="h-14 md:h-16 flex items-center gap-2 px-3 md:px-4 rounded-xl md:rounded-full">
                  <Sun className="w-[18px] h-[18px] text-gold shrink-0" strokeWidth={2.2} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">Slot</div>
                    <div className="flex gap-1">
                      {([
                        { id: "morning" as const, label: "Morning" },
                        { id: "night" as const,   label: "Night" },
                      ]).map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setSlot(slot === id ? null : id)}
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all",
                            slot === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-border my-3" />

                {/* Guests */}
                <div className="h-14 md:h-16 flex items-center gap-3 px-4 md:px-5 rounded-xl md:rounded-full hover:bg-muted transition-colors min-w-0">
                  <UsersIcon className="w-[18px] h-[18px] text-gold shrink-0" strokeWidth={2.2} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Guests</div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="Add count"
                      className="w-full bg-transparent text-[14px] font-semibold text-foreground placeholder:text-muted-foreground/70 mt-0.5 outline-none"
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={search}
                  aria-label="Search venues"
                  className="h-14 md:h-16 md:w-16 px-6 md:px-0 bg-gold text-gold-foreground rounded-xl md:rounded-full font-bold text-[14px] shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" strokeWidth={2.6} />
                  <span className="md:hidden">Search Venues</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for floating pill */}
        <div className="h-16 md:h-14" />
      </section>

      {/* ============= TRUST STATS BAR ============= */}
      <section className="border-b border-border bg-accent/40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { n: "12,400+", l: "Happy Couples" },
            { n: "1,800+",  l: "Verified Venues" },
            { n: "8 Cities", l: "Across Maharashtra" },
            { n: "4.8 ★",   l: "Avg. Customer Rating" },
          ].map((s) => (
            <div key={s.l} className="text-center md:text-left">
              <div className="font-heading text-[22px] md:text-[28px] text-primary font-semibold leading-none">{s.n}</div>
              <div className="text-[11px] md:text-[12.5px] text-muted-foreground mt-1.5 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============= OCCASIONS / CATEGORIES ============= */}
      <section className="px-4 md:px-8 pt-10 md:pt-16 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-5 md:mb-7">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">Plan your day</div>
            <h2 className="font-heading text-[24px] md:text-[34px] font-semibold text-foreground mt-1 leading-tight">Find venues by occasion</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {occasions.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.id === "all" ? "/search" : `/search?category=${cat.id}`)}
              className="group relative overflow-hidden bg-card border border-border rounded-2xl p-5 md:p-6 text-left hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                <cat.Icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors" strokeWidth={1.8} />
              </div>
              <div className="font-heading font-semibold text-[16px] md:text-[18px] text-foreground">{cat.label}</div>
              <div className="text-[11.5px] md:text-[12.5px] text-muted-foreground mt-0.5">{cat.sub}</div>
              <ArrowRight className="absolute top-5 right-5 w-4 h-4 text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all" strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </section>

      {/* ============= TOP CITIES ============= */}
      <section className="px-4 md:px-8 pt-10 md:pt-16 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-5 md:mb-7">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">Top destinations</div>
            <h2 className="font-heading text-[24px] md:text-[34px] font-semibold text-foreground mt-1 leading-tight">Top venues by city</h2>
            <p className="text-[12.5px] md:text-[14px] text-muted-foreground mt-1">Start your happily-ever-after in the most breath-taking venues across Maharashtra.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {cityTiles.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/search?city=${c.name}`)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/5] shadow-card hover:shadow-elevated transition-all"
            >
              <img src={c.img} alt={`Venues in ${c.name}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="font-heading text-white font-semibold text-[20px] md:text-[24px] leading-tight">{c.name}</div>
                <div className="text-white/85 text-[11.5px] md:text-[12.5px] mt-0.5 font-medium">{c.count} venues</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Halls near you */}
      {nearHalls.length > 0 && (
        <section className="pt-10 md:pt-16 max-w-6xl mx-auto w-full">
          <div className="px-4 md:px-8 flex items-end justify-between mb-4 md:mb-6">
            <div>
              <div className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase flex items-center gap-1.5">
                <Navigation className="w-3 h-3" strokeWidth={2.6} /> Near you
              </div>
              <h2 className="font-heading text-[22px] md:text-[30px] font-semibold text-foreground mt-1 leading-tight">Venues close to you in {city}</h2>
            </div>
            <button onClick={() => navigate("/search")} className="text-[12px] md:text-[13.5px] font-bold text-primary hover:text-gold transition-colors flex items-center gap-0.5 shrink-0">
              View all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
            {nearHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
          </div>
        </section>
      )}

      {/* Top rated */}
      <section className="pt-10 md:pt-16 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-8 flex items-end justify-between mb-4 md:mb-6">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase flex items-center gap-1.5">
              <Award className="w-3 h-3" strokeWidth={2.6} /> Best of {city}
            </div>
            <h2 className="font-heading text-[22px] md:text-[30px] font-semibold text-foreground mt-1 leading-tight">Top-rated venues this season</h2>
          </div>
          <button onClick={() => navigate("/search")} className="text-[12px] md:text-[13.5px] font-bold text-primary hover:text-gold transition-colors flex items-center gap-0.5 shrink-0">
            View all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
          {topHalls.slice(0, 6).map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* Budget */}
      <section className="pt-10 md:pt-16 max-w-6xl mx-auto w-full">
        <div className="px-4 md:px-8 flex items-end justify-between mb-4 md:mb-6">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase flex items-center gap-1.5">
              <IndianRupee className="w-3 h-3" strokeWidth={2.8} /> Smart picks
            </div>
            <h2 className="font-heading text-[22px] md:text-[30px] font-semibold text-foreground mt-1 leading-tight">Beautiful venues, budget-friendly</h2>
            <p className="text-[12.5px] md:text-[14px] text-muted-foreground mt-1">Quality venues starting under ₹50,000 / slot.</p>
          </div>
          <button onClick={() => navigate("/search?sort=price_low")} className="text-[12px] md:text-[13.5px] font-bold text-primary hover:text-gold transition-colors flex items-center gap-0.5 shrink-0">
            View all <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible pb-2 px-4 md:px-8 scrollbar-none">
          {budgetHalls.map((h) => <HallCard key={h.id} hall={h} variant="scroll" />)}
        </div>
      </section>

      {/* ============= HOW IT WORKS — editorial split ============= */}
      <section className="mt-14 md:mt-20 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">How it works</div>
            <h2 className="font-heading text-[28px] md:text-[42px] font-semibold leading-tight mt-2">
              Booking made <em className="italic font-light">effortless</em>.
            </h2>
            <p className="text-primary-foreground/75 text-[14px] md:text-[15px] leading-relaxed mt-3 max-w-md">
              Three simple steps stand between you and your dream venue. Pay only 5% to lock — the rest at the venue.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 bg-gold text-gold-foreground rounded-full font-bold text-[14px] shadow-gold hover:brightness-110 active:scale-95 transition-all"
            >
              Start exploring <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { n: "01", t: "Discover & shortlist", d: "Compare halls by price, capacity, food and live availability for your date." },
              { n: "02", t: "Pay 5% to lock",       d: "Secure UPI / card payment. The date is held for you instantly." },
              { n: "03", t: "Owner confirms",       d: "Owner confirms within 2 hours. Pay the balance directly at the venue." },
            ].map((s) => (
              <div key={s.n} className="bg-white/8 border border-white/15 rounded-2xl p-5 md:p-6 backdrop-blur-sm flex gap-4 md:gap-5">
                <div className="font-heading text-[28px] md:text-[34px] font-light text-gold leading-none shrink-0">{s.n}</div>
                <div>
                  <div className="font-heading font-semibold text-[17px] md:text-[19px]">{s.t}</div>
                  <p className="text-primary-foreground/75 text-[13px] md:text-[13.5px] leading-relaxed mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / testimonial */}
      <section className="px-4 md:px-8 pt-14 md:pt-20 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Loved by couples</div>
          <h2 className="font-heading text-[26px] md:text-[36px] font-semibold text-foreground mt-2 leading-tight">Real stories. Real celebrations.</h2>
        </div>
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "Aarti & Saurabh", city: "Pune",   rating: 5, text: "Booked Palm Garden in 10 minutes. Owner called within an hour to confirm. Smooth, transparent — no broker fees." },
            { name: "Mr. Joshi",       city: "Nagpur", rating: 5, text: "The support team helped me reschedule a confirmed booking without any extra charge. Genuinely customer-first service." },
            { name: "Priya & Rohan",   city: "Mumbai", rating: 5, text: "The 5% advance gave us confidence. Receipt was professional and accepted at the venue without any questions." },
          ].map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-6 md:p-7 hover:shadow-card transition-shadow">
              <Quote className="w-7 h-7 text-gold/40" strokeWidth={1.6} fill="currentColor" />
              <p className="font-heading text-[15px] md:text-[16px] text-foreground leading-relaxed mt-3 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-1 mt-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" strokeWidth={0} />
                ))}
              </div>
              <div className="text-[13px] font-semibold text-foreground mt-2">{t.name} <span className="text-muted-foreground font-normal">· {t.city}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ============= CTA + FOOTER ============= */}
      <section className="px-4 md:px-8 pt-14 md:pt-20 pb-16 max-w-6xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-primary-foreground p-8 md:p-12">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Need help?</div>
              <h3 className="font-heading text-[24px] md:text-[32px] font-semibold mt-2 leading-tight">Talk to our wedding planner.</h3>
              <p className="text-primary-foreground/80 text-[13px] md:text-[14.5px] mt-2 max-w-md">Our team is available Mon–Sun, 9 AM – 9 PM to help you find the perfect venue for your big day.</p>
            </div>
            <a
              href="tel:+919999988888"
              className="inline-flex items-center justify-center gap-2 h-13 px-6 py-4 bg-white text-primary rounded-full font-bold text-[14px] hover:scale-[1.02] active:scale-95 transition-transform shadow-elevated whitespace-nowrap"
            >
              <Phone className="w-4 h-4" strokeWidth={2.4} /> +91 99999 88888
            </a>
          </div>
        </div>

        <footer className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-[12.5px]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-[14px]">B</div>
              <span className="font-heading font-semibold text-[16px] text-foreground">BookMyHall</span>
            </div>
            <p className="text-muted-foreground mt-3 leading-relaxed">India&apos;s trusted wedding venue booking platform. Verified halls, transparent pricing, secure payments.</p>
          </div>
          {[
            { h: "Company", l: ["About us", "Careers", "Contact", "Blog"] },
            { h: "For Couples", l: ["Browse venues", "How it works", "FAQs", "Cancellation"] },
            { h: "For Owners", l: ["List your venue", "Owner login", "Pricing plans", "Support"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="font-bold text-foreground text-[12.5px] uppercase tracking-wider">{col.h}</div>
              <ul className="mt-3 space-y-2">
                {col.l.map((i) => (
                  <li key={i}><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </footer>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
          <div>© 2026 BookMyHall Technologies Pvt. Ltd. · Made with ♥ in Maharashtra</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Refunds</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
