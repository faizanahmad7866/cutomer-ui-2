import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Download, Share2, Star, MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "@/store/appStore";
import { StatusBadge } from "@/components/app/StatusBadge";
import { inr, refundOnCancel } from "@/lib/format";
import { toast } from "sonner";
import jsPDF from "jspdf";

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useApp();
  const b = bookings.find((x) => x.id === bookingId);

  if (!b) return <div className="p-10 text-center">Booking not found</div>;

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("BookMyHall — Receipt", 20, 20);
    doc.setFontSize(11);
    let y = 35;
    [
      `Booking ID: ${b.id}`,
      `Status: ${b.status.toUpperCase()}`,
      `Date: ${format(new Date(b.date), "dd MMM yyyy")} (${b.slot})`,
      ``,
      `Hall: ${b.hallName}`,
      `Address: ${b.hallAddress}`,
      `Owner: ${b.ownerName} - ${b.ownerPhone}`,
      ``,
      `Customer: ${b.customerName} (+91 ${b.customerPhone})`,
      `Address: ${b.customerAddress}`,
      `Guests: ${b.guestCount} | Function: ${b.functionType}`,
      ``,
      `Total: Rs. ${b.totalAmount.toLocaleString("en-IN")}`,
      `Paid:  Rs. ${b.paidAmount.toLocaleString("en-IN")}`,
      `Pending: Rs. ${b.pendingAmount.toLocaleString("en-IN")}`,
    ].forEach((l) => { doc.text(l, 20, y); y += 7; });
    doc.save(`BookMyHall-${b.id}.pdf`);
  };

  const cancel = () => {
    if (!confirm(`Cancel this booking? Refund: ${inr(refundOnCancel(b.totalAmount))} (3% gateway charge applies)`)) return;
    updateBookingStatus(b.id, "cancelled");
    toast.success("Booking cancelled. Refund will be processed in 5-7 days.");
  };

  // Demo: simulate owner action
  const simulateOwner = (status: "confirmed" | "rejected") => {
    updateBookingStatus(b.id, status);
    toast.success(`Owner ${status} the booking`);
  };

  return (
    <div className="pb-24 animate-fade-up">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-heading font-bold text-lg">Booking Details</h1>
      </div>

      <div className="mx-4 mt-5 bg-gradient-navy rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <StatusBadge status={b.status} />
          <div className="text-[10px] uppercase tracking-wider opacity-70 font-bold mt-3">Booking ID</div>
          <div className="font-heading text-2xl font-bold">{b.id}</div>
          <div className="text-[12px] opacity-80 mt-1">Booked on {format(new Date(b.createdAt), "dd MMM yyyy")}</div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-card rounded-2xl border border-border p-4">
        <div className="flex gap-3">
          <img src={b.hallImage} alt={b.hallName} className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="font-heading font-bold">{b.hallName}</h3>
            <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{b.hallAddress}</p>
            <button onClick={() => navigate(`/hall/${b.hallId}`)} className="text-[12px] font-bold text-primary mt-1">View hall →</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border text-[13px]">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{format(new Date(b.date), "dd MMM yyyy")}</span></div>
          <div className="flex items-center gap-2"><span>{b.slot === "morning" ? "🌅" : "🌙"}</span><span className="font-semibold capitalize">{b.slot}</span></div>
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{b.guestCount} guests</span></div>
          <div className="flex items-center gap-2"><span>🎉</span><span className="font-semibold">{b.functionType}</span></div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-card rounded-2xl border border-border p-4">
        <h3 className="font-heading font-bold mb-3">Payment</h3>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-muted-foreground">Total amount</span><span className="font-bold">{inr(b.totalAmount)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Paid (5%)</span><span className="font-bold text-success">{inr(b.paidAmount)}</span></div>
          <div className="flex justify-between border-t border-border pt-2"><span className="text-muted-foreground">Pending (at venue)</span><span className="font-bold text-warning">{inr(b.pendingAmount)}</span></div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-primary-light rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">{b.ownerName[0]}</div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hall Owner</div>
          <div className="font-bold">{b.ownerName}</div>
          <div className="text-[12px] text-primary font-semibold">+91 {b.ownerPhone}</div>
        </div>
        <a href={`tel:+91${b.ownerPhone}`} className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center"><Phone className="w-4 h-4" /></a>
        <a href={`https://wa.me/91${b.ownerPhone}`} className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center"><MessageCircle className="w-4 h-4" /></a>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        <button onClick={downloadReceipt} className="h-12 rounded-xl bg-card border border-border font-bold text-[13px] flex items-center justify-center gap-2"><Download className="w-4 h-4" />Receipt</button>
        <button onClick={() => navigator.share?.({ title: "BookMyHall", text: `Booking: ${b.id}` }) || toast.success("Shared!")} className="h-12 rounded-xl bg-card border border-border font-bold text-[13px] flex items-center justify-center gap-2"><Share2 className="w-4 h-4" />Share</button>
      </div>

      {b.status === "pending" && (
        <div className="mx-4 mt-4 space-y-2">
          <p className="text-[11px] text-muted-foreground text-center">Demo: simulate owner response</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => simulateOwner("confirmed")} className="h-10 rounded-xl bg-success-light text-success font-bold text-[12px]">✓ Owner confirms</button>
            <button onClick={() => simulateOwner("rejected")} className="h-10 rounded-xl bg-destructive-light text-destructive font-bold text-[12px]">✗ Owner rejects</button>
          </div>
        </div>
      )}

      {(b.status === "confirmed" || b.status === "pending") && (
        <button onClick={cancel} className="mx-4 mt-4 w-[calc(100%-2rem)] h-12 rounded-xl border-2 border-destructive/30 text-destructive font-bold text-[13px]">Cancel Booking</button>
      )}

      {b.status === "completed" && !b.rated && (
        <button onClick={() => navigate(`/book/${b.hallId}?date=${b.date}&slot=${b.slot}&review=${b.id}`)} className="mx-4 mt-4 w-[calc(100%-2rem)] h-12 rounded-xl bg-gradient-gold text-gold-foreground font-bold text-[13px] flex items-center justify-center gap-2"><Star className="w-4 h-4" />Rate this hall</button>
      )}
    </div>
  );
};

export default BookingDetailPage;