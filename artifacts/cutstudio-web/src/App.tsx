import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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

// ✅ SEPARATE COMPONENT for routing logic (hooks must be inside Router)
function AppRoutes() {
  const { currentUser, isLoading, isSetupMode } = useApp();

  // Show loading screen while data loads
  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("🎯 App ready - User:", currentUser?.email || "Guest", "| Setup:", isSetupMode);

  // Simple redirect component
  const RootRedirect = () => {
    if (isSetupMode) return <Redirect to="/setup" />;
    if (currentUser) return <Redirect to="/dashboard" />;
    return <Redirect to="/home" />; // Default redirect
  };

  return (
    <Switch>
      {/* Root path - handles redirect logic */}
      <Route path="/" component={RootRedirect} />
      
      {/* Public routes */}
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {/* Background effects - fixed position */}
          <div className="noise-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
          <div className="orb orb-1" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-2" style={{ position: 'fixed', zIndex: 0 }} />
          <div className="orb orb-3" style={{ position: 'fixed', zIndex: 0 }} />
          
          {/* Main content */}
          <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            <AppRoutes />
          </main>
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
