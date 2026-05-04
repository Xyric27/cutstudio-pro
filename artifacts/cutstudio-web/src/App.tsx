import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
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

function AppRoutes() {
  const { currentUser, isLoading, isSetupMode } = useApp();
  const [location] = useLocation();

  // LOADING STATE
  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("🌐 Location:", location, "| User:", currentUser?.email || "Guest");

  return (
    <Switch>
      {/* HOME - Default/Landing page */}
      <Route path="/home" component={Home} />
      
      {/* LOGIN */}
      <Route path="/login" component={Login} />
      
      {/* DASHBOARD - Protected */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* SETUP (if needed) */}
      {isSetupMode && (
        <Route path="/setup" component={() => <div style={{color:'white',padding:50}}>Setup Page</div>} />
      )}
      
      {/* ROOT Redirect */}
      <Route path="/">
        {currentUser ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/home" />
        )}
      </Route>
      
      {/* 404 - Catches all unknown routes */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Client-side redirect for 404 fix
function RouteHandler() {
  const [location] = useLocation();
  
  useEffect(() => {
    // If not at a valid route, redirect to home
    if (!['/', '/home', '/login', '/dashboard', '/setup'].includes(location)) {
      console.log('⚠️ Unknown route, redirecting to /home');
      window.location.href = '/home';
    }
  }, [location]);

  return <AppRoutes />;
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
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
            <RouteHandler />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

