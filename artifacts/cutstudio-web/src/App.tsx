import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import LoadingScreen from "@/pages/loading";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

function App() {
  const { currentUser, isLoading, firebaseReady } = useApp();
  
  return (
    <AppProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-[#05050d] text-white flex items-center justify-center">
          {isLoading || !firebaseReady ? (
            <LoadingScreen />
          ) : (
            <>
              {currentUser ? <Dashboard /> : <Login />}
          )}
        </div>
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
