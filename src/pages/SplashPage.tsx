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
        <div className="w-20 h-20 rounded-3xl bg-gold flex items-center justify-center mb-5 shadow-gold">
          <span className="text-3xl">🏛️</span>
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Book<span className="text-gold-light">My</span>Hall
        </h1>
        <p className="text-sm text-primary-foreground/70 mt-2">Find the perfect hall in your city</p>
        <div className="mt-10 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;