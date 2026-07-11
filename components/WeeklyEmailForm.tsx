"use client";

import { FormEvent, useState } from "react";

export function WeeklyEmailForm() {
  const [email, setEmail] = useState("");
  const [approved, setApproved] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/weekly-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, approved, approved_by: "builder-preview" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not send weekly email.");
      setMessage(`Weekly email sent${data.id ? ` (${data.id})` : ""}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send weekly email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="card space-y-4" onSubmit={submit}>
      <div>
        <p className="eyebrow">Send preview</p>
        <h2>Email this week&apos;s plan</h2>
        <p className="muted">Sending requires an explicit approval checkbox and a server-side Resend key.</p>
      </div>
      <label>Recipient email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
      <label className="checkbox-line"><input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} />Approve sending this preview email</label>
      {error && <p className="error">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <button className="primary" type="submit" disabled={sending || !approved}>{sending ? "Sending…" : "Send weekly email"}</button>
    </form>
  );
}
