// App.tsx (without Router)
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/store";
import Home from "@/pages/home";     // ← ya jo page chahiye

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <div className="noise-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <Home />                       {/* ← Seedha page render */}
      </TooltipProvider>
      <Toaster />
    </AppProvider>
  );
}

export default App;
