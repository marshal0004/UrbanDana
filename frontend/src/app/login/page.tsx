"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Check } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 px-4 py-16 sm:py-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight text-brand-black">Welcome back</h1>
        <p className="mt-2 text-sm text-brand-black/60">
          Sign in to track orders, sync your bag, and unlock member drops.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 bg-brand-red/10 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-50 border border-brand-black/10 rounded-lg pl-10 pr-3 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Password</span>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-brand-black/10 rounded-lg pl-10 pr-10 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black transition"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="sr-only"
            />
            <span className={`w-4 h-4 rounded border flex items-center justify-center transition ${remember ? "bg-brand-red border-brand-red" : "border-brand-black/20"}`}>
              {remember && <Check className="w-3 h-3 text-brand-black" />}
            </span>
            <span className="text-xs text-brand-black/60">Remember me</span>
          </label>
          <a href="#" className="text-xs text-brand-red hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red hover:bg-brand-red-soft disabled:opacity-50 transition text-brand-black text-sm font-bold uppercase tracking-widest py-3.5 rounded-full flex items-center justify-center gap-2"
        >
          {loading ? "Signing in…" : "Sign In"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-xs text-brand-black/50 pt-2">
          New to UrbanDana?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-brand-red hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-brand-black/60">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
