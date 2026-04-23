import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/", { replace: true }), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-navy flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center animate-fade-up">
        <div className="w-2 h-2 rounded-full bg-gold mb-6 shadow-gold" />
        <h1 className="font-heading text-[44px] font-medium tracking-tight leading-none">BookMyHall</h1>
        <p className="text-[12px] text-primary-foreground/70 mt-3 uppercase tracking-[0.24em]">Venues, simplified</p>
        <div className="mt-12 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;