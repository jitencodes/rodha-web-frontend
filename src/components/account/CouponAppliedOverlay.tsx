"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatCartMoney } from "@/lib/account/cart-totals";

type CouponAppliedOverlayProps = {
  code: string;
  discountAmount: number;
  onClose: () => void;
};

/** Full-page dimmer and success card for an applied checkout coupon. */
export function CouponAppliedOverlay({
  code,
  discountAmount,
  onClose,
}: CouponAppliedOverlayProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = window.setTimeout(() => onCloseRef.current(), 3400);
    return () => window.clearTimeout(timer);
  }, [code, discountAmount]);

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-6"
      role="status"
      aria-live="polite"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white px-8 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        style={{ animation: "coupon-applied-pop 280ms ease-out" }}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-montserrat text-[22px] font-bold leading-snug text-[#F97316]">
          {code} Applied Successfully
        </p>
        <p className="mt-3 text-[16px] leading-snug text-neutral-800">
          You saving Extra {formatCartMoney(discountAmount)} on this purchase
        </p>
      </div>
      <style>{`@keyframes coupon-applied-pop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>,
    document.body
  );
}
