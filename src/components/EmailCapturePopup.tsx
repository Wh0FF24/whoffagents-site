"use client";

import { useState, useEffect, useCallback } from "react";
import { subscribeToBeehiiv } from '../utils/beehiiv.js';

export default function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && !dismissed && !isVisible) {
      const alreadyDismissed = sessionStorage.getItem("popup-dismissed");
      if (!alreadyDismissed) {
        setIsVisible(true);
      }
    }
  }, [dismissed, isVisible]);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem("popup-dismissed")) {
      setDismissed(true);
      return;
    }

    // Exit intent detection
    document.addEventListener("mouseout", handleExitIntent);

    // Fallback: show after 30 seconds if not dismissed
    const timer = setTimeout(() => {
      if (!dismissed && !sessionStorage.getItem("popup-dismissed")) {
        setIsVisible(true);
      }
    }, 30000);

    return () => {
      document.removeEventListener("mouseout", handleExitIntent);
      clearTimeout(timer);
    };
  }, [dismissed, handleExitIntent]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem("popup-dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await subscribeToBeehiiv(email, 'exit-popup');
      setStatus("success");
      if (typeof window !== 'undefined' && typeof (window as any).plausible === 'function') {
        (window as any).plausible('Email-Capture', { props: { source: 'exit-popup' } });
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-lg animate-fade-in-up"
           style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px" }}>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{ background: "var(--bg-card-alt)", color: "var(--text-muted)" }}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Badge */}
          <div className="inline-block px-4 py-1 mb-4 rounded-full text-xs font-semibold tracking-widest uppercase"
               style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>
            Free Playbook
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-extrabold leading-tight mb-3">
            Get the <span style={{ color: "var(--red)" }}>Atlas Playbook</span>
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            The exact system behind a 24/7 AI agent that built 6 products in 48 hours.
            Includes 5 ready-to-use Claude Code prompts, the wake script architecture,
            and the full content pipeline blueprint.
          </p>

          {status === "success" ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-3">&#10003;</div>
              <p className="text-lg font-bold" style={{ color: "var(--gold)" }}>
                You are in. Check your email.
              </p>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                Redirecting to your download...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="First name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: "var(--bg-card-alt)",
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
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: "var(--bg-card-alt)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-wide transition-all cursor-pointer animate-pulse-glow disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)",
                }}
              >
                {status === "loading" ? "Sending..." : "Get the Free Playbook"}
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
          )}
        </div>
      </div>
    </div>
  );
}
