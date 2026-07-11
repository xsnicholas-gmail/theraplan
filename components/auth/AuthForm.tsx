"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Mode = "sign-in" | "sign-up";

const callbackErrors: Record<string, string> = {
  auth_callback_failed: "We could not complete that email confirmation link. Please request a new link or sign in again.",
};

export function AuthForm({ callbackError }: { callbackError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(callbackError ? callbackErrors[callbackError] || callbackErrors.auth_callback_failed : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (!email || password.length < 6) {
      setError("Enter an email and a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClient();

    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback`;
      const result = mode === "sign-up"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo } })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;
      if (mode === "sign-up" && !result.data.session) {
        setMessage("Check your email to confirm your account. The link will return you to TheraPlan.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card space-y-4">
      <div>
        <p className="eyebrow">Lock it down</p>
        <h2>{mode === "sign-in" ? "Sign in" : "Create account"}</h2>
        <p className="muted">Demo plans remain visible without login; accounts prepare TheraPlan for private user data.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} required /></label>
        {error && <p className="error">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <button className="primary" type="submit" disabled={loading}>{loading ? "Working…" : mode === "sign-in" ? "Sign in" : "Sign up"}</button>
      </form>
      <button className="linkbutton secondary" type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>
        {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}
