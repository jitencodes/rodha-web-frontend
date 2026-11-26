"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";
import { ACCOUNT_ORDERS_PAGE_COPY } from "@/data/account/orders";

const POLL_INTERVAL_MS = 3000;
/** The PDF queue normally finishes in seconds; stop polling after this. */
const POLL_CAP_MS = 60_000;

const btnClass =
  "inline-flex h-8 min-w-[9.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-caption font-medium";
const activeClass = cn(
  "cursor-pointer border-[var(--account-border-strong)] bg-[var(--account-surface)] text-[var(--account-text-secondary)]",
  "transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40",
  "disabled:cursor-wait disabled:opacity-70"
);

type OrderInvoiceButtonProps = {
  orderId: string;
  /** PDF link from the orders list, when already generated. */
  href?: string;
  /** Paid order: the invoice can be fetched or regenerated. */
  available?: boolean;
  /** Invoice row exists and its PDF is on the queue: poll in the background. */
  generating?: boolean;
};

async function fetchInvoiceUrl(orderId: string): Promise<string | null> {
  const res = await fetchAuthed(
    `/api/account/orders/${encodeURIComponent(orderId)}/invoice`,
    { cache: "no-store" }
  );
  const data = (await res.json().catch(() => null)) as {
    ok?: boolean;
    pdfUrl?: string | null;
  } | null;
  return res.ok && data?.ok ? data.pdfUrl || null : null;
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}

/** Polls the order until its invoice PDF link is set, or the cap is hit. */
async function pollInvoiceUrl(
  orderId: string,
  signal: AbortSignal
): Promise<string | null> {
  const deadline = Date.now() + POLL_CAP_MS;
  while (!signal.aborted && Date.now() < deadline) {
    await wait(POLL_INTERVAL_MS, signal);
    if (signal.aborted) return null;
    try {
      const url = await fetchInvoiceUrl(orderId);
      if (url) return url;
    } catch {
      // Network blip: keep polling until the cap.
    }
  }
  return null;
}

function openInvoice(url: string) {
  const win = window.open(url, "_blank");
  if (win) {
    win.opener = null;
    return;
  }
  // Popup blocked (opened after an await): open in this tab instead.
  window.location.assign(url);
}

/**
 * Download Invoice for a paid order. The PDF is generated on a queue after
 * payment, so the link may be missing: it is polled in the background, and a
 * click re-queues it (`retry-fulfill`) and opens it as soon as it is ready.
 */
export function OrderInvoiceButton({
  orderId,
  href,
  available,
  generating,
}: OrderInvoiceButtonProps) {
  const [url, setUrl] = useState<string | null>(href || null);
  const [preparing, setPreparing] = useState(false);
  const clickRef = useRef<AbortController | null>(null);

  // Background poll while the invoice PDF is still being generated.
  useEffect(() => {
    if (url || !generating) return;
    const controller = new AbortController();
    void pollInvoiceUrl(orderId, controller.signal).then((found) => {
      if (found) setUrl(found);
    });
    return () => controller.abort();
  }, [orderId, generating, url]);

  useEffect(() => () => clickRef.current?.abort(), []);

  async function prepareInvoice() {
    if (preparing) return;
    setPreparing(true);
    const controller = new AbortController();
    clickRef.current = controller;
    try {
      // Re-queues a missing PDF; its response carries the link when ready.
      const res = await fetchAuthed(
        `/api/account/orders/${encodeURIComponent(orderId)}/retry-fulfill`,
        { method: "POST" }
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        invoicePdfUrl?: string | null;
      } | null;
      if (!res.ok || !data?.ok) {
        toast.error(data?.error || "Unable to prepare the invoice right now.");
        return;
      }

      let found = data.invoicePdfUrl || null;
      if (!found) {
        toast.info("Preparing your invoice. It will open when ready.");
        found = await pollInvoiceUrl(orderId, controller.signal);
      }
      if (controller.signal.aborted) return;
      if (!found) {
        toast.error(
          "Your invoice is taking longer than usual. Please try again in a few minutes."
        );
        return;
      }
      setUrl(found);
      openInvoice(found);
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      clickRef.current = null;
      setPreparing(false);
    }
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className={cn(btnClass, activeClass)}
      >
        <Download className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {ACCOUNT_ORDERS_PAGE_COPY.downloadInvoiceLabel}
      </a>
    );
  }

  if (!available) {
    return (
      <span
        className={cn(
          btnClass,
          "cursor-not-allowed border-[var(--account-border)] bg-[var(--account-nav-hover)] text-[var(--account-text-muted)] opacity-60"
        )}
        aria-disabled="true"
        title="The invoice is available once payment is complete."
      >
        <Download className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {ACCOUNT_ORDERS_PAGE_COPY.downloadInvoiceLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void prepareInvoice()}
      disabled={preparing}
      aria-busy={preparing}
      className={cn(btnClass, activeClass)}
    >
      {preparing ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Download className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      )}
      {preparing
        ? "Preparing invoice…"
        : ACCOUNT_ORDERS_PAGE_COPY.downloadInvoiceLabel}
    </button>
  );
}
