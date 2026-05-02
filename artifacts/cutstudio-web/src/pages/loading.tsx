import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";

export default function LoadingScreen() {
  const [_, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setOpacity(0);
            setTimeout(() => setLocation("/home"), 500);
          }, 200);
          return 100;
        }
        return p + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [setLocation]);

  return (
    <div 
      className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#05050d] text-white transition-opacity duration-500 ease-in-out relative overflow-hidden"
      style={{ opacity }}
    >
      <div className="noise-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-3" />
      
      <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <h1 className="font-display text-7xl md:text-9xl tracking-wider mb-4">
          <span className="text-white">CUT</span>
          <span className="text-gradient">STUDIO PRO</span>
        </h1>
        <p className="font-sans text-[#e8a020] uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-12">
          Professional Video Editor Portal
        </p>
        
        <div className="w-64 md:w-80 h-1 bg-[#0a0a16] rounded-full overflow-hidden border border-[#1f1f2e]">
          <div 
            className="h-full bg-gradient-to-r from-[#e8a020] to-[#00e5dc] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00e5dc] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#e040a0] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#e8a020] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
