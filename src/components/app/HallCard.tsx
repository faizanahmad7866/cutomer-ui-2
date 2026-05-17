import { MapPin, Users, BadgeCheck } from "lucide-react";
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
      className={`group text-left bg-card rounded-lg overflow-hidden border border-border hover:border-info/40 hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 ${
        variant === "scroll" ? "w-[280px] md:w-full shrink-0" : "w-full"
      }`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <Swiper modules={[Autoplay]} autoplay={{ delay: 4500, disableOnInteraction: false }} loop className="h-full">
          {hall.images.slice(0, 4).map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt={`${hall.name} photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </SwiperSlide>
          ))}
        </Swiper>
        {hall.isVerified && (
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 bg-card rounded text-[10px] font-bold text-success shadow-soft">
            <BadgeCheck className="w-3 h-3" strokeWidth={2.6} />
            Verified
          </div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-bold text-[15.5px] md:text-[16px] text-info hover:underline truncate leading-snug">
              {hall.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[12px] text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
              <span className="truncate">{hall.area}, {hall.city}</span>
            </div>
          </div>
          {/* Booking.com style score block */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-bold text-foreground leading-tight">
                {hall.rating >= 4.6 ? "Exceptional" : hall.rating >= 4.2 ? "Very good" : "Good"}
              </div>
              <div className="text-[10.5px] text-muted-foreground tabular-nums">{hall.totalReviews} reviews</div>
            </div>
            <div className="w-9 h-9 rounded-md rounded-bl-none bg-primary text-primary-foreground font-bold text-[13px] flex items-center justify-center tabular-nums">
              {hall.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-[11.5px] text-muted-foreground">
          <cat.Icon className="w-3 h-3 shrink-0" strokeWidth={2} />
          <span>{cat.label}</span>
          <span className="text-border">·</span>
          <Users className="w-3 h-3 shrink-0" strokeWidth={2} />
          <span>Up to {hall.capacity.toLocaleString("en-IN")}</span>
          {hall.distanceKm !== undefined && (
            <span className="ml-auto shrink-0 text-foreground font-semibold tabular-nums">{hall.distanceKm} km</span>
          )}
        </div>

        {hall.isVerified && (
          <div className="mt-2 text-[11px] font-semibold text-success inline-flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.4} /> Free cancellation · No prepayment
          </div>
        )}

        <div className="flex items-end justify-between gap-1 mt-3 pt-3 border-t border-border">
          <div className="min-w-0">
            <div className="text-[10.5px] text-muted-foreground">Per slot from</div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[18px] text-foreground tabular-nums">{inr(minPrice)}</span>
            </div>
            <div className="text-[10.5px] text-muted-foreground">+ taxes · pay 5% to lock</div>
          </div>
          <span className="h-9 px-3 rounded-md bg-info text-info-foreground text-[12.5px] font-bold inline-flex items-center shrink-0">
            See availability
          </span>
        </div>
      </div>
    </button>
  );
};
