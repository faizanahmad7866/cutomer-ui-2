import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, ShieldCheck, Navigation, Loader2, MapPin, ChevronDown, User as UserIcon, Lock } from "lucide-react";
import { useApp } from "@/store/appStore";
import { toast } from "sonner";
import { CITIES } from "@/data/halls";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState<"phone" | "otp" | "signup">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [cityOpen, setCityOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const CITY_COORDS: Record<string, [number, number]> = {
    Mumbai: [19.076, 72.8777], Pune: [18.5204, 73.8567], Nagpur: [21.1458, 79.0882],
    Nashik: [19.9975, 73.7898], Amravati: [20.9374, 77.7796], Akola: [20.7096, 77.0021],
    Wardha: [20.7453, 78.6022], Chandrapur: [19.9615, 79.2961],
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error("Location not supported on this device");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let best = CITIES[0]; let min = Infinity;
        Object.entries(CITY_COORDS).forEach(([c, [la, ln]]) => {
          const d = Math.hypot(la - latitude, ln - longitude);
          if (d < min) { min = d; best = c; }
        });
        setCity(best);
        setAddress((a) => a || `Near ${best}`);
        setLocating(false);
        toast.success(`Location set to ${best}`);
      },
      () => { setLocating(false); toast.error("Unable to get your location"); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const sendOtp = () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    toast.success("OTP sent! Use 1234 to continue");
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp !== "1234") {
      toast.error("Wrong OTP. Try 1234");
      return;
    }
    // Simulate: existing user logs in directly, new user fills signup
    setStep("signup");
  };

  const completeSignup = () => {
    if (!name || !address) {
      toast.error("Please fill all details");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name,
      phone,
      address,
      city,
    });
    toast.success(`Welcome, ${name}!`);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="h-14 px-4 flex items-center border-b border-border/60">
          <button
            onClick={() => (step === "phone" ? navigate(-1) : setStep("phone"))}
            className="w-10 h-10 rounded-xl hover:bg-muted/60 flex items-center justify-center transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="font-heading text-[15px] font-semibold text-foreground tracking-tight">BookMyHall</span>
          </div>
        </header>

        <div className="flex-1 px-5 pt-8 pb-10">
          {step === "phone" && (
            <>
              <h1 className="font-heading text-[28px] leading-tight font-bold text-foreground">Welcome back</h1>
              <p className="text-[14px] text-muted-foreground mt-1.5">
                Login or sign up to book the perfect hall for your event
              </p>

              <div className="mt-8">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="mt-2 flex items-center h-14 rounded-xl border border-border bg-card px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="ml-3 font-semibold text-foreground border-r border-border pr-3">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit number"
                    className="flex-1 ml-3 bg-transparent outline-none text-base font-semibold tracking-wide"
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={phone.length !== 10}
                className="w-full h-14 mt-6 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] shadow-soft active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>

              <div className="flex items-center gap-2 mt-6 text-[11px] text-muted-foreground justify-center">
                <Lock className="w-3 h-3" />
                <span>Secured with 256-bit encryption</span>
              </div>
              <p className="text-[11px] text-muted-foreground/80 text-center mt-3 leading-relaxed">
                By continuing you agree to our <span className="text-primary font-semibold">Terms</span> &amp; <span className="text-primary font-semibold">Privacy Policy</span>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="font-heading text-[28px] leading-tight font-bold text-foreground">Verify mobile</h1>
              <p className="text-[14px] text-muted-foreground mt-1.5">
                Code sent to <span className="font-semibold text-foreground">+91 {phone}</span>
              </p>
              <p className="text-[12px] text-info font-semibold mt-1">Demo OTP: 1234</p>

              <div className="mt-8">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full h-16 text-center text-3xl font-bold tracking-[1rem] rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.length !== 4}
                className="w-full h-14 mt-6 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] shadow-soft active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShieldCheck className="w-5 h-5" /> Verify
              </button>

              <button
                onClick={() => toast.success("OTP sent again")}
                className="w-full text-[13px] text-muted-foreground mt-5"
              >
                Didn't receive it? <span className="text-primary font-bold">Resend OTP</span>
              </button>
            </>
          )}

          {step === "signup" && (
            <>
              <h1 className="font-heading text-[28px] leading-tight font-bold text-foreground">Complete your profile</h1>
              <p className="text-[14px] text-muted-foreground mt-1.5">
                A few details so owners can reach you
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="mt-2 flex items-center h-12 rounded-xl border border-border bg-card px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="As per ID proof"
                      className="flex-1 ml-2.5 bg-transparent outline-none text-[14px] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      City
                    </label>
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={locating}
                      className="text-[11px] font-bold text-primary inline-flex items-center gap-1 disabled:opacity-60"
                    >
                      {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                      {locating ? "Detecting..." : "Auto-detect"}
                    </button>
                  </div>
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setCityOpen((o) => !o)}
                      className="w-full h-12 px-3 rounded-xl border border-border bg-card flex items-center justify-between text-[14px] font-semibold text-foreground hover:border-primary/40 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {city}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${cityOpen ? "rotate-180" : ""}`} />
                    </button>
                    {cityOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-elevated max-h-60 overflow-y-auto z-10">
                        {CITIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setCity(c); setCityOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-[14px] font-semibold hover:bg-muted/60 transition-colors ${c === city ? "text-primary bg-primary-light/40" : "text-foreground"}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, street, area, landmark"
                    rows={3}
                    className="mt-2 w-full px-3.5 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-[14px] font-medium resize-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={completeSignup}
                className="w-full h-14 mt-7 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] shadow-soft active:scale-[0.98] transition-all"
              >
                Create my account
              </button>
              <p className="text-[11px] text-muted-foreground/80 text-center mt-3">
                Your details are kept private and shared only with the hall owner you book with.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;