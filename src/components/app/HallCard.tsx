import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Hall } from "@/types";
import { CATEGORY_META } from "@/components/app/CategoryIcon";
import { inr } from "@/lib/format";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export const HallCard = ({ hall, variant = "grid" }: { hall: Hall; variant?: "grid" | "scroll" }) => {
  const navigate = useNavigate();
  const minPrice = Math.min(hall.priceMorning, hall.priceNight);
  const cat = CATEGORY_META[hall.category];

  return (
    <button
      onClick={() => navigate(`/hall/${hall.id}`)}
      className={`text-left bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 active:scale-[0.98] transition-all duration-200 ${variant === "scroll" ? "w-[260px] md:w-full shrink-0" : "w-full"}`}
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
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-card/95 backdrop-blur rounded-md shadow-sm">
          <cat.Icon className="w-3 h-3 text-primary" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.08em]">{cat.label}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-card/95 backdrop-blur rounded-md shadow-sm">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="text-[11px] font-semibold text-foreground tabular-nums">{hall.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[14.5px] text-foreground truncate leading-tight">{hall.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" strokeWidth={2} />
          <span className="text-[11.5px] text-muted-foreground truncate">{hall.area}, {hall.city}</span>
          {hall.distanceKm ? <span className="text-[10.5px] text-primary font-bold ml-auto shrink-0 tabular-nums">{hall.distanceKm} km</span> : null}
        </div>
        <div className="flex items-baseline gap-1 mt-2.5">
          <span className="font-bold text-[15px] text-foreground tabular-nums">{inr(minPrice)}</span>
          <span className="text-[11px] text-muted-foreground">onwards / slot</span>
        </div>
      </div>
    </button>
  );
};