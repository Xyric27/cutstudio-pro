import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import { SetupWizard } from "@/components/ui/SetupWizard"; // Your path
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

/**
 * Protected Route Component
 */
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { currentUser, isLoading, firebaseReady } = useApp();
  
  if (isLoading || !firebaseReady) {
    return <LoadingScreen />;
  }
  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

/**
 * Main Router Configuration
 * SMART ROUTING: Detects setup mode and redirects automatically!
 */
function Router() {
  const { isLoading, isSetupMode, currentUser, firebaseReady } = useApp();

  // ─── LOADING STATE ───
  if (isLoading) {
    return <LoadingScreen />;
  }

  // ─── SETUP MODE DETECTION ───
  // If no users exist and not logged in, show setup wizard on ALL public pages
  if (isSetupMode && !currentUser) {
    return (
      <Switch>
        <Route path="/setup" component={SetupWizard} />
        <Route path="/home" component={Home} />
        {/* All other routes redirect to /setup */}
        <Route path="/">
          <Redirect to="/setup" />
        </Route>
        <Route component={() => <Redirect to="/setup" />} 
        />
      </Switch>
    );
  }

  // ─── NORMAL MODE (Has users or logged in) ───
  return (
    <Switch>
      {/* ─── PUBLIC ROUTES ─── */}
      
      {/* Home/Landing Page */}
      <Route path="/home" component={Home} />
      
      {/* Login Page */}
      <Route path="/login" component={Login} />
      
      {/* Setup Wizard (only accessible in setup mode, else redirects) */}
      <Route 
        path="/setup" 
        component={() => {
          if (!isSetupMode) {
            return <Redirect to="/login" />;
          }
          return <SetupWizard />;
        }} 
      />
      
      {/* ─── PROTECTED ROUTES ─── */}
      
      {/* Dashboard - requires authentication */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* Default: Redirect based on auth state */}
      <Route path="/">
        {currentUser ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      {/* 404 Not Found - catch all */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root App Component
 */
function App() {
  // ✅ SAFE BASE PATH HANDLING
  const getBasePath = () => {
    try {
      const basePath = import.meta.env.BASE_PATH || '';
      return basePath.replace(/\/$/, '') || '';
    } catch (e) {
      console.warn('Base path error:', e);
      return '';
    }
  };

  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={getBasePath()}>
          {/* Background Effects */}
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          
          {/* Main Router with smart logic */}
          <Router />
        </WouterRouter>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
