import { useState, useEffect } from "react";
import { Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

// Custom hash location hook
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

  // Loading state
  if (isLoading) {
    console.log("⏳ Loading...");
    return <LoadingScreen />;
  }

  console.log("📍 Location:", location);
  console.log("👤 User:", currentUser?.email || "Guest");
  console.log("⚙️ Setup:", isSetupMode);

  // ✅ DIRECT RENDER BASED ON LOCATION
  switch (location) {
    case "/login":
      console.log("🔐 Showing LOGIN page");
      return <Login />;
      
    case "/dashboard":
      if (!currentUser) {
        console.log("❌ Not logged in, redirecting to login");
        window.location.hash = "/login";
        return null;
      }
      console.log("📊 Showing DASHBOARD");
      return <Dashboard />;
      
    case "/setup":
      if (isSetupMode) {
        console.log("🔧 Showing SETUP page");
        return (
          <div style={{ color: 'white', padding: 50, textAlign: 'center', minHeight: '100vh', backgroundColor: '#05050d' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Setup Wizard</h2>
            <p>Create your first admin account</p>
            <button 
              onClick={() => window.location.hash = "/home"}
              style={{
                marginTop: '30px',
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #e8a020, #e040a0)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Go to Home
            </button>
          </div>
        );
      }
      // If not in setup mode, redirect to home
      console.log("⚠️ Not setup mode, going home");
      window.location.hash = "/home";
      return null;
      
    case "/home":
    default:
      console.log("🏠 Showing HOME page!!!!!");
      return <Home />;
  }
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
          }>
            <AppContent />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
