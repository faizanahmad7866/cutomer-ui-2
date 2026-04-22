import { BookingStatus } from "@/types";

export const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const map: Record<BookingStatus, { label: string; cls: string }> = {
    pending: { label: "Pending Approval", cls: "bg-warning-light text-warning" },
    confirmed: { label: "Confirmed", cls: "bg-success-light text-success" },
    rejected: { label: "Rejected", cls: "bg-destructive-light text-destructive" },
    cancelled: { label: "Cancelled", cls: "bg-muted text-muted-foreground" },
    completed: { label: "Completed", cls: "bg-info-light text-info" },
  };
  const it = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${it.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {it.label}
    </span>
  );
};