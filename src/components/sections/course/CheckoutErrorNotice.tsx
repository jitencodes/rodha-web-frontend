"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/** Surfaces a checkout failure that bounced back to the course page. */
export function CheckoutErrorNotice({ message }: { message?: string }) {
  useEffect(() => {
    const text = message?.trim();
    if (!text) return;
    toast.error(text);
  }, [message]);

  return null;
}
