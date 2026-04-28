"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../../../components/ui/Navbar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Skeleton } from "../../../components/ui/skeleton";
import { Plus, FolderOpen, Loader2, CalendarDays, ArrowRight, LayoutDashboard } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/project");
      setProjects(res.data.projects);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post("/project", form);
      setProjects([res.data.project, ...projects]);
      setForm({ title: "", description: "" });
      setOpen(false);
      toast.success("Project created!", { description: res.data.project.title });
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors.map((e: any) => e.message).join(", ")
        : err.response?.data?.error || "Failed to create project";
      toast.error("Error", { description: message });
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good day, {user?.name?.split(" ")[0]} 
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? "Loading your projects..."
                : projects.length === 0 ? "No projects yet — create one to get started"
                : `You have ${projects.length} project${projects.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" /> New project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create a new project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Project name</Label>
                  <Input id="title" placeholder="e.g. Mobile App Redesign" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input id="description" placeholder="What is this project about?" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={creating}>
                    {creating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : "Create project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-border bg-card shadow-none">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total projects</p>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-none">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">This month</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter((p) => new Date(p.created_at).getMonth() === new Date().getMonth()).length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-none">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Latest</p>
                <p className="text-sm font-semibold text-foreground truncate">{projects[0]?.title || "—"}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border bg-card">
                <CardHeader className="pb-3">
                  <Skeleton className="h-9 w-9 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </CardHeader>
                <CardContent><Skeleton className="h-3 w-1/3" /></CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-foreground font-semibold text-lg mb-1">No projects yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Create your first project and invite your team</p>
            <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" /> New project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="border-border bg-card hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-3">
                      <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <CardTitle className="text-base leading-tight text-foreground">{project.title}</CardTitle>
                  {project.description && (
                    <CardDescription className="text-xs line-clamp-2 mt-0.5">{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}