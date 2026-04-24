import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, Calendar as CalIcon, SlidersHorizontal, Sun, Moon } from "lucide-react";
import { format } from "date-fns";
import { useApp, getHallBookedSlots } from "@/store/appStore";
import { HALLS } from "@/data/halls";
import { HallCard } from "@/components/app/HallCard";
import { EmptyState } from "@/components/app/EmptyState";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SearchPage = () => {
  const navigate = useNavigate();
  const { city } = useApp();
  const [params] = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "night" | null>(null);
  const [category, setCategory] = useState<string | null>(params.get("category"));
  const [foodType, setFoodType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 500000]);
  const [guestRange, setGuestRange] = useState<[number]>([0]);
  const [sortBy, setSortBy] = useState("nearest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setCategory(params.get("category")); }, [params]);

  const results = useMemo(() => {
    let r = HALLS.filter((h) => h.city === city || city === "All");
    if (city && !r.length) r = HALLS;
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((h) => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q));
    }
    if (category) r = r.filter((h) => h.category === category);
    if (foodType) r = r.filter((h) => h.foodType === foodType || h.foodType === "both");
    r = r.filter((h) => {
      const min = Math.min(h.priceMorning, h.priceNight);
      return min >= priceRange[0] && min <= priceRange[1];
    });
    if (guestRange[0] > 0) r = r.filter((h) => h.capacity >= guestRange[0]);
    if (selectedDate) {
      const iso = format(selectedDate, "yyyy-MM-dd");
      r = r.filter((h) => {
        const booked = getHallBookedSlots(h.id, iso);
        if (selectedSlot) return !booked.includes(selectedSlot);
        return booked.length < 2;
      });
    }
    if (sortBy === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sortBy === "nearest") r.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    if (sortBy === "price_low") r.sort((a, b) => Math.min(a.priceMorning, a.priceNight) - Math.min(b.priceMorning, b.priceNight));
    if (sortBy === "price_high") r.sort((a, b) => Math.min(b.priceMorning, b.priceNight) - Math.min(a.priceMorning, a.priceNight));
    return r;
  }, [query, category, foodType, priceRange, guestRange, sortBy, selectedDate, selectedSlot, city]);

  const activeFilters = [category, foodType, guestRange[0] > 0 ? "guests" : null].filter(Boolean).length;

  return (
    <div className="animate-fade-up">
      {/* Sticky search */}
      <div className="sticky top-[60px] md:top-[68px] z-30 bg-background/95 backdrop-blur-xl border-b border-border/60 px-4 md:px-10 py-3 md:py-5 space-y-3">
        <div className="relative max-w-3xl mx-auto md:mx-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hall name or area..."
            className="w-full h-12 md:h-14 pl-10 md:pl-11 pr-28 md:pr-32 bg-card rounded-xl border border-border text-[14px] md:text-[15px] font-medium focus:border-primary transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-[100px] md:right-[112px] top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(true)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 md:h-11 px-3 md:px-4 rounded-lg bg-primary text-primary-foreground flex items-center gap-1.5 text-[12px] md:text-[13px] font-semibold active:scale-95 transition-transform shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.2} />
            Filters
            {activeFilters > 0 && <span className="w-4 h-4 bg-gold text-gold-foreground rounded-full text-[10px] font-bold flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 md:mx-0 px-4 md:px-0 pb-1 max-w-3xl md:mx-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className={cn("shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-full border text-[12px] font-bold transition-all",
                selectedDate ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border")}>
                <CalIcon className="w-3.5 h-3.5" />
                {selectedDate ? format(selectedDate, "dd MMM") : "Date"}
                {selectedDate && <X className="w-3 h-3" onClick={(e) => { e.stopPropagation(); setSelectedDate(null); setSelectedSlot(null); }} />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate ?? undefined} onSelect={(d) => setSelectedDate(d ?? null)} disabled={(d) => d < new Date(Date.now() - 86400000)} className="pointer-events-auto p-3" />
            </PopoverContent>
          </Popover>
          {([["morning", "Morning", Sun], ["night", "Night", Moon]] as const).map(([slot, label, Icon]) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
              className={cn("shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-full border text-[12px] font-bold transition-all",
                selectedSlot === slot ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border")}
            >
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
          {[["wedding_hall", "Wedding Hall"], ["banquet", "Banquet"], ["lawn", "Lawn"]].map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? null : cat)}
              className={cn("shrink-0 h-9 px-3.5 rounded-full border text-[12px] font-semibold transition-all whitespace-nowrap",
                category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice */}
      {selectedDate && (
        <div className="mx-4 mt-3 p-3 bg-info-light rounded-xl border border-info/20 flex items-start gap-2">
          <CalIcon className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-[12px] text-info font-semibold">
            Showing halls available on {format(selectedDate, "dd MMM yyyy")}
            {selectedSlot && ` — ${selectedSlot === "morning" ? "Morning slot" : "Night slot"}`}
          </p>
        </div>
      )}

      {/* Results */}
      <div className="px-4 md:px-10 pt-4 md:pt-6 flex items-center justify-between">
        <span className="text-[13px] md:text-[14px] font-semibold text-foreground">{results.length} {results.length === 1 ? "hall" : "halls"} found</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[12px] md:text-[13px] font-semibold text-foreground bg-transparent cursor-pointer">
          <option value="nearest">Sort: Nearest first</option>
          <option value="rating">Sort: Top rated</option>
          <option value="price_low">Sort: Price low to high</option>
          <option value="price_high">Sort: Price high to low</option>
        </select>
      </div>

      <div className="px-4 md:px-10 pt-3 md:pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {results.length === 0 ? (
          <div className="md:col-span-full">
            <EmptyState Icon={Search} title="No halls found" message="Try changing filters or selecting a different date." />
          </div>
        ) : (
          results.map((h) => <HallCard key={h.id} hall={h} />)
        )}
      </div>

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto md:max-w-2xl md:mx-auto">
          <SheetHeader>
            <SheetTitle className="font-heading">Filters</SheetTitle>
          </SheetHeader>

          <div className="mt-5 space-y-6 pb-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-foreground">Price per slot (₹)</label>
                <span className="text-[12px] font-semibold text-primary tabular-nums">₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <Slider value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} min={5000} max={500000} step={1000} />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Min</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={priceRange[0]}
                      min={0}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]);
                      }}
                      className="w-full h-11 pl-7 pr-3 rounded-xl border border-border bg-card text-[14px] font-semibold text-foreground tabular-nums focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Max</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={priceRange[1]}
                      min={0}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        setPriceRange([priceRange[0], Math.max(v, priceRange[0])]);
                      }}
                      className="w-full h-11 pl-7 pr-3 rounded-xl border border-border bg-card text-[14px] font-semibold text-foreground tabular-nums focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-foreground">Minimum guests</label>
                <span className="text-[12px] font-semibold text-primary tabular-nums">{guestRange[0] === 0 ? "Any" : `${guestRange[0]}+ guests`}</span>
              </div>
              <Slider value={guestRange} onValueChange={(v) => setGuestRange(v as [number])} min={0} max={3000} step={50} />
              <div className="mt-4 flex flex-wrap gap-2">
                {[100, 250, 500, 1000, 1500, 2000].map((n) => (
                  <button
                    key={n}
                    onClick={() => setGuestRange([n])}
                    className={cn("h-9 px-3.5 rounded-lg border text-[12px] font-semibold tabular-nums transition-all",
                      guestRange[0] === n ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground hover:border-primary/50")}
                  >
                    {n}+
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Or enter exact number</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 350"
                  value={guestRange[0] || ""}
                  min={0}
                  onChange={(e) => setGuestRange([Math.max(0, Number(e.target.value) || 0)])}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-card text-[14px] font-semibold text-foreground tabular-nums focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-bold text-foreground">Food preference</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[["veg", "Pure Veg"], ["nonveg", "Non-Veg"], ["both", "Both"]].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setFoodType(foodType === v ? null : v)}
                    className={cn("h-11 rounded-xl border text-[12px] font-semibold transition-all",
                      foodType === v ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground")}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setCategory(null); setFoodType(null); setPriceRange([5000, 500000]); setGuestRange([0]); }}
                className="flex-1 h-12 rounded-xl border-2 border-border text-[13px] font-bold text-foreground"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 h-12 rounded-xl bg-gradient-gold text-gold-foreground text-[13px] font-bold shadow-gold"
              >
                Show {results.length} Halls
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchPage;