"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ClampTooltipProps {
  text: string;
  lines: 2 | 5;
  className?: string;
  tooltipClassName?: string;
}

const LINE_CLAMP: Record<ClampTooltipProps["lines"], string> = {
  2: "line-clamp-2",
  5: "line-clamp-5",
};

/**
 * Truncates text with line-clamp and shows a viewport-aware custom tooltip
 * with the full copy when truncated (hover on pointer devices, tap on touch).
 * Renders the tooltip in a portal so card `overflow-hidden` cannot clip it.
 */
export function ClampTooltip({
  text,
  lines,
  className,
  tooltipClassName,
}: ClampTooltipProps) {
  const tipId = useId();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    setTruncated(el.scrollHeight > el.clientHeight + 1);
  }, []);

  const updateCoords = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxWidth = Math.min(22 * 16, window.innerWidth - 32);
    let left = rect.left;
    if (left + maxWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - 16 - maxWidth);
    }
    setCoords({
      top: rect.top,
      left,
      width: Math.min(Math.max(rect.width, 12 * 16), maxWidth),
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, text, lines]);

  useEffect(() => {
    const el = textRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const root = textRef.current?.parentElement;
      const tip = document.getElementById(tipId);
      const target = event.target as Node;
      if (root?.contains(target) || tip?.contains(target)) return;
      setOpen(false);
    };
    const onReposition = () => updateCoords();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, tipId, updateCoords]);

  if (!text.trim()) return null;

  const tooltip =
    mounted && truncated && open && coords
      ? createPortal(
          <span
            id={tipId}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transform: "translateY(calc(-100% - 8px))",
            }}
            className={cn(
              "z-80 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-[13px] leading-snug font-medium text-neutral-700 shadow-lg",
              tooltipClassName
            )}
          >
            {text}
          </span>,
          document.body
        )
      : null;

  return (
    <span
      className={cn("relative block", truncated && "cursor-help")}
      onMouseEnter={() => {
        if (!truncated) return;
        updateCoords();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        if (!truncated) return;
        updateCoords();
        setOpen(true);
      }}
      onBlur={() => setOpen(false)}
      onClick={(event) => {
        if (!truncated) return;
        event.preventDefault();
        event.stopPropagation();
        updateCoords();
        setOpen((prev) => !prev);
      }}
    >
      <p
        ref={textRef}
        className={cn(LINE_CLAMP[lines], className)}
        aria-describedby={truncated && open ? tipId : undefined}
      >
        {text}
      </p>
      {tooltip}
    </span>
  );
}
