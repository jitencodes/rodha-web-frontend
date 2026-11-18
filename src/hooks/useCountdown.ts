"use client";

import { useSyncExternalStore } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  /** False during SSR and hydration, when the values are placeholders. */
  ready: boolean;
}

const PLACEHOLDER: CountdownResult = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
  ready: false,
};

function subscribeToSecondTicks(onTick: () => void) {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
}

/** Whole seconds, so the snapshot stays stable between ticks. */
function getNowSeconds() {
  return Math.floor(Date.now() / 1000);
}

/** No clock on the server; hydration reuses this so markup matches. */
function getServerNowSeconds() {
  return null;
}

/**
 * Live countdown to `targetDate`. The server render and hydration use a fixed
 * placeholder (`ready: false`) so the time-dependent digits never cause a
 * hydration mismatch; the real values appear right after hydration.
 */
export function useCountdown(targetDate: string | Date): CountdownResult {
  const nowSeconds = useSyncExternalStore(
    subscribeToSecondTicks,
    getNowSeconds,
    getServerNowSeconds
  );

  if (nowSeconds === null) return PLACEHOLDER;
  return calculateTimeLeft(targetDate, nowSeconds * 1000);
}

function calculateTimeLeft(targetDate: string | Date, now: number): CountdownResult {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, ready: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
    ready: true,
  };
}
