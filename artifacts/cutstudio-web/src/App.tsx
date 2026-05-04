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
      return window.location.hash.replace(/^#\/?/, "") || "/";
    }
    return "/";
  });
  
  useEffect(() => {
    const handleHash = () => {
      setPath(window.location.hash.replace(/^#\/?/, "") || "/");
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

  console.log("Location:", location, "User:", currentUser?.email);

  if (location === "/login") {
    return <Login />;
  }
  
  if (location === "/dashboard") {
    if (!currentUser) {
      window.location.hash = "/login";
      return null;
    }
    return <Dashboard />;
  }
  
  if (location === "/setup" && isSetupMode) {
    return (
      <div style={{ color: 'white', padding: 50, textAlign: 'center', minHeight: '100vh' }}>
        <h2>Setup Wizard</h2>
        <button onClick={() => window.location.hash = "/home"} style={{ marginTop: 20, padding: '10px 20px' }}>
          Go Home
        </button>
      </div>
    );
  }

  // Default: Show Home
  console.log("Showing HOME page");
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
