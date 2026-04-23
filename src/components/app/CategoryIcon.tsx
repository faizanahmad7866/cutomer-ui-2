import { Building2, Church, Trees, type LucideIcon } from "lucide-react";
import type { HallCategory } from "@/types";

export const CATEGORY_META: Record<HallCategory, { label: string; Icon: LucideIcon }> = {
  banquet: { label: "Banquet Hall", Icon: Building2 },
  wedding_hall: { label: "Wedding Hall", Icon: Church },
  lawn: { label: "Lawn & Garden", Icon: Trees },
};

export const CategoryIcon = ({ category, className }: { category: HallCategory; className?: string }) => {
  const Icon = CATEGORY_META[category].Icon;
  return <Icon className={className} strokeWidth={1.8} />;
};