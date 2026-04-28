
"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import ThemeToggle from "../components/ThemeToggle";
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  Zap,
  Shield,
  Bell,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Project Management",
    desc: "Create and organize projects with ease. Keep everything in one place.",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite team members, assign roles and work together seamlessly.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    icon: CheckCircle2,
    title: "Task Tracking",
    desc: "Create tasks, assign them to members and track progress in real time.",
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    icon: Bell,
    title: "Email Notifications",
    desc: "Get notified when you're invited to a project or assigned a task.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    icon: Shield,
    title: "Role Based Access",
    desc: "Control who can view, edit or manage your projects with custom roles.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "Built on a modern stack — Next.js, Supabase, and Express for speed.",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300",
  },
];

const steps = [
  { step: "01", title: "Create an account", desc: "Sign up with your email. We'll verify it with a quick OTP." },
  { step: "02", title: "Create a project", desc: "Set up your project and invite team members by email." },
  { step: "03", title: "Assign tasks", desc: "Create tasks, set due dates and assign them to your team." },
  { step: "04", title: "Track progress", desc: "Watch tasks move from To Do → In Progress → Done." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground tracking-tight text-lg">TaskFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition">How it works</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
          Manage projects,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">collaborate</span>
          <br /> with your team
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          TaskFlow helps teams create projects, invite members, assign tasks and
          track progress — all in one clean, simple workspace.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/register">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8 h-12 text-base">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 text-base px-8">
              Sign in
            </Button>
          </Link>
        </div>

        {/* Mock kanban board */}
        <div className="mt-16 bg-muted border border-border rounded-2xl p-6 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 bg-border rounded-full h-5 ml-2" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["To Do", "In Progress", "Done"].map((col, ci) => (
              <div key={col} className="bg-background rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-foreground">{col}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {ci === 0 ? 3 : ci === 1 ? 2 : 1}
                  </span>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: ci === 0 ? 3 : ci === 1 ? 2 : 1 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-2.5 shadow-sm">
                      <div
                        className={`h-2.5 rounded-full mb-2 ${
                          ci === 0 ? "bg-slate-200 dark:bg-slate-700"
                          : ci === 1 ? "bg-blue-200 dark:bg-blue-900"
                          : "bg-green-200 dark:bg-green-900"
                        }`}
                        style={{ width: `${60 + i * 15}%` }}
                      />
                      <div className="h-2 bg-muted rounded-full w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything your team needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete project management solution built for small and growing teams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="border-border bg-card shadow-none hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get your team up and running in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 dark:bg-indigo-800 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Create your first project for free. No credit card required.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 gap-2 px-8 h-12 text-base font-semibold">
              Get started free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">TaskFlow</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TaskFlow. Built with Next.js & Supabase.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition">Sign in</Link>
            <Link href="/register" className="hover:text-foreground transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}