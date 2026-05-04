// src/components/SetupWizard.tsx
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Rocket, Mail, Lock, User } from "lucide-react";

export function SetupWizard() {
  const { createFirstAdmin, isSetupMode } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  if (!isSetupMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createFirstAdmin(form);
    } catch (error) {
      console.error(error);
      alert("Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050d] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0a0a16] border-[#1f1f2e]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Initial Setup
          </CardTitle>
          <p className="text-sm text-[#606070] mt-2">
            Create your first administrator account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#a0a0b0] text-xs uppercase tracking-wider">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] pl-10 text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#a0a0b0] text-xs uppercase tracking-wider">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] pl-10 text-white"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#a0a0b0] text-xs uppercase tracking-wider">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505060]" />
                <Input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-[#05050d] border-[#1f1f2e] pl-10 text-white"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#a0a0b0] text-xs uppercase tracking-wider">
                Phone (optional)
              </Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-[#05050d] border-[#1f1f2e] text-white"
                placeholder="+91 98765 43210"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#e8a020] to-[#e040a0] text-black font-bold hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Create Admin & Start
                </span>
              )}
            </Button>

            <p className="text-xs text-[#505060] text-center mt-4">
              This will create your administrator account. You can add more admins later.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
