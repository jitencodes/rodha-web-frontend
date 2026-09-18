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

  /**
   * Alignment when items do not overflow the container.
   * Looping marquees ignore this and stay edge-to-edge.
   * Default: start (left)
   */
  align?: "start" | "center";
}

export function InfiniteMarquee({
  children,
  className,
  itemClassName,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  gap = 20,
  align = "start",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const widthRef = useRef(0);

  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const childCount = React.Children.count(children);
  const loop = isOverflowing && childCount > 0;
  const sets = loop ? [0, 1, 2] : [0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const resetOffset = useCallback(() => {
    offsetRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0px,0,0)";
    }
  }, []);

  const updateWidth = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const firstSet = track.children[0] as HTMLElement | undefined;
    if (!firstSet) return;

    widthRef.current = firstSet.offsetWidth;
    const overflowing = firstSet.offsetWidth > container.clientWidth + 1;
    setIsOverflowing((prev) => (prev === overflowing ? prev : overflowing));

    if (!overflowing) {
      resetOffset();
    }
  }, [resetOffset]);

  useEffect(() => {
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    if (trackRef.current?.children[0]) {
      observer.observe(trackRef.current.children[0]);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth, childCount, loop]);

  useEffect(() => {
    if (!loop) {
      resetOffset();
      return;
    }

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

    lastTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [speed, paused, direction, prefersReducedMotion, loop, resetOffset]);

  const centerStatic = !loop && align === "center";

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden",
        centerStatic && "flex justify-center",
        className
      )}
      onMouseEnter={() => pauseOnHover && loop && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max",
          loop && "will-change-transform",
          itemClassName
        )}
      >
        {sets.map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0"
            style={{ gap, paddingRight: loop ? gap : 0 }}
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
