import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";
import { useApp } from "@/store/appStore";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState<"phone" | "otp" | "signup">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");

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
        <header className="h-14 px-4 flex items-center">
          <button
            onClick={() => (step === "phone" ? navigate(-1) : setStep("phone"))}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </header>

        <div className="flex-1 px-6 pt-6 pb-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="font-heading text-[22px] font-medium text-foreground tracking-tight">BookMyHall</span>
          </div>

          {step === "phone" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">Login or Sign up</h1>
              <p className="text-sm text-muted-foreground mt-1">
                We will send a one-time password to your mobile
              </p>

              <div className="mt-8">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="mt-2 flex items-center h-14 rounded-2xl border-2 border-border bg-card px-4 focus-within:border-primary transition-colors">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="ml-3 font-semibold text-foreground">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="flex-1 ml-3 bg-transparent outline-none text-base font-semibold"
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                className="w-full h-14 mt-6 rounded-2xl bg-gradient-gold text-primary font-bold text-base shadow-gold active:scale-[0.98] transition-transform"
              >
                Send OTP
              </button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">Enter OTP</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sent to +91 {phone}. <span className="text-primary font-semibold">Demo OTP: 1234</span>
              </p>

              <div className="mt-8">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full h-16 text-center text-3xl font-bold tracking-[1rem] rounded-2xl border-2 border-border bg-card focus:border-primary outline-none transition-colors"
                />
              </div>

              <button
                onClick={verifyOtp}
                className="w-full h-14 mt-6 rounded-2xl bg-gradient-gold text-primary font-bold text-base shadow-gold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Verify & Continue
              </button>

              <button
                onClick={() => toast.success("OTP sent again")}
                className="w-full text-sm text-muted-foreground mt-4"
              >
                Didn't get it? <span className="text-primary font-semibold">Resend OTP</span>
              </button>
            </>
          )}

          {step === "signup" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">Complete your profile</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Just a few details to start booking halls
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full h-12 px-4 rounded-xl border-2 border-border bg-card focus:border-primary outline-none text-base font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full h-12 px-4 rounded-xl border-2 border-border bg-card focus:border-primary outline-none text-base font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, area, landmark"
                    rows={3}
                    className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-border bg-card focus:border-primary outline-none text-base font-medium resize-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={completeSignup}
                className="w-full h-14 mt-6 rounded-2xl bg-gradient-gold text-primary font-bold text-base shadow-gold active:scale-[0.98] transition-transform"
              >
                Start Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;