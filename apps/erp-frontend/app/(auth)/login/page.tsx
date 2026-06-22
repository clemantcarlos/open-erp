"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch(`${API_URL}/auth/local/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Invalid credentials");
        return;
      }

      localStorage.setItem("accessToken", data.data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
      router.push("/");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-zinc-900 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white">OpenERP</h1>
          <p className="max-w-sm text-zinc-400">
            Streamline your business operations with our comprehensive ERP solution.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900">
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className="text-xl font-semibold">OpenERP</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Forgot password?
                </a>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button className="w-full" size="lg" disabled={loading} type = "submit">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
