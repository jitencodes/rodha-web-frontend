"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureUtmFromSearch } from "@/lib/tracking/utm";

function UtmCaptureInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureUtmFromSearch(searchParams.toString());
  }, [searchParams]);

  return null;
}

/** Persists landing `utm_*` query params across client navigations. */
export function UtmCapture() {
  return (
    <Suspense fallback={null}>
      <UtmCaptureInner />
    </Suspense>
  );
}
