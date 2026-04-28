export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  due_date?: string;
  assigned_to?: string;
  created_at: string;
}

export interface Member {
  id: string;
  project_id: string;
  user_id: string;
  role: "viewer" | "editor" | "admin";
  joined_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_at: string;
}