import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function AppContent() {
  const { currentUser, isLoading, isSetupMode } = useApp();
  const [location, navigate] = useLocation();

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("📍 Current location:", location);
  console.log("👤 User:", currentUser?.email || "None");
  console.log("⚙️ Setup mode:", isSetupMode);

  // Manual redirect logic instead of Redirect component
  useEffect(() => {
    if (location === "/") {
      console.log("🔄 At root, redirecting...");
      if (isSetupMode) {
        navigate("/setup");
      } else if (currentUser) {
        navigate("/dashboard");
      } else {
        navigate("/home"); // Yahan aana chahiye!
      }
    }
  }, [location, currentUser, isSetupMode, navigate]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        
        {/* Root path - fallback */}
        <Route path="/">
          <div style={{ padding: 50, color: "white", background: "#05050d" }}>
            <h2>Redirecting to Home...</h2>
            <p>If stuck, <a href="/home" style={{ color: "#e8a020" }}>click here</a></p>
          </div>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

// Import useEffect
import { useEffect } from "react";

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="noise-overlay" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-1" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-2" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-3" style={{ position: 'fixed', zIndex: 0 }} />
          
          <AppContent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
