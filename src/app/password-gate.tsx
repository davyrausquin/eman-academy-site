"use client";

import { useState, useEffect, type FormEvent } from "react";

// TIJDELIJK — verwijder dit component en de import in layout.tsx om de beveiliging uit te zetten
const PASSWORD = "eman2026";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("ea-auth") === "true") {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem("ea-auth", "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  // Voorkom flash of content voor SSR
  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] px-5">
      <div className="text-center">
        <span className="font-display text-4xl tracking-[0.2em] text-accent/30 sm:text-5xl">
          EA
        </span>
        <p className="mt-2 font-display text-xl tracking-[0.25em] text-white sm:text-2xl">
          EMAN ACADEMY
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
          Echte training voelt zo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xs">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wachtwoord"
          autoFocus
          className={`w-full border bg-[#111] px-4 py-3.5 text-center text-[14px] text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 ${
            error
              ? "border-red-500/50 bg-red-500/5"
              : "border-white/[0.08] focus:border-accent/50"
          }`}
        />
        <button
          type="submit"
          className="glow-navy mt-3 w-full bg-navy py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all"
        >
          Toegang
        </button>
        {error && (
          <p className="mt-3 text-center text-[12px] text-red-400/70">
            Onjuist wachtwoord
          </p>
        )}
      </form>
    </div>
  );
}
