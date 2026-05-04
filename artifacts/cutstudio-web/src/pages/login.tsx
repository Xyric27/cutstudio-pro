import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/store";
import { Play, ChevronLeft, Zap, Users, BarChart3, ArrowRight, Eye, EyeOff, Shield, Rocket } from "lucide-react";

const FEATURES_LEFT = [
  { icon: Zap, text: "Instant payment collection", color: "#e8a020" },
  { icon: Users, text: "Branded client portal", color: "#00e5dc" },
  { icon: BarChart3, text: "Revenue dashboard", color: "#e040a0" },
];

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // NEW: Get updated state from store
  const { 
    users, 
    login,           // Updated login function (takes email + password)
    firebaseReady,   // Is Firebase connected?
    isLoading,       // Is data loading?
    isSetupMode     // Do we need to show setup wizard?
  } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: If in setup mode, redirect to setup
  // (Or you can render SetupWizard here instead)
  if (isSetupMode) {
    return (
      <div className="min-h-screen bg-[#05050d] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl text-white">Initial Setup Required</h2>
          <p className="text-[#606070] max-w-md mx-auto">
            No administrator accounts found. Please set up your first admin via the Setup Wizard.
          </p>
          <button
            onClick={() => setLocation("/setup")}
            className="btn-gold px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" /> Go to Setup Wizard
          </button>
        </div>
      </div>
    );
  }

  // NEW: Show loading while connecting to Firebase
  if (isLoading || !firebaseReady) {
    return (
      <div className="min-h-screen bg-[#05050d] flex overflow-hidden">
        {/* Left Panel (same as below) */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12 border-r border-[#1f1f2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center shadow-[0_0_24px_rgba(232,160,32,0.4)]">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display text-2xl tracking-wider">
              CUT<span className="text-gradient">STUDIO PRO</span>
            </span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="animate-spin w-16 h-16 border-4 border-[#e8a020] border-t-transparent rounded-full mx-auto" />
              <p className="text-[#606070] font-medium">Connecting to server...</p>
              <p className="text-[#505060] text-xs font-mono">Firebase Firestore Sync</p>
            </div>
          </div>

          <div className="font-mono text-[10px] text-[#404050] tracking-wider">
            v2.1 · Encrypted · Real-time
          </div>
        </div>

        {/* Right Panel - Loading State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#e8a020]/20 to-[#e040a0]/20 flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-[#e8a020]" />
              </div>
            </div>
            <h1 className="font-display text-3xl tracking-tight text-white">Loading...</h1>
            <p className="text-[#606070] text-sm">
              Establishing secure connection to your database
            </p>
            
            {/* Simulated progress */}
            <div className="space-y-2">
              <div className="h-1 bg-[#1f1f2e] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#e8a020] to-[#e040a0] rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <p className="text-[10px] text-[#505060] font-mono">Authenticating...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // UPDATED: Login handler using new store.login()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ 
        variant: "destructive", 
        title: "Missing Fields", 
        description: "Please enter both email and password",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white" 
      });
      return;
    }

    setLoading(true);
    
    try {
      // NEW: Use the async login function from store
      const success = await login(email, password);
      
      if (success) {
        // Login successful - store handles toast and state update
        setTimeout(() => {
          setLocation("/dashboard");
        }, 500);
      }
      // If failed, store already shows error toast
    } catch (error) {
      console.error("Login error:", error);
      toast({ 
        variant: "destructive", 
        title: "Login Error", 
        description: "Something went wrong. Please try again.",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white" 
      });
    } finally {
      setLoading(false);
    }
  };

  // MAIN LOGIN UI (Your existing beautiful design!)
  return (
    <div className="min-h-screen bg-[#05050d] flex overflow-hidden">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12 login-left-pattern border-r border-[#1f1f2e]">
        <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#e8a020]/30" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#e8a020]/30" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center shadow-[0_0_24px_rgba(232,160,32,0.4)]">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display text-2xl tracking-wider">
            CUT<span className="text-gradient">STUDIO PRO</span>
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="font-mono text-[10px] tracking-[4px] uppercase text-[#e8a020]/50 mb-4">
              Professional Editor Portal
            </div>
            <h2 className="font-display text-6xl leading-[0.9] tracking-tight text-white mb-4">
              YOUR<br />
              <span className="text-gradient">CLIENTS</span><br />
              DESERVE<br />
              THIS.
            </h2>
            <p className="text-[#606070] text-sm leading-relaxed max-w-xs">
              The premium portal used by India's top video editors to share work, collect payments, and grow their business.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES_LEFT.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 group">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <span className="text-[#a0a0b0] text-sm group-hover:text-white transition-colors">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="font-mono text-[10px] text-[#404050] tracking-wider">
          v2.1 · 256-bit SSL · Firebase Ready · Multi-Admin
        </div>
      </div>

      {/* ─── RIGHT PANEL (FORM) ─── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <button
          className="absolute top-6 left-6 flex items-center gap-1.5 text-[#808090] hover:text-white text-sm transition-colors"
          onClick={() => setLocation("/home")}
        >
          <ChevronLeft className="w-4 h-4" /> Home
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center shadow-[0_0_30px_rgba(232,160,32,0.35)] mb-3">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-display text-3xl tracking-widest">CUT<span className="text-gradient">STUDIO PRO</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-4xl tracking-tight text-white mb-1">Sign in</h1>
            <p className="text-[#606070] text-sm">Access your portal</p>
            
            {/* NEW: Show user count for debugging (optional) */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-[10px] text-[#303040] mt-2 font-mono">
                Debug: {users.length} users loaded | Firebase: {firebaseReady ? '✅' : '❌'}
              </p>
            )}
          </div>

          <div className="relative bg-[#0a0a16] rounded-2xl border border-[#1f1f2e] p-6 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e8a020]/60 to-transparent" />

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#909090] text-xs uppercase tracking-widest font-semibold">Email</Label>
                <Input
                  id="email" type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-11 text-sm"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#909090] text-xs uppercase tracking-widest font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPass ? "text" : "password"} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-11 text-sm pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606070] hover:text-white transition-colors"
                    onClick={() => setShowPass(s => !s)}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-btn" type="submit" disabled={loading}
                className="btn-gold w-full rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-bold relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 relative z-10" />
                  </>
                )}
              </button>
            </form>

            {/* NEW: Help text for first-time users */}
            <div className="mt-4 pt-4 border-t border-[#1a1a28] text-center">
              <p className="text-[11px] text-[#505060]">
                Contact your administrator for login credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
