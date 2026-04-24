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
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 300000]);
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
      <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-xl border-b border-border/60 px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hall name or area..."
            className="w-full h-11 pl-10 pr-24 bg-card rounded-xl border border-border text-[14px] font-medium focus:border-primary transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-[88px] top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(true)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-lg bg-primary text-primary-foreground flex items-center gap-1.5 text-[12px] font-semibold active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2.2} />
            Filters
            {activeFilters > 0 && <span className="w-4 h-4 bg-gold text-gold-foreground rounded-full text-[10px] font-bold flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
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
      <div className="px-4 pt-4 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-foreground">{results.length} venues</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[12px] font-semibold text-foreground bg-transparent">
          <option value="nearest">Sort: Nearest first</option>
          <option value="rating">Sort: Top rated</option>
          <option value="price_low">Sort: Price low to high</option>
          <option value="price_high">Sort: Price high to low</option>
        </select>
      </div>

      <div className="px-4 pt-3 grid grid-cols-1 gap-4">
        {results.length === 0 ? (
          <EmptyState Icon={Search} title="No halls found" message="Try changing filters or selecting a different date." />
        ) : (
          results.map((h) => <HallCard key={h.id} hall={h} />)
        )}
      </div>

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading">Filters</SheetTitle>
          </SheetHeader>

          <div className="mt-5 space-y-6 pb-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-foreground">Price Range</label>
                <span className="text-[12px] font-semibold text-primary">₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <Slider value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} min={10000} max={300000} step={5000} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-foreground">Minimum Guests</label>
                <span className="text-[12px] font-semibold text-primary">{guestRange[0] === 0 ? "Any" : `${guestRange[0]}+`}</span>
              </div>
              <Slider value={guestRange} onValueChange={(v) => setGuestRange(v as [number])} min={0} max={2000} step={50} />
            </div>

            <div>
              <label className="text-[13px] font-bold text-foreground">Food Preference</label>
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
                onClick={() => { setCategory(null); setFoodType(null); setPriceRange([10000, 300000]); setGuestRange([0]); }}
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