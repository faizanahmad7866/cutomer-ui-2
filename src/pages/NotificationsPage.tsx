import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useApp } from "@/store/appStore";
import { EmptyState } from "@/components/app/EmptyState";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useApp();

  useEffect(() => { const t = setTimeout(markAllNotificationsRead, 800); return () => clearTimeout(t); }, [markAllNotificationsRead]);

  return (
    <div className="pb-8 animate-fade-up">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-heading font-bold text-lg">Notifications</h1>
      </div>
      {notifications.length === 0 ? (
        <EmptyState Icon={Bell} title="No notifications yet" message="We'll notify you about booking updates and offers" />
      ) : (
        <div className="px-4 mt-4 space-y-2">
          {notifications.map((n) => (
            <button key={n.id} onClick={() => n.link && navigate(n.link)} className={cn("w-full text-left bg-card rounded-2xl border p-4 flex gap-3 active:scale-[0.99] transition-transform", n.read ? "border-border" : "border-primary/30 bg-primary-light/30")}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", n.read ? "bg-muted" : "bg-primary text-primary-foreground")}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm">{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />}
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;