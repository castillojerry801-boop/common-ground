"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-12 text-center">
          Common Ground Workshop
        </p>

        {sent ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-3">
              Check your email.
            </h1>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              If an account exists for{" "}
              <span className="text-zinc-300">{email}</span>, you&apos;ll
              receive a password reset link shortly.
            </p>
            <a
              href="/login"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Back to sign in
            </a>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-50 leading-tight mb-3">
                Reset your password.
              </h1>
              <p className="text-zinc-500 text-base leading-relaxed">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleReset} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-white transition-colors duration-150 disabled:opacity-40"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <a
                href="/login"
                className="text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
              >
                Back to sign in
              </a>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
