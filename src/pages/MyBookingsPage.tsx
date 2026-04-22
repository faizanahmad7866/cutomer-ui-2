import { useNavigate } from "react-router-dom";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "@/store/appStore";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { inr } from "@/lib/format";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, user } = useApp();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  if (!user) {
    return (
      <EmptyState Icon={CalendarCheck} title="Login required" message="Please login to see your bookings" action={
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Login</button>
      } />
    );
  }

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.date) >= now && b.status !== "cancelled" && b.status !== "rejected");
  const past = bookings.filter((b) => !upcoming.includes(b));
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="px-4 pt-5 animate-fade-up">
      <h1 className="font-heading text-2xl font-bold mb-4">My Bookings</h1>
      <div className="flex gap-2 bg-muted p-1 rounded-xl mb-4">
        {(["upcoming", "past"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 h-10 rounded-lg text-[13px] font-bold transition-all capitalize", tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground")}>
            {t} ({t === "upcoming" ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState Icon={CalendarCheck} title="No bookings yet" message="Browse halls and book your first event!" action={
          <button onClick={() => navigate("/search")} className="px-6 py-3 bg-gradient-gold text-gold-foreground rounded-xl font-bold shadow-gold">Browse halls</button>
        } />
      ) : (
        <div className="space-y-3">
          {list.map((b) => (
            <button key={b.id} onClick={() => navigate(`/bookings/${b.id}`)} className="w-full text-left bg-card rounded-2xl border border-border shadow-soft p-3 flex gap-3 active:scale-[0.99] transition-transform">
              <img src={b.hallImage} alt={b.hallName} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold text-[14px] truncate">{b.hallName}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">{b.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-bold px-1.5 py-0.5 bg-primary-light text-primary rounded">{format(new Date(b.date), "dd MMM")}</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 bg-gold-light text-gold-dark rounded">{b.slot}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={b.status} />
                  <span className="text-[12px] font-bold">{inr(b.paidAmount)} <span className="text-[10px] text-muted-foreground">paid</span></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;