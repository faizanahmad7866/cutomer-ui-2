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
      className={`text-left bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-card active:scale-[0.99] transition-all duration-150 ${
        variant === "scroll" ? "w-[280px] md:w-full shrink-0" : "w-full"
      }`}
    >
      <div className="relative h-[180px] bg-muted">
        <Swiper modules={[Autoplay]} autoplay={{ delay: 4500, disableOnInteraction: false }} loop className="h-full">
          {hall.images.slice(0, 4).map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hall.name} photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        {hall.isVerified && (
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-card/95 backdrop-blur rounded text-[10px] font-bold text-success">
            <BadgeCheck className="w-3 h-3" strokeWidth={2.4} />
            Verified
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-success rounded text-[11px] font-bold text-white tabular-nums">
          {hall.rating.toFixed(1)}
          <Star className="w-2.5 h-2.5 fill-white" strokeWidth={0} />
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          <cat.Icon className="w-3 h-3" strokeWidth={2.2} />
          {cat.label}
        </div>
        <h3 className="font-semibold text-[15px] text-foreground truncate leading-snug mt-1">{hall.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-[12px] text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{hall.area}, {hall.city}</span>
          {hall.distanceKm !== undefined && (
            <span className="ml-auto shrink-0 text-[11px] font-semibold text-foreground tabular-nums">{hall.distanceKm} km</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-[11.5px] text-muted-foreground">
          <Users className="w-3 h-3 shrink-0" strokeWidth={2} />
          Up to {hall.capacity.toLocaleString("en-IN")} guests
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">{hall.totalReviews} reviews</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 mt-3 pt-3 border-t border-border">
          <div>
            <span className="font-bold text-[16px] text-foreground tabular-nums">{inr(minPrice)}</span>
            <span className="text-[11.5px] text-muted-foreground"> onwards / slot</span>
          </div>
          <span className="text-[10.5px] font-semibold text-success">+ taxes</span>
        </div>
      </div>
    </button>
  );
};
