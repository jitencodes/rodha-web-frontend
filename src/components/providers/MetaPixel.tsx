"use client";

import { useEffect } from "react";
import { getMetaPixelId } from "@/lib/constants";

type FbqFn = {
  (...args: unknown[]): void;
  queue?: unknown[];
  push?: FbqFn;
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

function callFbq(...args: unknown[]) {
  const fbq = window.fbq;
  if (typeof fbq === "function") {
    fbq(...args);
  }
}

/** Meta Pixel bootstrap when NEXT_PUBLIC_META_PIXEL_ID is set. */
export function MetaPixel() {
  useEffect(() => {
    const pixelId = getMetaPixelId();
    if (!pixelId || typeof window === "undefined") return;
    if (window.fbq) return;

    const queue: unknown[] = [];
    const n = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        queue.push(args);
      }
    } as FbqFn;
    n.queue = queue;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    window.fbq = n;
    if (!window._fbq) window._fbq = n;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    callFbq("init", pixelId);
    callFbq("track", "PageView");
  }, []);

  return null;
}

export function trackMetaPurchase(value?: number, currency = "INR") {
  if (typeof window === "undefined" || !window.fbq) return;
  if (typeof value === "number" && Number.isFinite(value)) {
    callFbq("track", "Purchase", { value, currency });
  } else {
    callFbq("track", "Purchase");
  }
}
