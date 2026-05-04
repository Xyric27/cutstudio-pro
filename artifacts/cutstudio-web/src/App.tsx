import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

// ✅ CUSTOM HASH LOCATION HOOK (No dependency issues!)
function useHashLocation() {
  const [path, setPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.replace(/^#\/?/, "") || "/";
    }
    return "/";
  });
  
  useEffect(() => {
    const handleHash = () => {
      const newPath = window.location.hash.replace(/^#\/?/, "") || "/";
      setPath(newPath);
    };
    
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  
  const navigate = (to: string) => {
    window.location.hash = to;
  };
  
  return [path, navigate] as const;
}

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function AppRoutes() {
  const { currentUser, isLoading, isSetupMode } = useApp();

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("🎯 App ready - User:", currentUser?.email || "Guest");

  return (
    <Switch>
      {/* Root redirect */}
      <Route path="/">
        {currentUser ? (
          <WouterRouter.Redirect to="/dashboard" />
        ) : (
          <WouterRouter.Redirect to="/home" />
        )}
      </Route>
      
      {/* Public routes */}
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* Setup mode route */}
      {isSetupMode && (
        <Route path="/setup" component={() => (
          <div style={{ color: 'white', padding: 50, textAlign: 'center' }}>
            <h2>Setup Wizard</h2>
            <p>Create your first admin account</p>
          </div>
        )} />
      )}
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        {/* ✅ HASH ROUTING WITH CUSTOM HOOK! */}
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
            <AppRoutes />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
