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

// ✅ Inner component - yeh AppProvider ke andar hoga
function AppContent() {
  const { currentUser, isLoading, isSetupMode } = useApp();

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      {/* Root URL - redirect based on auth status */}
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
      
      {/* Setup route for first-time admin creation */}
      {isSetupMode && (
        <Route path="/setup" component={() => {
          // Import setup page dynamically or create inline
          const { useState } = require("react");
          // Yahan tumhara setup page aayega
          return <div>Setup Page - Create First Admin</div>;
        }} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

// ✅ Main App component - bas providers wrap karega
function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {/* Background effects */}
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          
          {/* Content with access to context */}
          <AppContent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
