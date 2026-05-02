import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type Role = "admin" | "client";

export interface User {
  uid: string;
  email: string;
  password?: string;
  name: string;
  role: Role;
  phone?: string;
}

export interface Project {
  id: string;
  title: string;
  clientEmail: string;
  price: number;
  duration: number; // in minutes
  status: "preview" | "paid";
  previewUrl: string;
  finalUrl: string;
  desc: string;
  createdAt: string;
  paidAt?: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  isProductionMode: boolean;
  firebaseConfig: {
    apiKey: string;
    projectId: string;
    razorpayKey: string;
  };
}

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addUser: (user: User) => void;
  deleteUser: (uid: string) => void;
  setProductionMode: (isProd: boolean) => void;
  setFirebaseConfig: (config: AppState["firebaseConfig"]) => void;
}

const defaultUsers: User[] = [
  { uid: "1", email: "admin@cutstudio.com", password: "admin123", name: "Admin User", role: "admin" },
  { uid: "2", email: "client@test.com", password: "client123", name: "Test Client", role: "client" },
];

const defaultProjects: Project[] = [
  {
    id: "p1",
    title: "Wedding Highlights Reel",
    clientEmail: "client@test.com",
    price: 8500,
    duration: 7,
    status: "preview",
    previewUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    finalUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    desc: "A beautiful wedding highlight reel covering the main events.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Product Launch Video",
    clientEmail: "client@test.com",
    price: 12000,
    duration: 3,
    status: "paid",
    previewUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    finalUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    desc: "High energy product launch for social media.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    paidAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const getInitialState = (): AppState => {
  const stored = localStorage.getItem("cutstudio_state");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored state");
    }
  }
  return {
    currentUser: null,
    users: defaultUsers,
    projects: defaultProjects,
    isProductionMode: false,
    firebaseConfig: { apiKey: "", projectId: "", razorpayKey: "" },
  };
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(getInitialState);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("cutstudio_state", JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const value: AppContextType = {
    ...state,
    login: (user) => updateState({ currentUser: user }),
    logout: () => updateState({ currentUser: null }),
    addProject: (project) => updateState({ projects: [project, ...state.projects] }),
    updateProject: (project) => {
      updateState({
        projects: state.projects.map((p) => (p.id === project.id ? project : p)),
      });
    },
    deleteProject: (id) => {
      updateState({ projects: state.projects.filter((p) => p.id !== id) });
    },
    addUser: (user) => updateState({ users: [...state.users, user] }),
    deleteUser: (uid) => updateState({ users: state.users.filter((u) => u.uid !== uid) }),
    setProductionMode: (isProd) => updateState({ isProductionMode: isProd }),
    setFirebaseConfig: (config) => updateState({ firebaseConfig: config }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
