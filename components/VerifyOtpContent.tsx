"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../lib/axios";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Mail } from "lucide-react";

export default function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Account created!", { description: "You can now sign in." });
      if (redirect) {
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      toast.error("Verification failed", {
        description: err.response?.data?.error || "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <CardTitle className="text-lg text-foreground">Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify email"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { VerifyOtpContent };