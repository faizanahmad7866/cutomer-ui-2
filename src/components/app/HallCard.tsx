import { Star, MapPin, Users, BadgeCheck } from "lucide-react";
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
      className={`group text-left bg-card rounded-2xl overflow-hidden border border-border/70 hover:border-primary/30 hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 ${
        variant === "scroll" ? "w-[280px] md:w-full shrink-0" : "w-full"
      }`}
    >
      <div className="relative h-[200px] md:h-[220px] bg-muted overflow-hidden">
        <Swiper modules={[Autoplay]} autoplay={{ delay: 4500, disableOnInteraction: false }} loop className="h-full">
          {hall.images.slice(0, 4).map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hall.name} photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        {hall.isVerified && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-bold text-primary shadow-soft">
            <BadgeCheck className="w-3 h-3 text-success" strokeWidth={2.6} />
            VERIFIED
          </div>
        )}
        <div className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-1 bg-success rounded-full text-[11px] font-bold text-white tabular-nums shadow-soft">
          {hall.rating.toFixed(1)}
          <Star className="w-3 h-3 fill-white ml-0.5" strokeWidth={0} />
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 bg-black/55 backdrop-blur-sm rounded text-[10px] font-semibold text-white uppercase tracking-wider">
          <cat.Icon className="w-3 h-3" strokeWidth={2.2} />
          {cat.label}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-[17px] md:text-[18px] text-foreground truncate leading-snug">{hall.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-[12px] text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{hall.area}, {hall.city}</span>
          {hall.distanceKm !== undefined && (
            <span className="ml-auto shrink-0 text-[11px] font-semibold text-foreground tabular-nums">{hall.distanceKm} km</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[11.5px] text-muted-foreground">
          <Users className="w-3 h-3 shrink-0" strokeWidth={2} />
          Up to {hall.capacity.toLocaleString("en-IN")} guests
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">{hall.totalReviews} reviews</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 mt-3 pt-3 border-t border-dashed border-border">
          <div>
            <span className="font-bold text-[18px] text-primary tabular-nums">{inr(minPrice)}</span>
            <span className="text-[11.5px] text-muted-foreground"> /slot onwards</span>
          </div>
          <span className="text-[10.5px] font-semibold text-gold">Book at 5% →</span>
        </div>
      </div>
    </button>
  );
};
