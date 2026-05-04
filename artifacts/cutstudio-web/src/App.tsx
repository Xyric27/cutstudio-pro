import { useState, useEffect } from "react";
import { Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import SetupWizard from "@/pages/setup"; // ✅ Setup Wizard imported

function useHashLocation() {
  const [path, setPath] = useState(() => {
    if (typeof window !== 'undefined') {
      let hash = window.location.hash.replace(/^#\/?/, "") || "/";
      hash = hash.replace(/^\.\//, "");
      return hash || "/";
    }
    return "/";
  });
  
  useEffect(() => {
    const handleHash = () => {
      let hash = window.location.hash.replace(/^#\/?/, "") || "/";
      hash = hash.replace(/^\.\//, "");
      setPath(hash || "/");
    };
    
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  
  const navigate = (to: string) => {
    window.location.hash = to;
  };
  
  return [path, navigate] as const;
}

function AppContent() {
  const { currentUser, isLoading, isSetupMode } = useApp();
  const [location] = useHashLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("📍 Location:", location, "| Setup Mode:", isSetupMode);

  // ✅ LOGIN PAGE
  if (location === "login" || location === "/login") {
    console.log("🔐 Showing LOGIN");
    return <Login />;
  }
  
  // ✅ DASHBOARD (Protected)
  if (location === "dashboard" || location === "/dashboard") {
    if (!currentUser) {
      console.log("❌ Not logged in, redirecting...");
      window.location.hash = "login";
      return null;
    }
    console.log("📊 Showing DASHBOARD");
    return <Dashboard />;
  }
  
  // ✅ SETUP WIZARD (Only when isSetupMode is true)
  if ((location === "setup" || location === "/setup")) {
    if (isSetupMode) {
      console.log("🔧 Showing SETUP WIZARD");
      return <SetupWizard />; // ✅ Real setup component
    } else {
      console.log("⚠️ Setup not needed, redirecting home");
      window.location.hash = "home";
      return null;
    }
  }

  // ✅ DEFAULT: HOME PAGE
  console.log("🏠 Showing HOME page");
  return <Home />;
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter 
          base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          hook={useHashLocation}
        >
          {/* Background effects */}
          <div className="noise-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
          <div className="orb orb-1" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-2" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-3" style={{ position: 'fixed', zIndex: 0 }} />
          
          {/* Main content */}
          <main style={{ 
            position: 'relative', 
            zIndex: 1, 
            minHeight: '100vh', 
            backgroundColor: '#05050d' 
          }}>
            <AppContent />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
