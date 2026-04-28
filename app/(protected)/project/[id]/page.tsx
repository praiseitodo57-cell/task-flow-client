"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "sonner";
import Navbar from "../../../../components/ui/Navbar";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import MemberSelector from "../../../../components/MemberSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Badge } from "../../../../components/ui/badge";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  Plus,
  Loader2,
  ArrowLeft,
  UserPlus,
  CheckCircle2,
  Clock,
  Circle,
  Trash2,
  CalendarDays,
  User,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  due_date?: string;
  assigned_to?: string;
  created_at: string;
}

interface TaskForm {
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  due_date: string;
  assigned_to: string;
}

interface InviteForm {
  email: string;
  role: "viewer" | "editor" | "admin";
}

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    icon: Circle,
    iconColor: "text-[--muted-foreground]",
    colColor: "bg-[--muted]",
    badgeColor: "bg-[--secondary] text-[--secondary-foreground]",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    iconColor: "text-blue-500",
    colColor: "bg-blue-500/10",
    badgeColor: "bg-blue-500/15 text-blue-500",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    colColor: "bg-green-500/10",
    badgeColor: "bg-green-500/15 text-green-600 dark:text-green-400",
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const project_id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskOpen, setTaskOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
    assigned_to: "",
  });

  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: "",
    role: "editor",
  });

  const isOwner = project?.user_id === user?.id;

  useEffect(() => {
    if (!project_id || project_id === "[id]") return;
    console.log("PROJECT ID:", project_id);
    fetchAll();
  }, [project_id]);

  const fetchAll = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get(`/project/${project_id}`),
        api.get(`/project/${project_id}/task`),
      ]);
      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks);
    } catch {
      toast.error("Failed to load project");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload: Partial<TaskForm> = { ...taskForm };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.due_date) delete payload.due_date;
      if (!payload.description) delete payload.description;

      const res = await api.post(`/project/${project_id}/task`, payload);
      setTasks([res.data.task, ...tasks]);
      setTaskForm({ title: "", description: "", status: "todo", due_date: "", assigned_to: "" });
      setTaskOpen(false);
      toast.success("Task created!");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors.map((e: any) => e.message).join(", ")
        : err.response?.data?.error || "Failed to create task";
      toast.error("Error", { description: message });
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await api.post(`/project/${project_id}/invite`, inviteForm);
      setInviteForm({ email: "", role: "editor" });
      setInviteOpen(false);
      toast.success("Invitation sent!", {
        description: `Invite sent to ${inviteForm.email}`,
      });
    } catch (err: any) {
      toast.error("Error", {
        description: err.response?.data?.error || "Failed to send invite",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateStatus = async (task_id: string, status: string) => {
    try {
      const res = await api.patch(`/project/${project_id}/task/${task_id}`, { status });
      setTasks(tasks.map((t) => (t.id === task_id ? res.data.task : t)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const payload: Partial<TaskForm> = { ...taskForm };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.due_date) delete payload.due_date;
      if (!payload.description) delete payload.description;

      const res = await api.patch(`/project/${project_id}/task/${editingTask.id}`, payload);
      setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data.task : t)));
      setEditOpen(false);
      setEditingTask(null);
      toast.success("Task updated!");
    } catch (err: any) {
      toast.error("Error", {
        description: err.response?.data?.error || "Failed to update task",
      });
    }
  };

  const handleDeleteTask = async (task_id: string) => {
    try {
      await api.delete(`/project/${project_id}/task/${task_id}`);
      setTasks(tasks.filter((t) => t.id !== task_id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      due_date: task.due_date || "",
      assigned_to: task.assigned_to || "",
    });
    setEditOpen(true);
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : null;

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--background]">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72 mb-8" />
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[--muted] rounded-xl p-4">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const TaskFormFields = () => (
    <div className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          placeholder="e.g. Design the homepage"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>
          Description{" "}
          <span className="text-[--muted-foreground] font-normal">(optional)</span>
        </Label>
        <Input
          placeholder="Add more details..."
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={taskForm.status}
            onValueChange={(v) =>
              setTaskForm({ ...taskForm, status: v as TaskForm["status"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>
            Due date{" "}
            <span className="text-[--muted-foreground] font-normal">(optional)</span>
          </Label>
          <Input
            type="date"
            value={taskForm.due_date}
            onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>
          Assign to{" "}
          <span className="text-[--muted-foreground] font-normal">(optional)</span>
        </Label>
        <MemberSelector
          project_id={project_id}
          value={taskForm.assigned_to}
          onChange={(v) => setTaskForm({ ...taskForm, assigned_to: v === "unassigned" ? "" : v })}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[--background]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-[--foreground] mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[--foreground]">
                {project?.title}
              </h1>
              {project?.description && (
                <p className="text-[--muted-foreground] text-sm mt-1">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-500/15 text-green-600 dark:text-green-400"
                >
                  {grouped.done.length} completed
                </Badge>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                {/* Invite dialog */}
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <UserPlus className="w-4 h-4" /> Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Invite a team member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleInvite} className="space-y-4 mt-2">
                      <div className="space-y-1.5">
                        <Label>Email address</Label>
                        <Input
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteForm.email}
                          onChange={(e) =>
                            setInviteForm({ ...inviteForm, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Role</Label>
                        <Select
                          value={inviteForm.role}
                          onValueChange={(v) =>
                            setInviteForm({ ...inviteForm, role: v as InviteForm["role"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer — read only</SelectItem>
                            <SelectItem value="editor">Editor — can manage tasks</SelectItem>
                            <SelectItem value="admin">Admin — full access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setInviteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-[--primary] text-[--primary-foreground] hover:opacity-90"
                          disabled={inviting}
                        >
                          {inviting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send invite"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Create task dialog */}
                <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[--primary] text-[--primary-foreground] hover:opacity-90 gap-2">
                      <Plus className="w-4 h-4" /> Add task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create a task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTask}>
                      <TaskFormFields />
                      <div className="flex gap-2 pt-4 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setTaskOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-[--primary] text-[--primary-foreground] hover:opacity-90"
                          disabled={creating}
                        >
                          {creating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create task"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        {/* Edit task dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTask}>
              <TaskFormFields />
              <div className="flex gap-2 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[--primary] text-[--primary-foreground] hover:opacity-90"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="mb-6 bg-[--card] border border-[--border] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[--foreground]">
                Overall progress
              </span>
              <span className="text-sm font-semibold text-[--primary]">
                {Math.round((grouped.done.length / tasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[--muted] rounded-full h-2">
              <div
                className="bg-[--primary] h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(grouped.done.length / tasks.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[--muted-foreground]">
              <span>{grouped.todo.length} to do</span>
              <span>{grouped.in_progress.length} in progress</span>
              <span className="text-green-500 font-medium">
                {grouped.done.length} done
              </span>
            </div>
          </div>
        )}

        {/* Kanban board */}
        {tasks.length === 0 && !isOwner ? (
          <div className="text-center py-20 border-2 border-dashed border-[--border] rounded-xl bg-[--card]">
            <CheckCircle2 className="w-10 h-10 text-[--muted-foreground] mx-auto mb-3" />
            <h3 className="text-[--foreground] font-medium">No tasks yet</h3>
            <p className="text-[--muted-foreground] text-sm mt-1">
              The project owner hasn&apos;t created any tasks yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(grouped) as [keyof typeof STATUS_CONFIG, Task[]][]).map(
              ([status, statusTasks]) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;

                return (
                  <div key={status} className={`${config.colColor} rounded-xl p-4`}>
                    {/* Column header */}
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                      <span className="font-semibold text-sm text-[--foreground]">
                        {config.label}
                      </span>
                      <span className="ml-auto text-xs font-medium text-[--muted-foreground] bg-[--card] px-2 py-0.5 rounded-full border border-[--border]">
                        {statusTasks.length}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                      {statusTasks.length === 0 && (
                        <div className="text-center py-8 text-[--muted-foreground] text-sm">
                          No tasks
                        </div>
                      )}

                      {statusTasks.map((task) => (
                        <Card
                          key={task.id}
                          className="border-[--border] shadow-none bg-[--card] hover:shadow-sm transition-shadow"
                        >
                          <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm font-medium leading-snug text-[--card-foreground]">
                                {task.title}
                              </CardTitle>
                              {isOwner && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="text-[--muted-foreground] hover:text-[--foreground] transition flex-shrink-0 mt-0.5">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem onClick={() => openEditTask(task)}>
                                      <Pencil className="w-3.5 h-3.5 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-[--destructive] focus:text-[--destructive] focus:bg-[--destructive]/10"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-xs text-[--muted-foreground] mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </CardHeader>

                          <CardContent className="px-4 pb-4 pt-0 space-y-3">
                            <div className="flex items-center gap-3">
                              {task.due_date && (
                                <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
                                  <CalendarDays className="w-3 h-3" />
                                  <span>{formatDate(task.due_date)}</span>
                                </div>
                              )}
                              {task.assigned_to && (
                                <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
                                  <User className="w-3 h-3" />
                                  <span className="truncate max-w-[80px]">
                                    {task.assigned_to.slice(0, 8)}...
                                  </span>
                                </div>
                              )}
                            </div>

                            {isOwner && (
                              <Select
                                value={task.status}
                                onValueChange={(v) => handleUpdateStatus(task.id, v)}
                              >
                                <SelectTrigger className="h-7 text-xs border-[--border]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="todo">To Do</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            )}

                            {!isOwner && (
                              <span
                                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeColor}`}
                              >
                                {config.label}
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {/* Quick add button for owner */}
                      {isOwner && status === "todo" && (
                        <button
                          onClick={() => setTaskOpen(true)}
                          className="w-full py-2 text-xs text-[--muted-foreground] hover:text-[--primary] hover:bg-[--card] border border-dashed border-[--border] hover:border-[--primary] rounded-lg transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add task
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}