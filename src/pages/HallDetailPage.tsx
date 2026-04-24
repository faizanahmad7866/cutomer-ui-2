import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Users, Sun, Moon, Phone, MessageCircle, ChevronLeft, ChevronRight, BadgeCheck, Share2, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination as SwiperPag } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { format, addMonths, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore, startOfDay, isToday } from "date-fns";
import { HALLS } from "@/data/halls";
import { CATEGORY_META } from "@/components/app/CategoryIcon";
import { getHallBookedSlots } from "@/store/appStore";
import { inr, advanceOf } from "@/lib/format";
import { cn } from "@/lib/utils";

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hall = HALLS.find((h) => h.id === id);
  const [slot, setSlot] = useState<"morning" | "night" | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const arr = eachDayOfInterval({ start, end });
    const offset = getDay(start);
    return [...Array(offset).fill(null), ...arr];
  }, [month]);

  if (!hall) return <div className="p-10 text-center">Hall not found</div>;

  const dateStatus = (d: Date) => {
    const iso = format(d, "yyyy-MM-dd");
    const booked = getHallBookedSlots(hall.id, iso);
    if (booked.length === 0) return "available";
    if (booked.length === 1) return "partial";
    return "booked";
  };

  const totalAmount = slot === "morning" ? hall.priceMorning : slot === "night" ? hall.priceNight : Math.min(hall.priceMorning, hall.priceNight);
  const advance = advanceOf(totalAmount);

  const proceed = () => {
    if (!date || !slot) return;
    const iso = format(date, "yyyy-MM-dd");
    navigate(`/book/${hall.id}?date=${iso}&slot=${slot}`);
  };

  return (
    <div className="-mx-0 pb-32">
      {/* Gallery */}
      <div className="relative h-[300px] bg-muted">
        <Swiper
          modules={[Autoplay, SwiperPag]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {hall.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hall.name} ${i + 1}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => navigator.share?.({ title: hall.name, url: window.location.href })} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Header info */}
      <div className="px-5 pt-5 -mt-6 relative z-10 bg-background rounded-t-3xl">
        <div className="flex items-center gap-2 flex-wrap mb-3 pt-1">
          {hall.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-full text-[11px] font-bold">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {(() => { const C = CATEGORY_META[hall.category]; return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-light text-primary rounded-full text-[11px] font-semibold">
              <C.Icon className="w-3 h-3" strokeWidth={2} /> {C.label}
            </span>
          ); })()}
        </div>

        <h1 className="font-heading text-2xl font-bold text-foreground leading-tight">{hall.name}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-[13px]">{hall.address}, {hall.city}</span>
        </div>

        <div className="flex items-center gap-4 mt-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-4 h-4", s <= Math.round(hall.rating) ? "fill-gold text-gold" : "text-border")} />)}
            </div>
            <span className="font-bold text-foreground">{hall.rating.toFixed(1)}</span>
            <span className="text-[12px] text-muted-foreground">({hall.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Users className="w-4 h-4" /> Up to {hall.capacity.toLocaleString()} guests
          </div>
        </div>
      </div>

      {/* Slot pricing */}
      <section className="px-5 pt-5">
        <h2 className="font-heading text-lg font-bold mb-3">Choose your slot</h2>
        <div className="grid grid-cols-2 gap-3">
          {([
            { s: "morning", emoji: Sun, label: "Morning", time: "6 AM – 2 PM", price: hall.priceMorning },
            { s: "night", emoji: Moon, label: "Night", time: "6 PM – 2 AM", price: hall.priceNight },
          ] as const).map(({ s, emoji: Icon, label, time, price }) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={cn("p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.97]",
                slot === s ? "border-primary bg-primary-light shadow-elevated" : "border-border bg-card")}
            >
              <Icon className={cn("w-5 h-5 mb-2", slot === s ? "text-primary" : "text-muted-foreground")} />
              <div className="font-heading font-bold text-foreground">{label}</div>
              <div className="text-[11px] text-muted-foreground">{time}</div>
              <div className="font-heading font-bold text-primary mt-2">{inr(price)}</div>
              {slot === s && <div className="text-[10px] font-bold text-success mt-1">✓ Selected</div>}
            </button>
          ))}
        </div>
      </section>

      {/* Calendar */}
      <section className="px-5 pt-6">
        <h2 className="font-heading text-lg font-bold mb-1">Check availability</h2>
        <p className="text-[12px] text-muted-foreground mb-3">Tap a green or blue date to pick</p>
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMonth(addMonths(month, -1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            <h3 className="font-heading font-bold text-foreground">{format(month, "MMMM yyyy")}</h3>
            <button onClick={() => setMonth(addMonths(month, 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[11px] font-bold text-muted-foreground py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d: Date | null, i) => {
              if (!d) return <div key={i} />;
              const status = dateStatus(d);
              const past = isBefore(d, startOfDay(new Date()));
              const sel = date && isSameDay(d, date);
              const blocked = past || (status === "booked" && (!slot || getHallBookedSlots(hall.id, format(d, "yyyy-MM-dd")).includes(slot)));
              return (
                <button
                  key={i}
                  disabled={blocked}
                  onClick={() => setDate(d)}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-[12px] font-bold transition-all",
                    sel && "bg-primary text-primary-foreground shadow-md scale-105",
                    !sel && !past && status === "available" && "bg-success-light text-success hover:scale-105",
                    !sel && !past && status === "partial" && "bg-info-light text-info hover:scale-105",
                    !sel && status === "booked" && "bg-destructive-light text-destructive line-through cursor-not-allowed",
                    past && "text-muted-foreground/40 cursor-not-allowed",
                    isToday(d) && !sel && "ring-2 ring-primary"
                  )}
                >
                  {format(d, "d")}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border flex-wrap">
            {[
              { c: "bg-success-light", l: "Available" },
              { c: "bg-info-light", l: "Partly booked" },
              { c: "bg-destructive-light", l: "Booked" },
            ].map((it) => (
              <div key={it.l} className="flex items-center gap-1.5">
                <span className={cn("w-3 h-3 rounded", it.c)} />
                <span className="text-[11px] font-semibold text-muted-foreground">{it.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="px-5 pt-6">
        <h2 className="font-heading text-lg font-bold mb-3">What's included</h2>
          <div className="grid grid-cols-2 gap-2">
          {hall.amenities.map((a) => (
            <div key={a} className="flex items-center gap-2 p-3 bg-card rounded-xl border border-border/60 text-[13px] font-medium text-foreground">
              <span className="w-5 h-5 rounded-full bg-success-light flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-success" strokeWidth={3} />
              </span>
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-5 pt-6">
        <h2 className="font-heading text-lg font-bold mb-2">About this hall</h2>
        <p className={cn("text-[14px] leading-relaxed text-muted-foreground", !expanded && "line-clamp-3")}>{hall.description}</p>
        <button onClick={() => setExpanded(!expanded)} className="text-[13px] font-bold text-primary mt-2">
          {expanded ? "Show less" : "Read more"}
        </button>
      </section>

      {/* Support */}
      <section className="px-5 pt-6">
        <div className="bg-gradient-to-br from-primary-light to-card border border-primary/15 rounded-2xl p-4">
          <h3 className="font-heading font-bold text-foreground">Need help?</h3>
          <p className="text-[12px] text-muted-foreground mt-1">Our team is here for you 24×7</p>
          <div className="flex gap-2 mt-3">
            <a href="tel:+919999988888" className="flex-1 h-10 bg-card rounded-xl border border-border flex items-center justify-center gap-2 text-[12px] font-bold text-primary">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href="https://wa.me/919999988888" className="flex-1 h-10 bg-success rounded-xl flex items-center justify-center gap-2 text-[12px] font-bold text-white">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border shadow-[0_-8px_24px_rgba(26,60,110,0.08)] safe-bottom">
        <div className="max-w-md mx-auto p-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">From</div>
            <div className="font-heading font-bold text-foreground">{inr(Math.min(hall.priceMorning, hall.priceNight))}<span className="text-[11px] text-muted-foreground">/slot</span></div>
          </div>
          <button
            onClick={proceed}
            disabled={!date || !slot}
            className="flex-1 h-12 bg-gradient-gold text-gold-foreground font-bold text-[13px] rounded-xl shadow-gold active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {!date || !slot ? "Pick date & slot" : `Book — Pay ${inr(advance)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallDetailPage;