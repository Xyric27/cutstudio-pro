import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, CheckCircle, Zap, Shield, LayoutDashboard, Users, BarChart3, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05050d] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#05050d]/80 backdrop-blur-md border-b border-[#1f1f2e]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display text-2xl tracking-wider pt-1">CUTSTUDIO<span className="text-[#e8a020]">PRO</span></span>
          </div>
          <Link href="/login">
            <Button className="bg-[#e8a020] hover:bg-[#f5c060] text-black font-semibold rounded-full px-6">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8a020]/10 border border-[#e8a020]/20 text-[#e8a020] text-sm mb-8 font-medium">
            <span className="text-xs">✦</span> Trusted by 2400+ Indian Editors
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight mb-6 leading-none">
            <span className="text-white">CUT</span>
            <span className="text-gradient">STUDIO PRO</span>
          </h1>
          
          <p className="text-[#a0a0b0] text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans">
            The premium client portal for freelance video editors. Share watermarked previews, collect feedback, and get paid instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-[#e8a020] hover:bg-[#f5c060] text-black font-semibold rounded-full px-8 h-12 text-lg">
                Get Started Free <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#1f1f2e] hover:bg-[#0a0a16] text-white rounded-full px-8 h-12 text-lg">
                View Demo
              </Button>
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[#1f1f2e] pt-10">
            {[
              { label: "Editors", value: "2,400+" },
              { label: "Projects Delivered", value: "12,000+" },
              { label: "Client Satisfaction", value: "98%" },
              { label: "Avg Rate", value: "₹60/min" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-mono text-2xl md:text-3xl text-white mb-1">{stat.value}</span>
                <span className="text-[#808090] text-sm font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a16] border-y border-[#1f1f2e]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Everything You Need to <span className="text-[#00e5dc]">Scale</span></h2>
            <p className="text-[#808090] max-w-2xl mx-auto">Stop managing clients in WhatsApp and Google Drive. Professionalize your workflow today.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Play className="w-6 h-6" />, title: "Client Video Portal", desc: "A beautiful, branded space for clients to view your work.", tag: "Core" },
              { icon: <Zap className="w-6 h-6" />, title: "Instant Payment Gateway", desc: "Collect payments via UPI, Cards, and Netbanking before HD download.", tag: "Revenue" },
              { icon: <Shield className="w-6 h-6" />, title: "Watermarked Preview", desc: "Protect your work automatically until the final invoice is cleared.", tag: "Security" },
              { icon: <LayoutDashboard className="w-6 h-6" />, title: "Smart Dashboard", desc: "Track all your ongoing projects and pending payments in one place.", tag: "Workflow" },
              { icon: <Users className="w-6 h-6" />, title: "Client Management", desc: "Keep a directory of all your clients and their project history.", tag: "CRM" },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Revenue Analytics", desc: "Understand your income, average project value, and top clients.", tag: "Growth" }
            ].map((feature, i) => (
              <Card key={i} className="bg-[#05050d] border-[#1f1f2e] p-6 card-hover group cursor-default">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#e8a020]/10 text-[#e8a020] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-[#1f1f2e] text-[#a0a0b0] border border-[#2a2a3a]">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-2 text-white">{feature.title}</h3>
                <p className="text-[#808090] text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#05050d]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-display text-xl tracking-wider pt-1 text-white/50">CUTSTUDIO<span className="text-[#e8a020]/50">PRO</span></span>
          </div>
          <p className="text-[#404050] text-sm">© {new Date().getFullYear()} CutStudio Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
