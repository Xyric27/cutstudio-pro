// src/components/ui/SetupWizard.tsx
import { useState } from "react";
import { useApp, User } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Rocket, Mail, Lock, User, CheckCircle2, ArrowRight, LogIn } from "lucide-react";

export function SetupWizard() {
  const { createFirstAdmin, isSetupMode } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // NEW: Success state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Don't render if not in setup mode
  if (!isSetupMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    if (!form.email.trim()) {
      alert("Please enter your email");
      return;
    }
    
    if (!form.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    try {
      await createFirstAdmin({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
      });
      
      // ✅ SHOW SUCCESS STATE (no auto-redirect!)
      setSuccess(true);
      
    } catch (error: any) {
      console.error("Setup error:", error);
      alert(error?.message || "Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── SUCCESS STATE UI ───
  if (success) {
    return (
      <div className="min-h-screen bg-[#05050d] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00e57a]/5 via-transparent to-[#00e5dc]/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00e57a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00e5dc]/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-lg">
          {/* Success Header */}
          <div className="text-center mb-8 space-y-4">
            {/* Animated Check Icon */}
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#00e57a] to-[#00e5dc] flex items-center justify-center animate-bounce shadow-[0_0_40px_rgba(0,229,122,0.3)]">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-[#00e57a]/20 animate-ping" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-5xl font-bold tracking-tight text-white">
                Setup Complete!
              </h1>
              <p className="text-[#808090] text-lg max-w-sm mx-auto">
                Your administrator account has been created successfully.
              </p>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-[#0a0a16] border border-[#00e57a]/30 rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#00e57a]" />
              <span className="text-[#00e57a] font-semibold text-sm uppercase tracking-wider">
                Account Created Successfully
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a28]">
                <span className="text-[#606070]">Name:</span>
                <span className="text-white font-medium">{form.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a28]">
                <span className="text-[#606070]">Email:</span>
                <span className="text-white font-medium font-mono">{form.email}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a28]">
                <span className="text-[#606070]">Role:</span>
                <span className="text-[#00e57a] font-semibold">Administrator</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-[#606070]">Status:</span>
                <span className="flex items-center gap-1.5 text-[#00e57a]">
                  <span className="w-2 h-2 rounded-full bg-[#00e57a] animate-pulse" />
                  Active & Ready
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* PRIMARY: Go to Login */}
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#00e57a] to-[#00e5dc] text-black font-bold text-base hover:opacity-90 hover:shadow-[0_0_30px_rgba(0,229,122,0.4)] transition-all flex items-center justify-center gap-3 group"
            >
              <LogIn className="w-5 h-5" />
              Go to Login Page
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* SECONDARY: Info Text */}
            <p className="text-center text-[#505060] text-xs leading-relaxed px-4">
              Use the credentials above to sign in to your dashboard.<br/>
              You can add more admins and clients after logging in.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#1a1a28] text-center">
            <p className="text-[10px] text-[#303040] font-mono tracking-wider">
              CutStudio Pro v2.1 • Secure • Firebase Powered • Multi-Admin Ready
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── SETUP FORM UI (Original Form) ───
  return (
    <div className="min-h-screen bg-[#05050d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8a020]/5 via-transparent to-[#e040a0]/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e8a020]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e040a0]/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          {/* Logo Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] shadow-[0_0_40px_rgba(232,160,32,0.3)] animate-pulse">
            <Rocket className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-5xl font-bold tracking-tight text-white">
              Initial Setup
            </h1>
            <p className="text-[#808090] text-lg max-w-md mx-auto">
              Welcome to <span className="text-gradient font-semibold">CutStudio Pro</span>!<br/>
              Create your first administrator account to get started.
            </p>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00e57a]/10 border border-[#00e57a]/30">
            <Shield className="w-4 h-4 text-[#00e57a]" />
            <span className="text-[#00e57a] text-xs font-semibold uppercase tracking-wider">
              Secure • Encrypted • Firebase Powered
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0a16] border border-[#1f1f2e] rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* Decorative top line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#e8a020]/60 to-transparent -mt-px" />

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="setup-name" className="text-[#a0a0b0] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </Label>
              <div className="relative">
                <Input
                  id="setup-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-12 text-base pl-11 rounded-xl transition-all"
                  placeholder="John Doe"
                  autoComplete="name"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="setup-email" className="text-[#a0a0b0] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address *
              </Label>
              <div className="relative">
                <Input
                  id="setup-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-12 text-base pl-11 rounded-xl transition-all"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="setup-password" className="text-[#a0a0b0] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                Password * 
                <span className="text-[#505060] font-normal normal-case tracking-normal">(min 6 characters)</span>
              </Label>
              <div className="relative">
                <Input
                  id="setup-password"
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-12 text-base pl-11 rounded-xl transition-all"
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete="new-password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
              </div>
              
              {/* Password Strength Indicator */}
              {form.password.length > 0 && (
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < Math.min(4, Math.ceil(form.password.length / 2))
                          ? form.password.length >= 8
                            ? 'bg-[#00e57a]'
                            : 'bg-[#e8a020]'
                          : 'bg-[#1f1f2e]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="setup-phone" className="text-[#a0a0b0] text-xs uppercase tracking-widest font-semibold">
                Phone Number <span className="text-[#505060]">(optional)</span>
              </Label>
              <Input
                id="setup-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020]/50 focus-visible:border-[#e8a020]/40 text-white h-12 text-base rounded-xl transition-all"
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#e8a020] to-[#e040a0] text-black font-bold text-base hover:opacity-90 hover:shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <Shield className="w-5 h-5" />
                  Create Admin & Start
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-[#1a1a28] space-y-3">
            <p className="text-[11px] text-[#505060] text-center leading-relaxed">
              This will create your <span className="text-[#e8a020] font-semibold">administrator account</span>. 
              You can add more admins and clients later from the dashboard.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-[10px] text-[#404050]">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e57a]" />
                Firebase Firestore
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e8a020]" />
                Real-time Sync
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e040a0]" />
                Multi-Admin Ready
              </span>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <p className="text-center text-[10px] text-[#303040] font-mono mt-6 tracking-wider">
          CutStudio Pro v2.1 · Secure Setup Wizard
        </p>
      </div>
    </div>
  );
}

export default SetupWizard;
