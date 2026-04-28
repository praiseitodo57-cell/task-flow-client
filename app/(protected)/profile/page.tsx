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
import { Card, CardContent } from "../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Skeleton } from "../../../components/ui/skeleton";
import { Loader2, User, Mail, FileText, ArrowLeft } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.user);
      setForm({ name: res.data.user.name || "", bio: res.data.user.bio || "", avatar: res.data.user.avatar || "" });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {};
      if (form.name) payload.name = form.name;
      if (form.bio !== undefined) payload.bio = form.bio;
      if (form.avatar) payload.avatar = form.avatar;

      const res = await api.patch("/user/profile", payload);
      setProfile(res.data.user);
      const token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refresh_token") || "";
      login(res.data.user, token, refreshToken);
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors.map((e: any) => e.message).join(", ")
        : err.response?.data?.error || "Failed to update profile";
      toast.error("Error", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

        {loading ? (
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-border bg-card shadow-sm mb-5">
              <CardContent className="pt-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar} />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{profile?.name}</h2>
                    <p className="text-muted-foreground text-sm">{profile?.email}</p>
                    {profile?.bio && <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>}
                  </div>
                </div>

                {/* View mode */}
                {!editing && (
                  <div className="space-y-3">
                    {[
                      { icon: User, label: "Full name", value: profile?.name },
                      { icon: Mail, label: "Email", value: profile?.email },
                      { icon: FileText, label: "Bio", value: profile?.bio || "No bio yet" },
                      { icon: null, label: "Member since", value: profile?.created_at ? formatDate(profile.created_at) : "—" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        {item.icon && <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        {!item.icon && <span className="text-muted-foreground text-xs w-4">📅</span>}
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Edit mode */}
                {editing && (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Full name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell your team about yourself" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Avatar URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://example.com/avatar.jpg" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={saving}>
                        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {!editing && (
              <Button onClick={() => setEditing(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Edit profile
              </Button>
            )}
          </>
        )}
      </main>
    </div>
  );
}