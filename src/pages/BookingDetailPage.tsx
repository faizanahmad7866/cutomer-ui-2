import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Download, Share2, Star, MapPin, Calendar, Users, Sun, Moon, PartyPopper, CheckCircle2, Clock, Receipt, Copy } from "lucide-react";
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
    generatePdfReceipt(b);
    toast.success("Receipt downloaded");
  };

  const copyId = () => {
    navigator.clipboard?.writeText(b.id);
    toast.success("Booking ID copied");
  };

  const cancel = () => {
    if (!confirm(`Cancel this booking? Refund: ${inr(refundOnCancel(b.totalAmount))} (3% gateway charge applies)`)) return;
    updateBookingStatus(b.id, "cancelled");
    toast.success("Booking cancelled. Refund will be processed in 5-7 days.");
  };

  return (
    <div className="pb-24 md:pb-10 max-w-3xl mx-auto animate-fade-up">
      {/* App bar */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl hover:bg-muted/60 flex items-center justify-center transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-heading font-bold text-[17px]">Booking details</h1>
      </div>

      {/* Status hero */}
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {b.status === "confirmed" ? (
              <div className="w-9 h-9 rounded-full bg-success-light flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success" /></div>
            ) : b.status === "pending" ? (
              <div className="w-9 h-9 rounded-full bg-warning-light flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Receipt className="w-5 h-5 text-muted-foreground" /></div>
            )}
            <div>
              <div className="font-heading font-bold text-[15px] text-foreground capitalize">{b.status === "pending" ? "Awaiting confirmation" : b.status}</div>
              <div className="text-[11px] text-muted-foreground">Booked on {format(new Date(b.createdAt), "dd MMM yyyy, hh:mm a")}</div>
            </div>
          </div>
          <StatusBadge status={b.status} />
        </div>
        <button onClick={copyId} className="w-full px-5 py-3 flex items-center justify-between bg-muted/30 active:bg-muted/60 transition-colors">
          <div className="text-left">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Booking ID</div>
            <div className="font-mono font-bold text-[15px] text-foreground">{b.id}</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
            <Copy className="w-3.5 h-3.5" /> Copy
          </div>
        </button>
      </div>

      {/* Hall card */}
      <div className="mx-4 mt-3 bg-card rounded-2xl border border-border overflow-hidden">
        <button onClick={() => navigate(`/hall/${b.hallId}`)} className="w-full flex gap-3 p-3 text-left active:bg-muted/30 transition-colors">
          <img src={b.hallImage} alt={b.hallName} className="w-[72px] h-[72px] rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-[15px] text-foreground truncate">{b.hallName}</h3>
            <p className="text-[12px] text-muted-foreground flex items-start gap-1 mt-0.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" /><span className="line-clamp-2">{b.hallAddress}</span></p>
            <span className="text-[11px] font-bold text-primary mt-1 inline-block">View hall details →</span>
          </div>
        </button>
        <div className="grid grid-cols-2 border-t border-border">
          {[
            { Icon: Calendar, l: "Date", v: format(new Date(b.date), "dd MMM yyyy") },
            { Icon: b.slot === "morning" ? Sun : Moon, l: "Slot", v: b.slot === "morning" ? "Morning · 6 AM–2 PM" : "Night · 6 PM–2 AM" },
            { Icon: Users, l: "Guests", v: `${b.guestCount}` },
            { Icon: PartyPopper, l: "Function", v: b.functionType },
          ].map((it, i) => (
            <div key={i} className={`p-3 flex items-start gap-2 ${i % 2 === 0 ? "border-r border-border" : ""} ${i < 2 ? "border-b border-border" : ""}`}>
              <it.Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={2} />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{it.l}</div>
                <div className="text-[13px] font-semibold text-foreground truncate">{it.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment summary */}
      <div className="mx-4 mt-3 bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-[15px]">Payment summary</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">INR</span>
        </div>
        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between"><span className="text-muted-foreground">Slot price</span><span className="font-semibold text-foreground tabular-nums">{inr(b.totalAmount)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Advance paid (5%)</span><span className="font-semibold text-success tabular-nums">− {inr(b.paidAmount)}</span></div>
          <div className="border-t border-dashed border-border pt-2.5 flex justify-between items-baseline">
            <span className="font-bold text-foreground">Pending at venue</span>
            <span className="font-heading font-bold text-[18px] text-foreground tabular-nums">{inr(b.pendingAmount)}</span>
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-lg bg-info-light/60 text-[11px] text-info font-medium leading-relaxed">
          Pay the balance directly to the hall owner on event day. Cash, UPI and bank transfer accepted.
        </div>
      </div>

      {/* Owner contact */}
      <div className="mx-4 mt-3 bg-card rounded-2xl border border-border p-4">
        <h3 className="font-heading font-bold text-[15px] mb-3">Hall owner</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-navy text-primary-foreground flex items-center justify-center font-bold text-[16px]">{b.ownerName[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px] text-foreground truncate">{b.ownerName}</div>
            <div className="text-[12px] text-muted-foreground">+91 {b.ownerPhone}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a href={`tel:+91${b.ownerPhone}`} className="h-11 rounded-xl bg-card border border-border text-foreground flex items-center justify-center gap-2 text-[13px] font-bold active:scale-[0.98] transition-transform"><Phone className="w-4 h-4 text-primary" />Call owner</a>
          <a href={`https://wa.me/91${b.ownerPhone}`} className="h-11 rounded-xl bg-success text-white flex items-center justify-center gap-2 text-[13px] font-bold active:scale-[0.98] transition-transform"><MessageCircle className="w-4 h-4" />WhatsApp</a>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <button onClick={downloadReceipt} className="h-12 rounded-xl bg-primary text-primary-foreground font-bold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"><Download className="w-4 h-4" />Download receipt</button>
        <button onClick={() => navigator.share?.({ title: "BookMyHall", text: `Booking: ${b.id}` }) || toast.success("Shared!")} className="h-12 rounded-xl bg-card border border-border font-bold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"><Share2 className="w-4 h-4" />Share</button>
      </div>

      {(b.status === "confirmed" || b.status === "pending") && (
        <button onClick={cancel} className="mx-4 mt-3 w-[calc(100%-2rem)] h-12 rounded-xl border border-destructive/30 text-destructive font-bold text-[13px] hover:bg-destructive/5 transition-colors">Cancel booking</button>
      )}

      {b.status === "completed" && !b.rated && (
        <button onClick={() => navigate(`/book/${b.hallId}?date=${b.date}&slot=${b.slot}&review=${b.id}`)} className="mx-4 mt-3 w-[calc(100%-2rem)] h-12 rounded-xl bg-gradient-gold text-gold-foreground font-bold text-[13px] flex items-center justify-center gap-2"><Star className="w-4 h-4" />Rate this hall</button>
      )}

      <p className="text-center text-[10px] text-muted-foreground/70 mt-6 tracking-wider px-4">
        Need help with this booking? WhatsApp us at +91 99999 88888
      </p>
    </div>
  );
};

export default BookingDetailPage;

// ---------- Professional PDF receipt ----------
function generatePdfReceipt(b: ReturnType<typeof Object> & any) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;

  // Header band
  doc.setFillColor(26, 60, 110);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("BookMyHall", M, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Trusted hall booking platform", M, 56);
  doc.text("support@bookmyhall.online  ·  +91 99999 88888", M, 70);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BOOKING RECEIPT", W - M, 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Issued: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, W - M, 56, { align: "right" });
  doc.text(`Status: ${b.status.toUpperCase()}`, W - M, 70, { align: "right" });

  // Booking ID box
  let y = 120;
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 249, 251);
  doc.roundedRect(M, y, W - M * 2, 50, 6, 6, "FD");
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text("BOOKING ID", M + 14, y + 18);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(b.id, M + 14, y + 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Event Date", W - M - 14, y + 18, { align: "right" });
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${format(new Date(b.date), "dd MMM yyyy")} · ${b.slot}`, W - M - 14, y + 38, { align: "right" });

  // Section helper
  const section = (title: string, rows: [string, string][], startY: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(26, 60, 110);
    doc.text(title.toUpperCase(), M, startY);
    doc.setDrawColor(220, 220, 220);
    doc.line(M, startY + 4, W - M, startY + 4);
    let cy = startY + 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    rows.forEach(([k, v]) => {
      doc.setTextColor(120, 120, 120);
      doc.text(k, M, cy);
      doc.setTextColor(20, 20, 20);
      doc.setFont("helvetica", "bold");
      doc.text(v, W - M, cy, { align: "right" });
      doc.setFont("helvetica", "normal");
      cy += 16;
    });
    return cy + 8;
  };

  y = 200;
  y = section("Venue", [
    ["Hall name", b.hallName],
    ["Address", b.hallAddress.length > 50 ? b.hallAddress.substring(0, 50) + "…" : b.hallAddress],
    ["Owner", `${b.ownerName} (+91 ${b.ownerPhone})`],
  ], y);

  y = section("Customer", [
    ["Name", b.customerName],
    ["Phone", `+91 ${b.customerPhone}`],
    ["Address", b.customerAddress.length > 50 ? b.customerAddress.substring(0, 50) + "…" : b.customerAddress],
  ], y);

  y = section("Event", [
    ["Function type", b.functionType],
    ["Number of guests", String(b.guestCount)],
    ["Slot", b.slot === "morning" ? "Morning (6 AM – 2 PM)" : "Night (6 PM – 2 AM)"],
  ], y);

  // Payment summary box
  doc.setFillColor(248, 249, 251);
  doc.roundedRect(M, y, W - M * 2, 110, 6, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(26, 60, 110);
  doc.text("PAYMENT SUMMARY", M + 14, y + 20);
  const fmt = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const payRows: [string, string][] = [
    ["Slot price", fmt(b.totalAmount)],
    ["Advance paid (5%)", fmt(b.paidAmount)],
  ];
  let py = y + 40;
  payRows.forEach(([k, v]) => {
    doc.setTextColor(120, 120, 120); doc.text(k, M + 14, py);
    doc.setTextColor(20, 20, 20); doc.setFont("helvetica", "bold"); doc.text(v, W - M - 14, py, { align: "right" });
    doc.setFont("helvetica", "normal"); py += 16;
  });
  doc.setDrawColor(200, 200, 200);
  doc.line(M + 14, py, W - M - 14, py);
  py += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(26, 60, 110);
  doc.text("Pending at venue", M + 14, py);
  doc.text(fmt(b.pendingAmount), W - M - 14, py, { align: "right" });

  y += 130;

  // Footer notes
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 110);
  const notes = [
    "• Pay the balance directly to the hall owner on event day (cash / UPI / bank transfer accepted).",
    "• Cancellation by customer: 3% payment-gateway fee is non-refundable. Refund processed in 5–7 days.",
    "• If the owner cancels for any reason, you receive a 100% refund.",
    "• Carry a copy of this receipt or your booking ID on event day.",
  ];
  notes.forEach((n) => { doc.text(n, M, y); y += 12; });

  // Footer bar
  const fy = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(220, 220, 220);
  doc.line(M, fy - 8, W - M, fy - 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("This is a computer-generated receipt and does not require a signature.", M, fy);
  doc.text("bookmyhall.online", W - M, fy, { align: "right" });

  doc.save(`BookMyHall-${b.id}.pdf`);
}