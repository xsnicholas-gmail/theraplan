"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const days = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
];

export function RescheduleSession({ sessionId, currentDay }: { sessionId: string; currentDay: number | null }) {
  const router = useRouter();
  const [day, setDay] = useState(currentDay || 1);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function reschedule() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, day_of_week: day }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Could not reschedule session.");
        return;
      }
      setMessage("Session moved.");
      router.refresh();
    });
  }

  return (
    <div className="reschedule" aria-label="Reschedule session">
      <select value={day} onChange={(event) => setDay(Number(event.target.value))}>
        {days.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <button type="button" onClick={reschedule} disabled={isPending}>{isPending ? "Moving…" : "Move"}</button>
      {message && <small className={message.includes("Could") ? "error-text" : "success-text"}>{message}</small>}
    </div>
  );
}
