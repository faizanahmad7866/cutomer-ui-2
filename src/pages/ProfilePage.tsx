import { useNavigate } from "react-router-dom";
import { Camera, LogOut, MapPin, Phone, User as UserIcon, Mail, HelpCircle, ChevronRight, Bell, FileText } from "lucide-react";
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
        <button onClick={() => navigate("/login")} className="mt-4 px-6 py-3 bg-gradient-gold text-gold-foreground rounded-xl font-bold shadow-gold">Login</button>
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
      <div className="bg-gradient-navy px-5 pt-6 pb-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/15 blur-3xl" />
        <h1 className="font-heading font-bold text-2xl relative">Profile</h1>
      </div>

      <div className="px-4 -mt-8 relative">
        <div className="bg-card rounded-2xl shadow-elevated p-5 border border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-navy text-white flex items-center justify-center text-3xl font-bold overflow-hidden shadow-card">
                {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]?.toUpperCase()}
              </div>
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-md border-2 border-card">
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              {user.photo && (
                <button onClick={() => { updateUser({ photo: "" }); toast.success("Photo removed"); }} className="text-[10px] text-destructive font-bold mt-1 block">Remove</button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg truncate">{user.name}</h2>
              <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />+91 {user.phone}</p>
              <p className="text-[12px] text-muted-foreground flex items-start gap-1 mt-0.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" />{user.address}</p>
            </div>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" rows={2} />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 h-11 rounded-xl border border-border font-bold text-sm">Cancel</button>
                <button onClick={save} className="flex-1 h-11 rounded-xl bg-gradient-gold text-gold-foreground font-bold text-sm">Save</button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">Mobile cannot be changed</p>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full mt-4 h-11 rounded-xl bg-primary-light text-primary font-bold text-sm">Edit Profile</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { l: "Bookings", v: bookings.length },
            { l: "Confirmed", v: bookings.filter((b) => b.status === "confirmed").length },
            { l: "Pending", v: bookings.filter((b) => b.status === "pending").length },
          ].map((s) => (
            <div key={s.l} className="bg-card rounded-xl p-3 border border-border text-center">
              <div className="font-heading font-bold text-xl text-primary">{s.v}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {[
            { Icon: FileText, label: "My Bookings", to: "/bookings" },
            { Icon: Bell, label: "Notifications", to: "/notifications" },
            { Icon: HelpCircle, label: "Help & Support", action: () => window.open("https://wa.me/919999988888") },
            { Icon: Mail, label: "Contact us", action: () => (window.location.href = "mailto:support@bookmyhall.online") },
          ].map((it, i) => (
            <button key={i} onClick={() => it.to ? navigate(it.to) : it.action?.()} className="w-full flex items-center gap-3 p-4 text-left active:bg-muted/40">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center"><it.Icon className="w-4 h-4 text-primary" /></div>
              <span className="flex-1 font-semibold text-sm">{it.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button onClick={() => { logout(); toast.success("Logged out"); navigate("/"); }} className="mt-4 w-full h-12 rounded-2xl border border-destructive/30 text-destructive font-bold text-sm flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />Log out
        </button>

        <p className="text-center text-[11px] text-muted-foreground mt-6">BookMyHall · v1.0 · Made with ❤️</p>
      </div>
    </div>
  );
};

export default ProfilePage;