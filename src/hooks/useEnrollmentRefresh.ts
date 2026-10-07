"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthed } from "@/lib/auth/session-expired";

const INTERVAL_MS = 4 * 60 * 1000;
/** Avoid hammering RSC revalidation if refresh succeeds often. */
const REFRESH_THROTTLE_MS = 60 * 1000;

/**
 * Background sync of Graphy enrollments while the account shell is mounted.
 * Fires once on mount and every 4 minutes; no loading UI.
 */
export function useEnrollmentRefresh(): void {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastRouterRefreshRef = useRef(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (cancelled || inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const res = await fetchAuthed("/api/account/enrollments/refresh", {
          method: "POST",
        });
        if (!res.ok || cancelled) return;
        const now = Date.now();
        if (now - lastRouterRefreshRef.current >= REFRESH_THROTTLE_MS) {
          lastRouterRefreshRef.current = now;
          router.refresh();
        }
      } catch {
        // silent
      } finally {
        inFlightRef.current = false;
      }
    }

    void run();
    intervalRef.current = setInterval(() => {
      void run();
    }, INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [router]);
}
