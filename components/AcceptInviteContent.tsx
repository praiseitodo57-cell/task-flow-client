"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../lib/axios";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  LayoutDashboard,
  FolderOpen,
  UserPlus,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
}

type PageState = "loading" | "success" | "error" | "unauthenticated";

export default function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const project_id = searchParams.get("project_id");

  const [state, setState] = useState<PageState>("loading");
  const [role, setRole] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !project_id) {
      setError("Invalid invitation link — missing token or project ID.");
      setState("error");
      return;
    }

    const userToken = localStorage.getItem("token");

    if (!userToken) {
      // Not logged in — save invite for after registration/login
      localStorage.setItem(
        "pending_invite",
        JSON.stringify({ token, project_id })
      );
      setState("unauthenticated");
      return;
    }

    acceptInvite();
  }, []);

  const acceptInvite = async () => {
    try {
      const res = await api.post(
        `/project/accept-invite?project_id=${project_id}&token=${token}`
      );
      setProject(res.data.project);
      setRole(res.data.role);
      setState("success");
      localStorage.removeItem("pending_invite");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to accept invitation. The link may have expired."
      );
      setState("error");
    }
  };

  // Loading
  if (state === "loading") {
    return (
      <PageWrapper>
        <Card className="shadow-sm border-[--border]">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-full bg-[--primary]/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[--primary] animate-spin" />
            </div>
            <CardTitle className="text-lg">Accepting invitation...</CardTitle>
            <CardDescription>
              Please wait while we process your invitation.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageWrapper>
    );
  }

  // Not authenticated
  if (state === "unauthenticated") {
    return (
      <PageWrapper>
        <Card className="shadow-sm border-[--border]">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-lg">You have been invited!</CardTitle>
            <CardDescription className="mt-1">
              You need an account to join this project. Create one or sign in
              and the invitation will be waiting for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button
              className="w-full bg-[--primary] text-[--primary-foreground] hover:opacity-90 gap-2"
              onClick={() =>
                router.push(
                  `/register?redirect=/project/accept-invite?project_id=${project_id}&token=${token}`
                )
              }
            >
              <UserPlus className="w-4 h-4" />
              Create an account
            </Button>
            <Button
              variant="outline"
              className="w-full border-[--border]"
              onClick={() =>
                router.push(
                  `/login?redirect=/project/accept-invite?project_id=${project_id}&token=${token}`
                )
              }
            >
              I already have an account
            </Button>
            <p className="text-center text-xs text-[--muted-foreground] pt-1">
              After signing in you will be taken back to accept the invite.
            </p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  // Success
  if (state === "success") {
    return (
      <PageWrapper>
        <Card className="shadow-sm border-[--border] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
          <CardHeader className="text-center pb-2 pt-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <CardTitle className="text-xl">Invitation Accepted! 🎉</CardTitle>
            <CardDescription className="mt-2 text-sm">
              You have successfully joined{" "}
              <strong className="text-[--foreground]">{project?.title}</strong> as a{" "}
              <span className="font-semibold text-[--primary] capitalize">
                {role}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-6 space-y-3">
            {project?.description && (
              <div className="bg-[--muted] border border-[--border] rounded-lg p-3 text-sm text-[--muted-foreground] text-left">
                <p className="text-xs font-medium text-[--muted-foreground] mb-1 uppercase tracking-wide">
                  About the project
                </p>
                {project.description}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-xs text-[--muted-foreground]">Your role:</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : role === "editor"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-[--secondary] text-[--secondary-foreground]"
                }`}
              >
                {role}
              </span>
            </div>

            <Button
              className="w-full bg-[--primary] text-[--primary-foreground] hover:opacity-90 gap-2"
              onClick={() => router.push(`/project/${project?.id}`)}
            >
              <FolderOpen className="w-4 h-4" />
              Go to {project?.title}
            </Button>

            <Button
              variant="outline"
              className="w-full border-[--border] gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to my dashboard
            </Button>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  // Error
  return (
    <PageWrapper>
      <Card className="shadow-sm border-[--border]">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-full bg-[--destructive]/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-[--destructive]" />
          </div>
          <CardTitle className="text-lg">Invitation Error</CardTitle>
          <CardDescription className="mt-1">{error}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full bg-[--primary] text-[--primary-foreground] hover:opacity-90"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full border-[--border]"
            onClick={() => router.push("/")}
          >
            Go home
          </Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[--primary] flex items-center justify-center mx-auto mb-3">
            <LayoutDashboard className="w-6 h-6 text-[--primary-foreground]" />
          </div>
          <h1 className="text-xl font-bold text-[--foreground]">TaskFlow</h1>
          <p className="text-[--muted-foreground] text-sm mt-0.5">
            Project collaboration made simple
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}


export { AcceptInviteContent };