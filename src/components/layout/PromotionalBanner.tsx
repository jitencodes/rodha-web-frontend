"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { getAnnouncementIntervalMs } from "@/lib/api/env";

import type { AnnouncementViewModel } from "@/lib/api/modules/announcements/types";

interface PromotionalBannerProps {
  className?: string;
  announcements?: AnnouncementViewModel[];
  intervalMs?: number;
}

function AnnouncementCountdown({
  endAt,
  paused = false,
}: {
  endAt: string;
  paused?: boolean;
}) {
  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(endAt);

  if (isExpired) return null;

  const units = [
    { value: days, label: "d" },
    { value: hours, label: "h" },
    { value: minutes, label: "m" },
    { value: seconds, label: "s" },
  ];

  return (
    <div
      className={cn(
        "hidden sm:flex items-center gap-2 shrink-0",
        paused && "pointer-events-none"
      )}
    >
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center min-w-[34px] h-6 px-1.5 rounded-[4px] bg-[#1B130D] text-[11px] font-bold tabular-nums text-text-primary">
            {String(unit.value).padStart(2, "0")}

            <span className="text-text-dimmed font-medium ml-0.5 text-[10px]">
              {unit.label}
            </span>
          </span>

          {i < units.length - 1 && (
            <span className="text-white text-[10px] font-bold">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

interface AnnouncementFaceProps {
  announcement: AnnouncementViewModel;
  onDismiss: () => void;
  back?: boolean;
}

function AnnouncementFace({
  announcement,
  onDismiss,
  back = false,
}: AnnouncementFaceProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center bg-[#170901] text-text-primary"
      style={{
        transform: back ? "rotateX(180deg)" : "rotateX(0deg)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="container-rodha w-full h-full flex items-center justify-center gap-3 sm:gap-5 relative lg:justify-end">
        {/* Announcement */}
        <div className="flex-1 min-w-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-[min(100%,42rem)]">
          <p className="text-caption sm:text-body-sm text-center text-text-secondary leading-snug">
            <span
              className="announcement-html [&_a]:font-semibold [&_a]:text-orange-500 [&_a]:hover:text-orange-400 [&_a]:underline [&_a]:underline-offset-2 sm:[&_a]:no-underline"
              dangerouslySetInnerHTML={{
                __html: announcement.descriptionHtml,
              }}
            />
          </p>
        </div>

        {/* Countdown + close */}
        <div className="flex items-center gap-2 shrink-0">
          {announcement.endAt ? (
            <AnnouncementCountdown
              key={`countdown-${announcement.id}-${announcement.endAt}`}
              endAt={announcement.endAt}
            />
          ) : null}

          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-0 sm:static flex items-center justify-center w-6 h-6 text-text-dimmed hover:text-text-primary transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function PromotionalBanner({
  className,
  announcements = [],
  intervalMs,
}: PromotionalBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const flipTimerRef = useRef<number | null>(null);

  const rotationMs = intervalMs ?? getAnnouncementIntervalMs();
  const items = announcements;

  const current = items[displayIndex] ?? null;
  const incoming =
    incomingIndex !== null ? items[incomingIndex] ?? null : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReduceMotion(mediaQuery.matches);

    const handleChange = () => {
      setReduceMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  /*
   * Reset safely when the API list changes.
   */
  useEffect(() => {
    if (!items.length) return;

    if (displayIndex >= items.length) {
      setDisplayIndex(0);
    }

    setIncomingIndex(null);
    setFlipping(false);
  }, [items.length, displayIndex]);

  /*
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      if (flipTimerRef.current !== null) {
        window.clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  const advance = useCallback(() => {
    if (
      items.length <= 1 ||
      flipping ||
      dismissed
    ) {
      return;
    }

    const nextIndex = (displayIndex + 1) % items.length;

    /*
     * Reduced motion:
     * Simply replace the current content.
     */
    if (reduceMotion) {
      setDisplayIndex(nextIndex);
      return;
    }

    /*
     * IMPORTANT:
     *
     * We DO NOT change displayIndex here.
     *
     * The current face stays exactly where it is.
     * The incoming announcement is placed on the back face.
     * Then the cube performs ONE 180deg rotation.
     */
    setIncomingIndex(nextIndex);
    setFlipping(true);

    flipTimerRef.current = window.setTimeout(() => {
      /*
       * First update the displayed announcement while the cube
       * is still visually at 180deg.
       */
      setDisplayIndex(nextIndex);

      /*
       * Remove the old incoming face.
       */
      setIncomingIndex(null);

      /*
       * Reset the cube state without showing the reverse
       * animation.
       *
       * Because flipping becomes false in the same render,
       * React/CSS will place the new announcement back at
       * the front position.
       */
      setFlipping(false);
    }, 700);
  }, [
    dismissed,
    displayIndex,
    flipping,
    items.length,
    reduceMotion,
  ]);

  useEffect(() => {
    if (
      dismissed ||
      paused ||
      items.length <= 1 ||
      flipping
    ) {
      return;
    }

    const timer = window.setInterval(
      advance,
      rotationMs
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    advance,
    dismissed,
    flipping,
    items.length,
    paused,
    rotationMs,
  ]);

  if (dismissed || !current) {
    return null;
  }

  const BAR_HEIGHT = 40;

  return (
    <div
      className={cn(
        "relative z-50 w-full",
        "bg-[#170901]",
        "text-text-primary",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {/*
       * Fixed-height viewport.
       *
       * This element participates in normal document flow.
       * Everything below it stays at exactly the same position.
       */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: `${BAR_HEIGHT}px`,
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/*
         * Cube.
         *
         * The cube itself is absolutely positioned and therefore
         * cannot affect document height.
         */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transformOrigin: "center center",

            transition:
              !reduceMotion && flipping
                ? "transform 700ms cubic-bezier(0.65, 0, 0.35, 1)"
                : "none",

            transform:
              !reduceMotion && flipping
                ? "rotateX(-180deg)"
                : "rotateX(0deg)",
          }}
        >
          {/* CURRENT FACE */}
          <AnnouncementFace
            announcement={current}
            onDismiss={() => setDismissed(true)}
          />

          {/* INCOMING FACE */}
          {incoming && (
            <AnnouncementFace
              announcement={incoming}
              onDismiss={() => setDismissed(true)}
              back
            />
          )}

          {/* TOP CUBE EDGE */}
          <div
            className="absolute left-0 top-0 w-full bg-[#100600]"
            style={{
              height: `${BAR_HEIGHT}px`,
              transform: "rotateX(90deg)",
              transformOrigin: "center top",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />

          {/* BOTTOM CUBE EDGE */}
          <div
            className="absolute left-0 bottom-0 w-full bg-[#0D0500]"
            style={{
              height: `${BAR_HEIGHT}px`,
              transform: "rotateX(-90deg)",
              transformOrigin: "center bottom",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );
}