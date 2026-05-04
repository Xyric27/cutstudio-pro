import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import { SetupWizard } from "@/components/ui/SetupWizard";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/pages/loading";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

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

function AppRouter() {
  const { isLoading, isSetupMode, currentUser, firebaseReady } = useApp();

  // ─── LOADING STATE ───
  if (isLoading || !firebaseReady) {
    return <LoadingScreen />;
  }

  // ─── SETUP MODE ───
  if (isSetupMode && !currentUser) {
    return (
      <Switch>
        <Route path="/setup" component={SetupWizard} />
        <Route path="/home" component={Home} />
        <Route path="/">
          <Redirect to="/setup" />
        </Route>
        <Route component={() => <Redirect to="/setup" />} 
        />
      </Switch>
    );
  }

  // ─── NORMAL MODE ───
  return (
    <Switch>
      <Route path="/home" component={Home} />
      
      <Route 
        path="/login" 
        component={() => {
          if (currentUser) {
            return <Redirect to="/dashboard" />;
          }
          return <Login />;
        }} 
      />
      
      <Route 
        path="/setup" 
        component={() => {
          if (isSetupMode) {
            return <SetupWizard />;
          }
          return <Redirect to="/login" />;
        }} 
      />

      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      
      {/* ⭐ ROOT URL "/" */}
      <Route path="/">
        {() => {
          if (currentUser) {
            return <Redirect to="/dashboard" />;
          }
          return <Redirect to="/login" />;
        }()}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = '';
  
  return (
    <AppProvider>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <div className="noise-overlay" />
          <div className="orb orb-1" />
          <div className="orb orb-2" 
               style={{background: 'radial-gradient(circle at 20% 50%, transparent, rgba(232,160,32,0.2) 0%, transparent)'}} />
          <div className="orb orb-3" 
               style={{background: 'radial-gradient(circle at 80% 20%, transparent, rgba(224,64,64,0.15) 0%, transparent)'}} />
          
          <AppRouter />
        </WouterRouter>
        
        <Toaster />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
