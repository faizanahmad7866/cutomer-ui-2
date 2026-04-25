import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Phone, Download, Share2, Star, MessageCircle, Sun, Moon, Smartphone, CreditCard, Landmark, Info, Leaf, Drumstick, ShieldCheck, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { HALLS, FUNCTION_TYPES } from "@/data/halls";
import { useApp } from "@/store/appStore";
import { inr, advanceOf, pendingOf, generateBookingId } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Booking } from "@/types";

const BookingFlowPage = () => {
  const { hallId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, addBooking, addReview, bookings } = useApp();

  const hall = HALLS.find((h) => h.id === hallId);
  const dateISO = params.get("date") || format(new Date(), "yyyy-MM-dd");
  const slot = (params.get("slot") as "morning" | "night") || "morning";

  const totalAmount = slot === "morning" ? (hall?.priceMorning ?? 0) : (hall?.priceNight ?? 0);
  const advance = advanceOf(totalAmount);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [funcType, setFuncType] = useState("Wedding");
  const [guests, setGuests] = useState(100);
  const [foodPref, setFoodPref] = useState<"veg" | "nonveg">("veg");
  const [bookingId] = useState(generateBookingId());
  const [paying, setPaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const createdBooking = useMemo(() => bookings.find((b) => b.id === bookingId), [bookings, bookingId]);

  if (!hall) return <div className="p-10 text-center">Hall not found</div>;

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Please login to book a hall</p>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Login</button>
      </div>
    );
  }

  const submitDetails = () => {
    if (!name.trim() || !address.trim()) return toast.error("Please fill all details");
    if (!user.name) login({ ...user, name, address });
    setStep(2);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      const newBooking: Booking = {
        id: bookingId,
        hallId: hall.id,
        hallName: hall.name,
        hallImage: hall.images[0],
        hallAddress: `${hall.address}, ${hall.city}`,
        ownerName: hall.ownerName,
        ownerPhone: hall.ownerPhone,
        customerName: name,
        customerPhone: user.phone,
        customerAddress: address,
        date: dateISO,
        slot,
        guestCount: guests,
        functionType: funcType,
        foodPreference: foodPref,
        totalAmount,
        paidAmount: advance,
        pendingAmount: pendingOf(totalAmount),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      addBooking(newBooking);
      setPaying(false);
      setStep(3);
      toast.success("Payment successful!");
    }, 1500);
  };

  const downloadReceipt = () => {
    if (!createdBooking) return;
    generateProPdf(createdBooking);
    toast.success("Receipt downloaded");
  };

  const submitReview = () => {
    if (rating === 0) return toast.error("Please give a rating");
    addReview(bookingId, rating, reviewText);
    toast.success("Thank you for your feedback!");
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => step > 1 && step < 3 ? setStep(step - 1) : navigate(-1)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading font-bold text-lg">Book {hall.name}</h1>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-1">
          {[1,2,3,4].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-1">
              <div className={cn("flex-1 h-1 rounded-full", n <= step ? "bg-gold" : "bg-border")} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className={step >= 1 ? "text-primary" : ""}>Details</span>
          <span className={step >= 2 ? "text-primary" : ""}>Payment</span>
          <span className={step >= 3 ? "text-primary" : ""}>Receipt</span>
          <span className={step >= 4 ? "text-primary" : ""}>Review</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mx-4 mt-5 p-4 bg-card rounded-2xl border border-border shadow-soft flex gap-3">
        <img src={hall.images[0]} alt={hall.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1">
          <h3 className="font-heading font-bold text-foreground">{hall.name}</h3>
          <p className="text-[12px] text-muted-foreground">{hall.area}, {hall.city}</p>
          <div className="flex gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-primary-light text-primary rounded-md">
              {slot === "morning" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {slot === "morning" ? "Morning" : "Night"}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-muted text-foreground rounded-md tabular-nums">{format(new Date(dateISO), "dd MMM yyyy")}</span>
          </div>
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="px-4 pt-5 space-y-4 animate-fade-up">
          <h2 className="font-heading font-bold text-lg">Your details</h2>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 mt-1.5 bg-card" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mobile (registered)</label>
            <div className="h-12 mt-1.5 bg-muted border border-border rounded-md px-3 flex items-center font-semibold">+91 {user.phone}</div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Address *</label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-1.5 bg-card" />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Function Type *</label>
            <div className="flex gap-2 overflow-x-auto scrollbar-none mt-2 -mx-4 px-4 pb-1">
              {FUNCTION_TYPES.map((f) => (
                <button key={f.value} onClick={() => setFuncType(f.value)}
                  className={cn("shrink-0 h-11 px-4 rounded-full border text-[12px] font-semibold transition-all whitespace-nowrap",
                    funcType === f.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground")}>
                  {f.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Number of guests *</label>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setGuests((g) => Math.max(10, g - 10))} className="w-12 h-12 bg-muted rounded-xl text-2xl font-bold active:scale-90">−</button>
              <div className="flex-1 h-12 bg-card rounded-xl border-2 border-primary flex items-center justify-center text-xl font-bold text-primary">{guests}</div>
              <button onClick={() => setGuests((g) => Math.min(hall.capacity, g + 10))} className="w-12 h-12 bg-muted rounded-xl text-2xl font-bold active:scale-90">+</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Max capacity: {hall.capacity.toLocaleString()}</p>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Food preference *</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {([["veg", "Pure Veg", Leaf], ["nonveg", "Non-Veg", Drumstick]] as const).map(([v, l, Icon]) => (
                <button key={v} onClick={() => setFoodPref(v as any)}
                  className={cn("h-12 rounded-xl border flex items-center justify-center gap-2 text-[13px] font-semibold transition-all",
                    foodPref === v ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground")}>
                  <Icon className="w-4 h-4" strokeWidth={1.8} /> {l}
                </button>
              ))}
            </div>
          </div>

          <button onClick={submitDetails} className="w-full h-14 bg-gradient-gold text-gold-foreground font-bold text-base rounded-2xl shadow-gold active:scale-[0.98]">
            Continue to Payment
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="px-4 pt-5 space-y-4 animate-fade-up">
          <h2 className="font-heading font-bold text-lg">Payment summary</h2>
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Slot price</span><span className="font-bold">{inr(totalAmount)}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Advance (5%)</span><span className="font-bold text-success">{inr(advance)}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Pay later at venue</span><span className="font-bold">{inr(pendingOf(totalAmount))}</span></div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-heading font-bold">Pay now</span>
              <span className="font-heading font-bold text-2xl text-primary">{inr(advance)}</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-2">Choose payment method</h3>
            <div className="space-y-2">
              {[
                { id: "upi", Icon: Smartphone, label: "UPI", sub: "Google Pay, PhonePe, Paytm" },
                { id: "card", Icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                { id: "netbank", Icon: Landmark, label: "Net Banking", sub: "All major banks" },
              ].map((m, i) => (
                <div key={m.id} className={cn("p-3 rounded-xl border flex items-center gap-3", i === 0 ? "border-primary bg-primary-light" : "border-border bg-card")}>
                  <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                    <m.Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-foreground">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.sub}</div>
                  </div>
                  <input type="radio" name="pay" defaultChecked={i === 0} className="accent-primary w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-info-light border border-info/20 rounded-xl p-3 flex gap-2 text-[12px] text-info font-medium">
            <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
            <span>If the owner cancels, you get a full refund. If you cancel, a 3% payment gateway fee applies.</span>
          </div>

          <button onClick={handlePay} disabled={paying} className="w-full h-14 bg-gradient-gold text-gold-foreground font-bold text-base rounded-2xl shadow-gold active:scale-[0.98] disabled:opacity-60">
            {paying ? "Processing..." : `Pay ${inr(advance)} & Book`}
          </button>
        </div>
      )}

      {/* Step 3: Receipt */}
      {step === 3 && (
        <div className="px-4 pt-5 space-y-4 animate-scale-in">
          <div className="text-center py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-success-light flex items-center justify-center mb-3">
              <Check className="w-10 h-10 text-success" strokeWidth={3} />
            </div>
            <h2 className="font-heading font-bold text-2xl">Booking placed!</h2>
            <p className="text-sm text-muted-foreground">Awaiting owner confirmation</p>
          </div>

          <div className="bg-card rounded-2xl border-2 border-dashed border-primary p-4">
            <div className="text-center pb-3 border-b border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Booking ID</div>
              <div className="font-heading text-xl font-bold text-primary">{bookingId}</div>
            </div>
            <div className="space-y-2 mt-3 text-[13px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Hall</span><span className="font-bold text-right">{hall.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date & Slot</span><span className="font-bold">{format(new Date(dateISO), "dd MMM")} · {slot}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-bold">{guests}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Function</span><span className="font-bold">{funcType}</span></div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold">{inr(totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-bold text-success">{inr(advance)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-bold text-warning">{inr(pendingOf(totalAmount))}</span></div>
            </div>
          </div>

          <div className="bg-primary-light rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">{hall.ownerName[0]}</div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Hall Owner</div>
              <div className="font-bold text-foreground">{hall.ownerName}</div>
              <div className="text-[12px] text-primary font-semibold">+91 {hall.ownerPhone}</div>
            </div>
            <a href={`tel:+91${hall.ownerPhone}`} className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center"><Phone className="w-4 h-4" /></a>
            <a href={`https://wa.me/91${hall.ownerPhone}`} className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center"><MessageCircle className="w-4 h-4" /></a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={downloadReceipt} className="h-12 rounded-xl bg-card border border-border font-bold text-[13px] flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download PDF</button>
            <button onClick={() => navigator.share?.({ title: "BookMyHall booking", text: `My booking ID: ${bookingId}` }) || toast.success("Shared!")} className="h-12 rounded-xl bg-card border border-border font-bold text-[13px] flex items-center justify-center gap-2"><Share2 className="w-4 h-4" />Share</button>
          </div>

          <button onClick={() => setStep(4)} className="w-full h-14 bg-gradient-gold text-gold-foreground font-bold text-base rounded-2xl shadow-gold">
            Rate your experience
          </button>
          <button onClick={() => navigate("/bookings")} className="w-full text-sm font-bold text-primary py-2">Skip — Go to my bookings</button>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="px-4 pt-5 space-y-5 animate-fade-up">
          <h2 className="font-heading font-bold text-xl text-center">How was your booking experience?</h2>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                <Star className={cn("w-10 h-10 transition-all", s <= rating ? "fill-gold text-gold scale-110" : "text-border")} />
              </button>
            ))}
          </div>
          <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience (optional)" rows={4} className="bg-card" />
          <button onClick={submitReview} className="w-full h-14 bg-gradient-gold text-gold-foreground font-bold text-base rounded-2xl shadow-gold">
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingFlowPage;