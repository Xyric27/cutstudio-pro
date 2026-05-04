import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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

  // ✅ KEY: Jab tak load ho raha, tab tak LOADING SCREEN DIKHAO
  if (isLoading) {
    return <LoadingScreen />;
  }

  // ✅ Loading complete - ab route decide karo
  return (
    <Switch>
      <Route path="/">
        {isSetupMode ? (
          <Redirect to="/setup" />
        ) : currentUser ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/home" />
        )}
      </Route>
      
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {/* Background effects - always visible */}
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          
          {/* Content switches between Loading and App */}
          <AppContent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
