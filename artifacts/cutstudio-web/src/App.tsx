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
 */
function Router() {
  const { isLoading, isSetupMode, currentUser, firebaseReady } = useApp();

  return (
    <Switch>
      {/* ─── PUBLIC ROUTES ─── */}
      
      {/* Home/Landing Page */}
      <Route path="/home" component={Home} />
      
      {/* Login Page */}
      <Route path="/login" component={Login} />
      
      {/* Setup Wizard Route */}
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
      
      {/* Dashboard */}
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
  // ✅ SAFE BASE PATH HANDLING (Fixes the 403/TypeError!)
  const getBasePath = () => {
    try {
      // For GitHub Pages: /repo-name or empty for custom domain
      const basePath = import.meta.env.BASE_PATH || '';
      // Ensure no trailing slash and handle undefined
      return basePath.replace(/\/$/, '') || '';
    } catch (e) {
      console.warn('Could not determine base path:', e);
      return ''; // Fallback to root
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
