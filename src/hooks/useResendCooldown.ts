"use client";

import { useEffect, useState } from "react";

const RESEND_SECONDS = 30;

/** Seconds until another code may be requested; 0 = now (or none sent yet). */
export function useResendCooldown(sentAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (sentAt == null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [sentAt]);

  if (sentAt == null) return 0;
  const elapsed = Math.max(0, Math.floor((now - sentAt) / 1000));
  return Math.max(0, RESEND_SECONDS - elapsed);
}
