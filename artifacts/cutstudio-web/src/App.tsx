import { useState, useEffect } from "react";
import { Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

function useHashLocation() {
  const [path, setPath] = useState(() => {
    if (typeof window !== 'undefined') {
      // ✅ FIX: Clean the path - remove ./ and #/
      let hash = window.location.hash.replace(/^#\/?/, "") || "/";
      hash = hash.replace(/^\.\//, ""); // Remove ./
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

  console.log("📍 Clean Location:", location);

  // ✅ FIXED: Proper path matching
  if (location === "login" || location === "/login") {
    console.log("🔐 Showing LOGIN");
    return <Login />;
  }
  
  if (location === "dashboard" || location === "/dashboard") {
    if (!currentUser) {
      window.location.hash = "login";
      return null;
    }
    console.log("📊 Showing DASHBOARD");
    return <Dashboard />;
  }
  
  if ((location === "setup" || location === "/setup") && isSetupMode) {
    return (
      <div style={{ color: 'white', padding: 50, textAlign: 'center', minHeight: '100vh' }}>
        <h2>Setup Wizard</h2>
        <button onClick={() => window.location.hash = "home"} style={{ marginTop: 20 }}>
          Go Home
        </button>
      </div>
    );
  }

  // Default: Show Home for "/" or "home" or anything else
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
          <div className="noise-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
          <div className="orb orb-1" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-2" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-3" style={{ position: 'fixed', zIndex: 0 }} />
          
          <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', backgroundColor: '#05050d' }}>
            <AppContent />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
