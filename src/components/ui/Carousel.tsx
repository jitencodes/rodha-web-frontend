"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  itemClassName?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** Optional. Defaults to current behaviour. */
  itemsPerView?: number;
  /** Enables mouse/pointer dragging in addition to native touch scrolling. */
  draggable?: boolean;
}

export function Carousel({
  children,
  className,
  showArrows = true,
  itemClassName,
  autoPlay = false,
  autoPlayInterval = 5000,
  itemsPerView,
  draggable = true,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });
  const suppressClickRef = useRef(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    const handleScroll = () => {
      updateArrows();
      if (!autoPlay) return;
      setIsPaused(true);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => setIsPaused(false), 1200);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateArrows);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [autoPlay, updateArrows]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    const timeout = window.setTimeout(updatePreference, 0);
    mediaQuery.addEventListener("change", updatePreference);
    return () => {
      window.clearTimeout(timeout);
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      const firstChild = el.firstElementChild as HTMLElement | null;

      const amount =
        itemsPerView === 1
          ? el.clientWidth
          : firstChild
            ? firstChild.offsetWidth + 20
            : el.clientWidth * 0.8;
      el.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    },
    [itemsPerView]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (
        !draggable ||
        !el ||
        event.pointerType === "touch" ||
        event.button !== 0
      ) {
        return;
      }

      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: el.scrollLeft,
      };
      suppressClickRef.current = false;
      el.setPointerCapture(event.pointerId);
      setIsDragging(true);
    },
    [draggable]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el || !dragRef.current.active) return;

      const delta = event.clientX - dragRef.current.startX;
      if (Math.abs(delta) > 5) suppressClickRef.current = true;
      el.scrollLeft = dragRef.current.startScrollLeft - delta;
      event.preventDefault();
    },
    []
  );

  const endPointerDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el || !dragRef.current.active) return;

      if (el.hasPointerCapture(dragRef.current.pointerId)) {
        el.releasePointerCapture(dragRef.current.pointerId);
      }
      dragRef.current.active = false;
      setIsDragging(false);

      if (suppressClickRef.current) {
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    },
    []
  );

  useEffect(() => {
    if (!autoPlay || prefersReducedMotion || isPaused || isDocumentHidden) return;

    const interval = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [
    autoPlay,
    autoPlayInterval,
    isDocumentHidden,
    isPaused,
    prefersReducedMotion,
    scroll,
  ]);

  return (
    <div
      className={cn("relative group/carousel", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {showArrows && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-orange hover:text-orange-400 hover:border-orange-500/40 transition-all shadow-sm disabled:opacity-0 disabled:pointer-events-none backdrop-blur-sm",
              "hidden md:flex"
            )}
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-orange hover:text-orange-400 hover:border-orange-500/40 transition-all shadow-sm disabled:opacity-0 disabled:pointer-events-none backdrop-blur-sm",
              "hidden md:flex"
            )}
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide py-1.5",
          "snap-x snap-mandatory touch-pan-x cursor-grab",
          isDragging && "cursor-grabbing scroll-auto snap-none select-none",
          itemClassName
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {itemsPerView
          ? Array.from(React.Children.toArray(children)).map((child, index) => (
              <div
                key={index}
                className="shrink-0 snap-start"
                style={{
                  width: `${100 / itemsPerView}%`,
                  flex: `0 0 ${100 / itemsPerView}%`,
                }}
              >
                {child}
              </div>
            ))
          : children}
      </div>
    </div>
  );
}
