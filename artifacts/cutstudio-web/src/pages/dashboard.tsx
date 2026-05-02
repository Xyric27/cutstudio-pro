import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useApp, Project, User } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, LogOut, Plus, Search, CheckCircle2, Download, CreditCard, 
  Trash2, AlertTriangle, ExternalLink, Video, IndianRupee, ChevronRight,
  Zap, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const { currentUser, logout, projects, users, addProject, addUser, updateProject, deleteProject, deleteUser } = useApp();
  const { toast } = useToast();
  
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // Stats for Admin
  const totalProjects = projects.length;
  const clientUsers = users.filter(u => u.role === 'client');
  const paidProjects = projects.filter(p => p.status === 'paid');
  const totalRevenue = paidProjects.reduce((sum, p) => sum + p.price, 0);
  const pendingProjects = projects.filter(p => p.status === 'preview');

  // Filter projects for client
  const displayProjects = currentUser?.role === 'admin' ? projects : projects.filter(p => p.clientEmail === currentUser?.email);

  // Form states
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "", clientEmail: "", price: 0, duration: 0, status: "preview", previewUrl: "", finalUrl: "", desc: ""
  });
  
  const [newClient, setNewClient] = useState<Partial<User>>({
    name: "", email: "", password: "", phone: "", role: "client"
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProject.title || "Untitled",
      clientEmail: newProject.clientEmail || "",
      price: Number(newProject.price) || 0,
      duration: Number(newProject.duration) || 0,
      status: "preview",
      previewUrl: newProject.previewUrl || "",
      finalUrl: newProject.finalUrl || "",
      desc: newProject.desc || "",
      createdAt: new Date().toISOString()
    };
    addProject(p);
    setIsAddProjectOpen(false);
    setNewProject({ title: "", clientEmail: "", price: 0, duration: 0, status: "preview", previewUrl: "", finalUrl: "", desc: "" });
    toast({ title: "Project Created", className: "bg-[#0a0a16] border-[#e8a020] text-white" });
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const c: User = {
      uid: Math.random().toString(36).substr(2, 9),
      name: newClient.name || "Unknown",
      email: newClient.email || "",
      password: newClient.password || "client123",
      phone: newClient.phone || "",
      role: "client"
    };
    addUser(c);
    setIsAddClientOpen(false);
    setNewClient({ name: "", email: "", password: "", phone: "", role: "client" });
    toast({ title: "Client Added", className: "bg-[#0a0a16] border-[#e8a020] text-white" });
  };

  const handleMarkPaid = (project: Project) => {
    updateProject({ ...project, status: "paid", paidAt: new Date().toISOString() });
    toast({ title: "Payment Recorded", description: "Project marked as paid", className: "bg-[#0a0a16] border-[#e8a020] text-white" });
    if (isDetailOpen && selectedProject?.id === project.id) {
      setSelectedProject({ ...project, status: "paid", paidAt: new Date().toISOString() });
    }
  };

  const simulatePayment = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      setIsSimulatingPayment(false);
      setIsPaymentOpen(false);
      if (selectedProject) {
        handleMarkPaid(selectedProject);
      }
    }, 2200);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      toast({ title: "Project Deleted", className: "bg-[#0a0a16] border-[#ff3b5c] text-white" });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#05050d] text-white pb-20">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-[#05050d]/90 backdrop-blur-md border-b border-[#1f1f2e] px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e8a020] to-[#e040a0] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display text-2xl tracking-wider pt-1 hidden sm:inline-block">CUTSTUDIO<span className="text-[#e8a020]">PRO</span></span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser.role === 'admin' && (
            <div className="hidden md:flex items-center gap-2 mr-4">
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-[#1f1f2e] bg-[#0a0a16] text-white hover:bg-[#1f1f2e]">
                    <Plus className="w-4 h-4 mr-1" /> Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a16] border-[#1f1f2e] text-white">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl tracking-wide">New Client</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Password</Label>
                      <Input required value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" />
                    </div>
                    <Button type="submit" className="w-full bg-[#e8a020] text-black hover:bg-[#f5c060] font-bold">Save Client</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#e8a020] text-black hover:bg-[#f5c060] font-semibold">
                    <Plus className="w-4 h-4 mr-1" /> New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a16] border-[#1f1f2e] text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl tracking-wide">Create Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Title</Label>
                      <Input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Email</Label>
                      <Input type="email" required value={newProject.clientEmail} onChange={e => setNewProject({...newProject, clientEmail: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input type="number" required value={newProject.price} onChange={e => setNewProject({...newProject, price: Number(e.target.value)})} className="bg-[#05050d] border-[#1f1f2e] font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (mins)</Label>
                      <Input type="number" required value={newProject.duration} onChange={e => setNewProject({...newProject, duration: Number(e.target.value)})} className="bg-[#05050d] border-[#1f1f2e] font-mono" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Preview Video URL (MP4)</Label>
                      <Input required value={newProject.previewUrl} onChange={e => setNewProject({...newProject, previewUrl: e.target.value})} className="bg-[#05050d] border-[#1f1f2e] font-mono text-xs" placeholder="https://..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Final HD Video URL</Label>
                      <Input required value={newProject.finalUrl} onChange={e => setNewProject({...newProject, finalUrl: e.target.value})} className="bg-[#05050d] border-[#1f1f2e] font-mono text-xs" placeholder="https://..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} className="bg-[#05050d] border-[#1f1f2e]" rows={3} />
                    </div>
                    <Button type="submit" className="w-full md:col-span-2 bg-[#e8a020] text-black hover:bg-[#f5c060] font-bold">Create Project</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#1f1f2e]/50 p-1.5 pr-4 rounded-full border border-[#1f1f2e]">
            <Avatar className="h-8 w-8 border border-[#e8a020]">
              <AvatarFallback className="bg-[#0a0a16] text-[#e8a020] text-xs font-bold">{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-[#a0a0b0] uppercase tracking-wider">{currentUser.role}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-[#a0a0b0] hover:text-white hover:bg-[#ff3b5c]/20">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Admin Stats */}
        {currentUser.role === 'admin' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-[#0a0a16] border-[#1f1f2e] p-4 border-t-2 border-t-[#e8a020]">
              <p className="text-xs text-[#808090] uppercase tracking-wider mb-1 font-semibold">Total Projects</p>
              <p className="font-mono text-3xl font-bold">{totalProjects}</p>
            </Card>
            <Card className="bg-[#0a0a16] border-[#1f1f2e] p-4 border-t-2 border-t-[#00e5dc]">
              <p className="text-xs text-[#808090] uppercase tracking-wider mb-1 font-semibold">Clients</p>
              <p className="font-mono text-3xl font-bold">{clientUsers.length}</p>
            </Card>
            <Card className="bg-[#0a0a16] border-[#1f1f2e] p-4 border-t-2 border-t-[#00e57a]">
              <p className="text-xs text-[#808090] uppercase tracking-wider mb-1 font-semibold">Paid</p>
              <p className="font-mono text-3xl font-bold">{paidProjects.length}</p>
            </Card>
            <Card className="bg-[#0a0a16] border-[#1f1f2e] p-4 border-t-2 border-t-[#e040a0]">
              <p className="text-xs text-[#808090] uppercase tracking-wider mb-1 font-semibold">Revenue</p>
              <p className="font-mono text-3xl font-bold text-[#e8a020]">{formatRupee(totalRevenue)}</p>
            </Card>
            <Card className="bg-[#0a0a16] border-[#1f1f2e] p-4 border-t-2 border-t-white">
              <p className="text-xs text-[#808090] uppercase tracking-wider mb-1 font-semibold">Pending</p>
              <p className="font-mono text-3xl font-bold text-[#ff3b5c]">{pendingProjects.length}</p>
            </Card>
          </div>
        )}

        {currentUser.role === 'client' && (
          <div className="mb-8">
            <h1 className="font-display text-4xl mb-2">My Projects</h1>
            <p className="text-[#a0a0b0]">View your previews and download final files.</p>
          </div>
        )}

        {currentUser.role === 'admin' ? (
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="bg-[#0a0a16] border-[#1f1f2e] mb-6">
              <TabsTrigger value="projects" className="data-[state=active]:bg-[#1f1f2e] data-[state=active]:text-white">Projects</TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-[#1f1f2e] data-[state=active]:text-white">Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <ProjectGrid projects={displayProjects} onProjectClick={(p) => { setSelectedProject(p); setIsDetailOpen(true); }} onDelete={handleDeleteProject} isAdmin={true} />
            </TabsContent>
            
            <TabsContent value="clients">
              <Card className="bg-[#0a0a16] border-[#1f1f2e] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#808090] uppercase bg-[#1f1f2e]/50 border-b border-[#1f1f2e]">
                      <tr>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4 text-center">Projects</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientUsers.map((client) => {
                        const clientProjects = projects.filter(p => p.clientEmail === client.email);
                        const cPaid = clientProjects.filter(p => p.status === 'paid').length;
                        return (
                          <tr key={client.uid} className="border-b border-[#1f1f2e] hover:bg-[#1f1f2e]/30">
                            <td className="px-6 py-4 font-semibold flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#1f1f2e] text-white text-xs">{getInitials(client.name)}</AvatarFallback>
                              </Avatar>
                              {client.name}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-[#a0a0b0]">{client.email}</td>
                            <td className="px-6 py-4 text-center font-mono">
                              <span className="text-white">{cPaid}</span>
                              <span className="text-[#808090]">/{clientProjects.length}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge className="bg-[#00e57a]/10 text-[#00e57a] border-0">Active</Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" className="text-[#808090] hover:text-[#ff3b5c] hover:bg-[#ff3b5c]/10" onClick={() => deleteUser(client.uid)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <ProjectGrid projects={displayProjects} onProjectClick={(p) => { setSelectedProject(p); setIsDetailOpen(true); }} isAdmin={false} />
        )}
      </div>

      {/* Project Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#0a0a16] border-[#1f1f2e] text-white max-w-4xl p-0 overflow-hidden">
          {selectedProject && (
            <div className="flex flex-col">
              {/* Video Player Area */}
              <div className="relative aspect-video bg-black flex items-center justify-center group">
                {selectedProject.status === 'preview' ? (
                  <>
                    <video src={selectedProject.previewUrl} className="w-full h-full object-cover opacity-80" controls />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="text-white/20 font-display text-7xl rotate-12 select-none tracking-widest border-4 border-white/20 px-8 py-2">
                        PREVIEW ONLY
                      </div>
                    </div>
                  </>
                ) : (
                  <video src={selectedProject.finalUrl} className="w-full h-full object-cover" controls />
                )}
              </div>

              {/* Details Area */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={selectedProject.status === 'paid' ? "bg-[#00e57a]/20 text-[#00e57a] border-[#00e57a]/30" : "bg-[#e8a020]/20 text-[#e8a020] border-[#e8a020]/30"}>
                          {selectedProject.status.toUpperCase()}
                        </Badge>
                        <span className="text-[#808090] text-sm font-mono">{format(new Date(selectedProject.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <h2 className="font-display text-4xl">{selectedProject.title}</h2>
                    </div>
                    
                    <p className="text-[#a0a0b0] leading-relaxed">{selectedProject.desc}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="px-3 py-1.5 rounded bg-[#1f1f2e] text-sm font-mono flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#808090]" /> {selectedProject.duration} mins
                      </div>
                      <div className="px-3 py-1.5 rounded bg-[#1f1f2e] text-sm font-mono text-[#a0a0b0]">
                        ID: {selectedProject.id.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-72 bg-[#05050d] p-5 rounded-xl border border-[#1f1f2e] flex flex-col justify-between">
                    <div>
                      <p className="text-[#808090] text-xs uppercase tracking-wider font-semibold mb-1">Project Value</p>
                      <p className="font-mono text-3xl font-bold text-gradient-gold mb-6">{formatRupee(selectedProject.price)}</p>
                    </div>

                    {selectedProject.status === 'paid' ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#00e57a] bg-[#00e57a]/10 px-3 py-2 rounded-lg text-sm font-medium">
                          <CheckCircle2 className="w-5 h-5" /> Paid in Full
                        </div>
                        <Button className="w-full bg-[#00e5dc] hover:bg-[#00e5dc]/80 text-black font-bold h-12" asChild>
                          <a href={selectedProject.finalUrl} target="_blank" rel="noreferrer" download>
                            <Download className="w-5 h-5 mr-2" /> Download HD Final
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-2 text-[#e8a020] bg-[#e8a020]/10 p-3 rounded-lg text-xs leading-tight">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> 
                          <div>Watermark will be removed after payment is completed.</div>
                        </div>
                        
                        {currentUser.role === 'client' ? (
                          <Button 
                            className="w-full bg-[#e8a020] hover:bg-[#f5c060] text-black font-bold h-12 text-lg shadow-[0_0_20px_rgba(232,160,32,0.4)]"
                            onClick={() => setIsPaymentOpen(true)}
                          >
                            Pay Now to Unlock
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            className="w-full border-[#00e57a]/50 text-[#00e57a] hover:bg-[#00e57a]/10 font-bold h-12"
                            onClick={() => handleMarkPaid(selectedProject)}
                          >
                            Mark as Paid Manually
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal for Client */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="bg-[#0a0a16] border-[#1f1f2e] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Complete Payment</DialogTitle>
          </DialogHeader>
          
          {isSimulatingPayment ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#1f1f2e] border-t-[#e8a020] rounded-full animate-spin"></div>
              <p className="text-[#a0a0b0] font-mono animate-pulse">Processing via secure gateway...</p>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="bg-[#05050d] p-4 rounded-lg border border-[#1f1f2e] flex justify-between items-center">
                <span className="text-[#a0a0b0]">Amount Due</span>
                <span className="font-mono text-2xl font-bold text-[#e8a020]">
                  {selectedProject ? formatRupee(selectedProject.price) : "0"}
                </span>
              </div>
              
              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start h-14 bg-[#05050d] border-[#1f1f2e] hover:bg-[#1f1f2e] hover:border-[#e8a020]">
                    <div className="w-8 h-8 rounded bg-[#1f1f2e] flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-[#e8a020]" />
                    </div>
                    <span className="font-semibold text-white">UPI / QR</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-14 bg-[#05050d] border-[#1f1f2e] hover:bg-[#1f1f2e] hover:border-[#e8a020]">
                    <div className="w-8 h-8 rounded bg-[#1f1f2e] flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-[#00e5dc]" />
                    </div>
                    <span className="font-semibold text-white">Credit / Debit Card</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-14 bg-[#05050d] border-[#1f1f2e] hover:bg-[#1f1f2e] hover:border-[#e8a020]">
                    <div className="w-8 h-8 rounded bg-[#1f1f2e] flex items-center justify-center mr-3">
                      <IndianRupee className="w-4 h-4 text-[#e040a0]" />
                    </div>
                    <span className="font-semibold text-white">Net Banking</span>
                  </Button>
                </div>
              </div>
              
              <Button className="w-full bg-[#e8a020] text-black font-bold h-12" onClick={simulatePayment}>
                Pay Securely
              </Button>
              <p className="text-center text-xs text-[#606070] flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Secured by 256-bit encryption
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Project Grid Component
function ProjectGrid({ projects, onProjectClick, onDelete, isAdmin }: { projects: Project[], onProjectClick: (p: Project) => void, onDelete?: (id: string, e: React.MouseEvent) => void, isAdmin: boolean }) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-[#1f1f2e] rounded-xl bg-[#0a0a16]">
        <div className="w-16 h-16 mx-auto bg-[#1f1f2e] rounded-full flex items-center justify-center mb-4 text-[#808090]">
          <Video className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl text-white mb-2">No Projects Found</h3>
        <p className="text-[#808090] max-w-sm mx-auto">There are no projects available in this view yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <Card key={project.id} className="bg-[#0a0a16] border-[#1f1f2e] overflow-hidden group cursor-pointer hover:border-[#e8a020]/50 transition-colors" onClick={() => onProjectClick(project)}>
          <div className="aspect-video thumbnail-gradient flex items-center justify-center overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </div>
            
            <div className="absolute top-3 left-3">
              <Badge className={project.status === 'paid' ? "bg-[#00e57a]/90 text-black border-0 font-bold" : "bg-[#e8a020]/90 text-black border-0 font-bold shadow-[0_0_10px_rgba(232,160,32,0.5)]"}>
                {project.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-mono rounded">
              {project.duration}m
            </div>

            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="w-8 h-8 bg-black/70 rounded hover:bg-[#ff3b5c] flex items-center justify-center text-white transition-colors" onClick={(e) => onDelete && onDelete(project.id, e)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-5 relative">
            {isAdmin && <p className="text-xs font-mono text-[#808090] mb-2 truncate">{project.clientEmail}</p>}
            <h3 className="font-display text-2xl text-white mb-2 line-clamp-1 group-hover:text-[#e8a020] transition-colors">{project.title}</h3>
            <p className="text-sm text-[#808090] line-clamp-2 mb-4 h-10">{project.desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#1f1f2e]">
              <span className="font-mono text-xl font-bold text-white">
                ₹{project.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[#e8a020] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                {project.status === 'paid' ? 'View Final' : 'View Preview'} <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
