"use client";

import { Loader2 } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-sm p-8 shadow-2xl shadow-black/20">
      <LogoMark className="size-12 rounded-xl" />
      <h1 className="mt-5 font-display text-2xl font-bold">Admin login</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </button>
      <Link href="/" className="mt-4 block text-center text-sm text-muted hover:text-accent">
        ← Back to site
      </Link>
    </form>
  );
}
