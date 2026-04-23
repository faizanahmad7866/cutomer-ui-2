import { Leaf, Drumstick, Utensils } from "lucide-react";
import type { FoodType } from "@/types";
import { cn } from "@/lib/utils";

export const FoodBadge = ({ type, className }: { type: FoodType; className?: string }) => {
  const map = {
    veg: { Icon: Leaf, label: "Pure Veg", cls: "text-success" },
    nonveg: { Icon: Drumstick, label: "Non-Veg", cls: "text-destructive" },
    both: { Icon: Utensils, label: "Veg & Non-Veg", cls: "text-primary" },
  } as const;
  const it = map[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5", it.cls, className)}>
      <it.Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
      <span className="font-semibold">{it.label}</span>
    </span>
  );
};