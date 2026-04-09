"use client";

import { useState } from "react";

export default function EmailCaptureBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sticky-banner" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 py-3 text-center text-sm font-bold"
           style={{ background: "var(--bg-card)", borderTop: "1px solid var(--gold)", color: "var(--gold)" }}>
        You are in — check your email for the Atlas Playbook.
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4"
         style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <form onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 text-sm font-semibold text-center sm:text-left">
          <span style={{ color: "var(--gold)" }}>Free:</span>{" "}
          <span>The Atlas Playbook — the exact system behind a 24/7 AI agent</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm outline-none flex-1 sm:w-56"
            style={{
              background: "var(--bg-card-alt)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 rounded-lg font-bold text-white text-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)" }}
          >
            {status === "loading" ? "..." : "Get It Free"}
          </button>
        </div>
        {status === "error" && (
          <p className="text-xs" style={{ color: "var(--red)" }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
