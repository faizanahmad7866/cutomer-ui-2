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
      <div className="flex gap-1 bg-secondary p-1 rounded-md mb-4 md:max-w-sm border border-border">
        {(["upcoming", "past"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 h-9 rounded-md text-[13px] font-semibold transition-all capitalize", tab === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
            {t} ({t === "upcoming" ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState Icon={CalendarCheck} title="No bookings yet" message="Browse halls and book your first event!" action={
          <button onClick={() => navigate("/search")} className="px-5 h-11 bg-gold text-gold-foreground rounded-md font-bold text-[13px]">Browse halls</button>
        } />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {list.map((b) => (
            <button key={b.id} onClick={() => navigate(`/bookings/${b.id}`)} className="w-full text-left bg-card rounded-lg border border-border shadow-soft p-3 flex gap-3 hover:shadow-elevated hover:border-border-strong transition-all">
              <img src={b.hallImage} alt={b.hallName} className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[14px] text-info hover:underline truncate">{b.hallName}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{b.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-secondary text-foreground rounded-sm tabular-nums border border-border">{format(new Date(b.date), "dd MMM yyyy")}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-primary-light text-primary rounded-sm capitalize">
                    {b.slot === "morning" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}{b.slot}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={b.status} />
                  <span className="text-[12.5px] font-bold tabular-nums text-foreground">{inr(b.paidAmount)} <span className="text-[10px] font-medium text-muted-foreground">paid</span></span>
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