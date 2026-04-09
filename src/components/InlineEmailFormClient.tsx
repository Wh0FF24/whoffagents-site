"use client";

import { useState } from "react";

export default function InlineEmailFormClient() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
        body: JSON.stringify({ email, name, source: "inline-playbook" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="py-6 text-center">
        <p className="text-lg font-bold" style={{ color: "var(--gold)" }}>
          You are in. Redirecting to your download...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
      <input
        type="text"
        placeholder="First name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none"
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      />
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg text-sm outline-none"
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-wide cursor-pointer animate-pulse-glow disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)",
        }}
      >
        {status === "loading" ? "Sending..." : "Get the Free Atlas Playbook"}
      </button>
      {status === "error" && (
        <p className="text-xs text-center" style={{ color: "var(--red)" }}>
          {errorMessage}
        </p>
      )}
      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
