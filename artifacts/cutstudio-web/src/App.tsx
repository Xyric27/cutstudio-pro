import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
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
 * Protected Route - Requires login
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
 * MAIN ROUTER - Handles all scenarios intelligently
 */
function Router() {
  const { isLoading, isSetupMode, currentUser, firebaseReady } = useApp();
  const [location] = useLocation();

  // ─── LOADING STATE ───
  if (isLoading || !firebaseReady) {
    return <LoadingScreen />;
  }

  // ─── SCENARIO A: SETUP MODE (No users exist yet) ───
  if (isSetupMode && !currentUser) {
    // If already on /setup page, show the wizard
    if (location === '/setup') {
      return <SetupWizard />;
    }
    
    // For ANY other URL when in setup mode, redirect to /setup
    return (
      <Switch>
        <Route path="/setup" component={SetupWizard} />
        <Route path="/">
          <Redirect to="/setup" />
        </Route>
        {/* Catch-all: redirect unknown routes to /setup */}
        <Route component={() => <Redirect to="/setup" />} 
        />
      </Switch>
    );
  }

  // ─── SCENARIO B: NORMAL MODE (Users exist or logged in) ───
  return (
    <Switch>
      {/* PUBLIC PAGES */}
      <Route path="/home" component={Home} />
      
      {/* LOGIN PAGE - Only show if not logged in */}
      <Route 
        path="/login" 
        component={() => {
          // If already logged in and visits /login, send to dashboard
          if (currentUser) {
            return <Redirect to="/dashboard" />;
          }
          return <Login />;
        }} 
      />
      
      {/* SETUP PAGE - If not in setup mode, redirect to login */}
      <Route 
        path="/setup" 
        component={() => <Redirect to="/login" />} 
      />

      {/* PROTECTED PAGES */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* ROOT URL "/" - SMART REDIRECT */}
      <Route path="/">
        {currentUser ? (
          <Redirect to="/dashboard" />     // Logged in → Dashboard
        ) : (
          <Redirect to="/login" />           // Not logged in → Login
        )}
      </Route>

      {/* 404 CATCH-ALL */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root App Component
 */
function App() {
  const getBasePath = () => {
    try {
      const basePath = import.meta.env.BASE_PATH || '';
      return basePath.replace(/\/$/, '') || '';
    } catch (e) {
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
          
          {/* Main Router with all logic */}
          <Router />
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
