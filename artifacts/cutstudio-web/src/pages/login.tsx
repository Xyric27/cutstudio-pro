import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/store";
import { Play, ChevronLeft, ShieldAlert } from "lucide-react";

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { users, login, isProductionMode, setProductionMode, firebaseConfig, setFirebaseConfig } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, if isProductionMode, we'd use Firebase Auth here
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      login(user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}`,
        className: "bg-[#0a0a16] border-[#e8a020] text-white",
      });
      setLocation("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid email or password",
        className: "bg-[#0a0a16] border-[#ff3b5c] text-white",
      });
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setEmail(email);
    setPassword(pass);
    // Auto submit next tick
    setTimeout(() => {
      document.getElementById("login-btn")?.click();
    }, 10);
  };

  return (
    <div className="min-h-screen bg-[#05050d] text-white flex flex-col items-center justify-center p-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-[#808090] hover:text-white hover:bg-[#1f1f2e]"
        onClick={() => setLocation("/home")}
      >
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Home
      </Button>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(232,160,32,0.3)]">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="font-display text-4xl tracking-wider flex items-center gap-2">
            CUTSTUDIO<span className="text-[#e8a020]">PRO</span>
            <span className="text-[10px] font-sans font-bold bg-[#1f1f2e] text-[#a0a0b0] px-2 py-1 rounded tracking-normal align-middle ml-1">v2.1</span>
          </h1>
        </div>

        <Card className="bg-[#0a0a16] border-[#1f1f2e] p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8a020] to-[#e040a0]"></div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#a0a0b0] font-sans">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020] text-white"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#a0a0b0] font-sans">Password</Label>
                <a href="#" className="text-xs text-[#e8a020] hover:underline">Forgot?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#05050d] border-[#1f1f2e] focus-visible:ring-[#e8a020] text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <Button id="login-btn" type="submit" className="w-full bg-[#e8a020] hover:bg-[#f5c060] text-black font-bold h-11 mt-6">
              Sign In to Portal
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f1f2e]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a16] px-2 text-[#606070] font-bold tracking-widest">Or Quick Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="border-[#1f1f2e] bg-[#05050d] hover:bg-[#1f1f2e] text-white h-auto py-3 flex flex-col gap-1"
              onClick={() => handleQuickLogin("admin@cutstudio.com", "admin123")}
            >
              <span className="font-semibold">Admin (Editor)</span>
              <span className="text-[10px] text-[#808090] font-mono">admin@cutstudio.com</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-[#1f1f2e] bg-[#05050d] hover:bg-[#1f1f2e] text-white h-auto py-3 flex flex-col gap-1"
              onClick={() => handleQuickLogin("client@test.com", "client123")}
            >
              <span className="font-semibold">Client View</span>
              <span className="text-[10px] text-[#808090] font-mono">client@test.com</span>
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#1f1f2e] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#808090]" />
                <Label htmlFor="prod-mode" className="text-sm text-[#808090] cursor-pointer">Production Mode</Label>
              </div>
              <Switch 
                id="prod-mode" 
                checked={isProductionMode}
                onCheckedChange={setProductionMode}
                className="data-[state=checked]:bg-[#e8a020]"
              />
            </div>
            
            {isProductionMode && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 p-3 bg-[#05050d] rounded-md border border-[#1f1f2e]">
                <p className="text-xs text-[#00e5dc] font-mono mb-2">Firebase/Razorpay Config</p>
                <Input 
                  value={firebaseConfig.apiKey}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, apiKey: e.target.value})}
                  className="h-8 text-xs bg-[#0a0a16] border-[#1f1f2e] font-mono text-white"
                  placeholder="Firebase API Key"
                />
                <Input 
                  value={firebaseConfig.projectId}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, projectId: e.target.value})}
                  className="h-8 text-xs bg-[#0a0a16] border-[#1f1f2e] font-mono text-white"
                  placeholder="Firebase Project ID"
                />
                <Input 
                  value={firebaseConfig.razorpayKey}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, razorpayKey: e.target.value})}
                  className="h-8 text-xs bg-[#0a0a16] border-[#1f1f2e] font-mono text-white"
                  placeholder="Razorpay Key"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
