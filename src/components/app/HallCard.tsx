import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Hall } from "@/types";
import { CATEGORY_LABELS } from "@/data/halls";
import { inr } from "@/lib/format";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export const HallCard = ({ hall, variant = "grid" }: { hall: Hall; variant?: "grid" | "scroll" }) => {
  const navigate = useNavigate();
  const minPrice = Math.min(hall.priceMorning, hall.priceNight);
  const cat = CATEGORY_LABELS[hall.category];

  return (
    <button
      onClick={() => navigate(`/hall/${hall.id}`)}
      className={`text-left bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 active:scale-[0.98] transition-all duration-200 ${variant === "scroll" ? "w-[260px] shrink-0" : "w-full"}`}
    >
      <div className="relative h-[170px] bg-muted">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {hall.images.slice(0, 4).map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hall.name} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur rounded-lg shadow-sm">
          <span className="text-[11px]">{cat.emoji}</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{cat.label}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur rounded-lg shadow-sm">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="text-[11px] font-bold text-foreground">{hall.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-heading font-bold text-[15px] text-foreground truncate leading-tight">{hall.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[12px] text-muted-foreground truncate">{hall.area}, {hall.city}</span>
          {hall.distanceKm ? <span className="text-[11px] text-primary font-semibold ml-auto shrink-0">{hall.distanceKm} km</span> : null}
        </div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-border/60">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Starts at</div>
            <div className="font-heading font-bold text-[16px] text-foreground">{inr(minPrice)}<span className="text-[11px] font-medium text-muted-foreground">/slot</span></div>
          </div>
          <div className="px-3 py-1.5 bg-gold text-gold-foreground text-[11px] font-bold rounded-lg shadow-sm">View</div>
        </div>
      </div>
    </button>
  );
};