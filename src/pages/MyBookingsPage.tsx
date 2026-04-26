import { useNavigate } from "react-router-dom";
import { CalendarCheck, ChevronRight, Sun, Moon } from "lucide-react";
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
    <div className="px-4 md:px-6 pt-5 md:pt-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Track venue confirmation, payment and receipt status.</p>
        </div>
        <button onClick={() => navigate("/search")} className="hidden md:inline-flex h-10 px-4 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold items-center justify-center">
          Book a hall
        </button>
      </div>
      <div className="flex gap-2 bg-muted p-1 rounded-xl mb-4 md:max-w-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {list.map((b) => (
            <button key={b.id} onClick={() => navigate(`/bookings/${b.id}`)} className="w-full text-left bg-card rounded-2xl border border-border shadow-soft p-3 md:p-4 flex gap-3 active:scale-[0.99] hover:shadow-card transition-all">
              <img src={b.hallImage} alt={b.hallName} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[14px] md:text-[15px] text-foreground truncate">{b.hallName}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{b.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-muted text-foreground rounded tabular-nums">{format(new Date(b.date), "dd MMM yyyy")}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-primary-light text-primary rounded capitalize">
                    {b.slot === "morning" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}{b.slot}
                  </span>
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