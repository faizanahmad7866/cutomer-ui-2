import { BookingStatus } from "@/types";
import { Clock, CheckCircle2, XCircle, MinusCircle, Award } from "lucide-react";

const map: Record<BookingStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  pending:   { label: "Awaiting confirmation", cls: "bg-warning-light text-warning",          Icon: Clock },
  confirmed: { label: "Confirmed",              cls: "bg-success-light text-success",          Icon: CheckCircle2 },
  rejected:  { label: "Rejected",               cls: "bg-destructive-light text-destructive",  Icon: XCircle },
  cancelled: { label: "Cancelled",              cls: "bg-muted text-muted-foreground",         Icon: MinusCircle },
  completed: { label: "Completed",              cls: "bg-info-light text-info",                Icon: Award },
};

export const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const it = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${it.cls}`}>
      <it.Icon className="w-3 h-3" strokeWidth={2.4} />
      {it.label}
    </span>
  );
};
