"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;

  /**
   * Pixels per second.
   * Default: 40
   */
  speed?: number;

  /**
   * left | right
   */
  direction?: "left" | "right";

  /** Gap between items (px) */
  gap?: number;

  pauseOnHover?: boolean;
}

export function InfiniteMarquee({
  children,
  className,
  itemClassName,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  gap = 20,
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const widthRef = useRef(0);

  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const updateWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstSet = track.children[0] as HTMLElement;

    if (!firstSet) return;

    widthRef.current = firstSet.offsetWidth;
  }, []);

  useEffect(() => {
    updateWidth();

    const observer = new ResizeObserver(updateWidth);

    if (trackRef.current) observer.observe(trackRef.current);

    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!paused && !prefersReducedMotion && widthRef.current > 0) {
        const distance = speed * delta;

        if (direction === "left") {
          offsetRef.current -= distance;

          if (-offsetRef.current >= widthRef.current) {
            offsetRef.current += widthRef.current;
          }
        } else {
          offsetRef.current += distance;

          if (offsetRef.current >= 0) {
            offsetRef.current -= widthRef.current;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [speed, paused, direction, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className={cn("flex w-max will-change-transform", itemClassName)}
      >
        {[0, 1, 2].map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0"
            style={{ gap, paddingRight: gap }}
            aria-hidden={setIndex > 0 || undefined}
          >
            {React.Children.map(children, (child, index) => (
              <div key={`${setIndex}-${index}`} className="shrink-0">
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}