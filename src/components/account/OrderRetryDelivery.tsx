"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

/** Paid order whose course or add-on could not be given: retry what failed. */
export function OrderRetryDelivery({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function retry() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetchAuthed(
        `/api/account/orders/${encodeURIComponent(orderId)}/retry-fulfill`,
        { method: "POST" }
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        // 409: refunded, or access was removed.
        toast.error(data?.error || "Unable to retry delivery right now.");
        return;
      }
      toast.success("Delivery retried. Your access will update shortly.");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
      <span className="font-medium text-red-500">Delivery incomplete</span>
      <button
        type="button"
        onClick={() => void retry()}
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[var(--account-accent)] disabled:cursor-wait disabled:opacity-60"
      >
        <RotateCw className={cn("size-3", pending && "animate-spin")} aria-hidden />
        {pending ? "Retrying…" : "Retry delivery"}
      </button>
    </div>
  );
}
