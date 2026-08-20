"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile">
      <div className="w-full max-w-sm">
        <h1 className="font-sans font-bold text-headline-md text-primary mb-1">Portfolio Admin</h1>
        <p className="font-mono text-mono-label text-on-surface-variant mb-8">System Controller</p>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="label-base" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label-base" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-body-sm text-error font-mono">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
