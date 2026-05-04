import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/store";
import { Shield, User, Mail, Lock, ArrowRight, Rocket, CheckCircle } from "lucide-react";

export default function SetupWizard() {
  const { createFirstAdmin, isSetupMode } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Success
  const [showPassword, setShowPassword] = useState(false);

  // If not in setup mode, redirect
  if (!isSetupMode && step === 1) {
    return (
      <div className="min-h-screen bg-[#05050d] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <CheckCircle className="w-20 h-20 mx-auto text-[#00e57a]" />
          <h2 className="font-display text-4xl text-white">Already Configured</h2>
          <p className="text-[#606070]">
            System already has an administrator. Please login instead.
          </p>
          <a 
            href="/#/login"
            className="btn-gold px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white"
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white"
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please confirm your password correctly",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white"
      });
      return;
    }

    setLoading(true);
    
    try {
      await createFirstAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      });
      
      setStep(2); // Success step
      
    } catch (error) {
      console.error("Setup error:", error);
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: "Could not create admin account. Please try again.",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white"
      });
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#05050d] flex items-center justify-center overflow-hidden relative">
        {/* Background effects */}
        <div className="noise-overlay" />
        <div className="grid-bg" />
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" 
             style={{ background: 'radial-gradient(circle, rgba(0,229,122,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        
        <div className="relative z-10 max-w-md w-full mx-auto p-8">
          <div className="text-center space-y-8">
            {/* Success Animation */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00e57a] to-[#00e5dc] flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#00e57a]/30 animate-ping" />
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl tracking-tight text-white">
                Admin<br />Created!
              </h1>
              <p className="text-[#606070] text-lg">
                Your administrator account has been successfully created.
              </p>
              <div className="bg-[#0a0a16] rounded-xl p-4 border border-[#00e57a]/30">
                <p className="text-sm text-[#00e57a] font-mono">
                  ✅ {formData.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <a
                href="/#/login"
                className="btn-gold w-full rounded-xl h-12 flex items-center justify-center gap-2 text-base font-bold"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <p className="text-xs text-[#404050] font-mono">
                You can now sign in with your credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup Form (Step 1)
  return (
    <div className="min-h-screen bg-[#05050d] flex items-center justify-center overflow-hidden relative">
      {/* Background */}
      <div className="noise-overlay" />
      <div className="grid-bg" />
      
      <div className="orb orb-1" style={{ opacity: 0.3 }} />
      <div className="orb orb-2" style={{ opacity: 0.2 }} />

      <div className="relative z-10 max-w-xl w-full mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] shadow-[0_0_40px_rgba(232,160,32,0.3)] mb-4">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h1 className="font-display text-5xl tracking-tight text-white mb-2">
                Initial Setup
              </h1>
              <p className="text-[#606070] text-lg">
                Create your administrator account to get started
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-3 h-3 rounded-full bg-[#e8a020]" />
              <div className="w-12 h-[2px] bg-[#e8a020]/30" />
              <div className="w-3 h-3 rounded-full bg-[#1f1f2e]" />
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative bg-[#0a0a16] rounded-2xl border border-[#1f1f2e] p-8 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e8a020]/60 to-transparent" />
              
              <div className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#909090] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 text-white h-11"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#909090] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 text-white h-11"
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                {/* Phone Field (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#909090] text-xs uppercase tracking-widest font-semibold">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 text-white h-11"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#909090] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 text-white h-11 pr-10"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606070] hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#505060]">Minimum 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#909090] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 text-white h-11"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-xl h-12 flex items-center justify-center gap-2 text-base font-bold relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Create Admin Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-[#404050] flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Secured with 256-bit encryption • Firebase Auth
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
