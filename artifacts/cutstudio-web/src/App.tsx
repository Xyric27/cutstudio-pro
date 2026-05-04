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

function App() {
  const { currentUser, isLoading } = useApp();

  // Agar app load ho rahi hai toh loading screen dikhao
  if (isLoading) {
    return (
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="noise-overlay" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <LoadingScreen />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          
          <Switch>
            {/* Root URL par redirect karo based on login status */}
            <Route path="/">
              {currentUser ? <Redirect to="/dashboard" /> : <Redirect to="/home" />}
            </Route>
            
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
