"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  /** Slug of the business whose branded login is being used. */
  orgSlug?: string;
}

export default function LoginForm({ orgSlug }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Carry org context into the callback so role routing can use it.
    const callbackUrl = orgSlug
      ? `/auth/callback?org=${encodeURIComponent(orgSlug)}`
      : "/auth/callback";

    router.push(callbackUrl);
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-5 w-full">
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
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 -mt-1" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-1 py-3.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-white transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Opening…" : "Sign In"}
      </button>

      <a
        href={
          orgSlug
            ? `/login/forgot-password?org=${encodeURIComponent(orgSlug)}`
            : "/login/forgot-password"
        }
        className="text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
      >
        Forgot password?
      </a>
    </form>
  );
}
