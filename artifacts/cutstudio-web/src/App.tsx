import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import { SetupWizard } from "@/components/ui/SetupWizard"; // ✅ Your path: /ui/SetupWizard
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

/**
 * Protected Route Component
 * Redirects to login if user not authenticated
 */
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { currentUser, isLoading, firebaseReady } = useApp();
  
  // Still loading or Firebase not ready
  if (isLoading || !firebaseReady) {
    return <LoadingScreen />;
  }
  
  // Not logged in → redirect to login
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

/**
 * Main Router Configuration
 */
function Router() {
  const { isLoading, isSetupMode, currentUser, firebaseReady } = useApp();

  return (
    <Switch>
      {/* ─── PUBLIC ROUTES ─── */}
      
      {/* Home/Landing Page */}
      <Route path="/home" component={Home} />
      
      {/* Login Page - always accessible */}
      <Route path="/login" component={Login} />
      
      {/* ✅ Setup Wizard Route - Always defined but conditionally renders */}
      <Route 
        path="/setup" 
        component={() => {
          // If NOT in setup mode, redirect to login
          if (!isSetupMode) {
            return <Redirect to="/login" />;
          }
          // If in setup mode, show the wizard
          return <SetupWizard />;
        }} 
      />
      
      {/* ─── PROTECTED ROUTES ─── */}
      
      {/* Dashboard - requires authentication */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* Default redirect */}
      <Route path="/" component={LoadingScreen} />
      
      {/* 404 Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root App Component
 */
function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_PATH.replace(/\/$/, "")}>
          {/* Background Effects */}
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          
          {/* Main Router */}
          <Router />
        </WouterRouter>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
