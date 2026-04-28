"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../lib/axios";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "../../../components/ui/card";
import { Loader2, LayoutDashboard } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("OTP sent!", { description: "Check your email for the verification code." });
      const redirect = searchParams.get("redirect");
      const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect)}` : "";
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}${redirectParam}`);
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors.map((e: any) => e.message).join(", ")
        : err.response?.data?.error || "Registration failed";
      toast.error("Error", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage projects with your team</p>
        </div>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Create an account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Praise Itodo" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input id="bio" name="bio" placeholder="e.g. Full-stack developer" value={form.bio} onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending OTP...</> : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}