"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Check } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!agree) {
      setError("Please accept the terms to continue");
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight text-brand-black">Join the squad</h1>
        <p className="mt-2 text-sm text-brand-black/60">
          Create an account for early drop access, member pricing, and faster checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 bg-brand-red/10 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">First name</span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
              <input
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Vikram"
                className="w-full bg-gray-50 border border-brand-black/10 rounded-lg pl-10 pr-3 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
              />
            </div>
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Last name</span>
            <input
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Kumar"
              className="w-full bg-gray-50 border border-brand-black/10 rounded-lg px-3 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-50 border border-brand-black/10 rounded-lg pl-10 pr-3 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Phone (optional)</span>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98765 43210"
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
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Min. 6 characters"
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

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-brand-black/60 mb-1.5">Confirm password</span>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-gray-50 border border-brand-black/10 rounded-lg pl-10 pr-3 py-3 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-red"
            />
          </div>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="sr-only"
          />
          <span className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition shrink-0 ${agree ? "bg-brand-red border-brand-red" : "border-brand-black/20"}`}>
            {agree && <Check className="w-3 h-3 text-brand-black" />}
          </span>
          <span className="text-xs text-brand-black/60">
            I agree to UrbanDana&apos;s{" "}
            <a href="#" className="text-brand-red hover:underline">Terms</a> and{" "}
            <a href="#" className="text-brand-red hover:underline">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red hover:bg-brand-red-soft disabled:opacity-50 transition text-brand-black text-sm font-bold uppercase tracking-widest py-3.5 rounded-full flex items-center justify-center gap-2"
        >
          {loading ? "Creating account…" : "Create Account"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-xs text-brand-black/50 pt-2">
          Already have an account?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-brand-red hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-brand-black/60">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
