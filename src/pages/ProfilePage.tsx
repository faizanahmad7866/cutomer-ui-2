import { useNavigate } from "react-router-dom";
import { Camera, LogOut, MapPin, Phone, User as UserIcon, Mail, HelpCircle, ChevronRight, Bell, FileText, MessageCircle, Shield, FileCheck, Star } from "lucide-react";
import { useApp } from "@/store/appStore";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, bookings } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="px-6 pt-10 text-center">
        <UserIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-heading font-bold text-xl">Login to view profile</h2>
        <button onClick={() => navigate("/login")} className="mt-4 px-6 py-3 bg-gold text-gold-foreground rounded-xl font-bold">Login</button>
      </div>
    );
  }

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { updateUser({ photo: reader.result as string }); toast.success("Photo updated"); };
    reader.readAsDataURL(f);
  };

  const save = () => { updateUser({ name, address }); setEditing(false); toast.success("Profile saved"); };

  return (
    <div className="pb-8 animate-fade-up">
      <div className="bg-primary px-5 md:px-6 pt-5 pb-10 text-primary-foreground border-b border-primary-dark">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading font-bold text-[20px] md:text-[26px] tracking-tight">Account</h1>
          <p className="text-[12.5px] md:text-[13.5px] text-primary-foreground/70 mt-0.5">Manage your profile, bookings and preferences</p>
        </div>
      </div>

      <div className="px-4 md:px-6 -mt-7 relative max-w-5xl mx-auto md:grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-1 md:space-y-3">
        <div className="bg-card rounded-lg shadow-card p-5 border border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold overflow-hidden">
                {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]?.toUpperCase()}
              </div>
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center shadow-soft">
                <Camera className="w-3.5 h-3.5 text-foreground" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-[16px] text-foreground truncate">{user.name}</h2>
              <p className="text-[12px] text-muted-foreground flex items-center gap-1.5 mt-0.5"><Phone className="w-3 h-3" />+91 {user.phone}</p>
              <p className="text-[12px] text-muted-foreground flex items-start gap-1.5 mt-0.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" /><span className="truncate">{user.address}</span></p>
            </div>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" rows={2} />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 h-10 rounded-md border border-border font-semibold text-[13px]">Cancel</button>
                <button onClick={save} className="flex-1 h-10 rounded-md bg-primary text-primary-foreground font-bold text-[13px]">Save</button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">Mobile number cannot be changed</p>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full mt-4 h-10 rounded-md border border-border bg-card text-foreground font-semibold text-[13px] hover:bg-secondary transition-colors">Edit profile</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { l: "Bookings", v: bookings.length },
            { l: "Confirmed", v: bookings.filter((b) => b.status === "confirmed").length },
            { l: "Pending", v: bookings.filter((b) => b.status === "pending").length },
          ].map((s) => (
            <div key={s.l} className="bg-card rounded-md p-3 border border-border text-center">
              <div className="font-heading font-bold text-[20px] text-foreground tabular-nums">{s.v}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
        </div>

        <div className="md:col-span-2 md:space-y-0">

        {/* Account section */}
        <div className="mt-5 md:mt-0">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Account</h3>
          <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border">
            {[
              { Icon: FileText, label: "My Bookings", sub: `${bookings.length} total`, to: "/bookings" },
              { Icon: Bell, label: "Notifications", sub: "Booking updates & offers", to: "/notifications" },
              { Icon: Star, label: "My Reviews", sub: "Rate halls you've booked", to: "/bookings" },
            ].map((it, i) => (
              <button key={i} onClick={() => navigate(it.to)} className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-secondary transition-colors">
                <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center shrink-0"><it.Icon className="w-[17px] h-[17px] text-primary" strokeWidth={2} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13.5px] text-foreground">{it.label}</div>
                  <div className="text-[11px] text-muted-foreground">{it.sub}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Help & Support */}
        <div className="mt-5">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Help & Support</h3>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-[14px] text-foreground">Customer support · 24×7</div>
                  <div className="text-[12px] text-muted-foreground">Average response under 2 minutes</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a href="https://wa.me/919999988888" className="h-10 rounded-md bg-success text-white flex items-center justify-center gap-1.5 text-[12.5px] font-semibold hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-4 h-4" strokeWidth={2} /> WhatsApp
                </a>
                <a href="tel:+919999988888" className="h-10 rounded-md bg-card border border-border text-foreground flex items-center justify-center gap-1.5 text-[12.5px] font-semibold hover:bg-secondary transition-colors">
                  <Phone className="w-4 h-4 text-primary" strokeWidth={2} /> Call us
                </a>
              </div>
            </div>
            <div className="divide-y divide-border">
              {[
                { Icon: Mail, label: "Email support", sub: "support@bookmyhall.online", action: () => (window.location.href = "mailto:support@bookmyhall.online") },
                { Icon: FileCheck, label: "Cancellation & Refund Policy", sub: "5–7 days refund · 3% gateway fee", action: () => {} },
                { Icon: Shield, label: "Privacy & Terms", sub: "How we protect your data", action: () => {} },
              ].map((it, i) => (
                <button key={i} onClick={it.action} className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-secondary transition-colors">
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0"><it.Icon className="w-4 h-4 text-muted-foreground" strokeWidth={2} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-foreground">{it.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{it.sub}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => { logout(); toast.success("Logged out"); navigate("/"); }} className="mt-5 w-full h-11 rounded-md border border-border text-destructive font-semibold text-[13px] hover:bg-destructive-light/40 flex items-center justify-center gap-2 transition-colors">
          <LogOut className="w-4 h-4" /> Log out
        </button>

        <p className="text-center text-[11px] text-muted-foreground/70 mt-6 tracking-wider">HALLOFINDR  ·  v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;