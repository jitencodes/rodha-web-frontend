"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  COURSE_CONTENT_TYPE_TABS,
} from "@/lib/account/course-content-filters";
import { cn } from "@/lib/utils";

type ContentSummary = {
  video: number;
  quiz: number;
  pdf: number;
  liveclass: number;
};

type AccountCourseContentTypeNavProps = {
  courseId: string;
  activeType: string;
  contentSummary: ContentSummary;
  query: Record<string, string>;
};

function hrefFor(
  courseId: string,
  typeId: string,
  query: Record<string, string>
): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (!value || key === "type" || key === "page") return;
    params.set(key, value);
  });
  if (typeId) params.set("type", typeId);
  const qs = params.toString();
  return qs
    ? `/account/courses/${courseId}?${qs}`
    : `/account/courses/${courseId}`;
}

export function AccountCourseContentTypeNav({
  courseId,
  activeType,
  contentSummary,
  query,
}: AccountCourseContentTypeNavProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  }>({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const typedTabs = COURSE_CONTENT_TYPE_TABS.filter(
    (tab) => tab.summaryKey && contentSummary[tab.summaryKey] > 0
  );
  const allTab = COURSE_CONTENT_TYPE_TABS.find((tab) => !tab.summaryKey)!;
  const visibleTabs = [allTab, ...typedTabs];

  const measureOverflow = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setOverflowing(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = tabsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(el);
    window.addEventListener("resize", measureOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, [measureOverflow, visibleTabs.length]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !overflowing) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    dragRef.current.active = false;
    el?.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      ref={tabsRef}
      className={cn(
        "mb-4 flex min-w-0 max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1",
        overflowing && "cursor-grab active:cursor-grabbing"
      )}
      role="tablist"
      aria-label="Content types"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => {
        if (!dragRef.current.moved) return;
        e.preventDefault();
        e.stopPropagation();
        dragRef.current.moved = false;
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = (activeType || "") === tab.id;
        const count = tab.summaryKey
          ? contentSummary[tab.summaryKey]
          : undefined;
        return (
          <Link
            key={tab.id || "all"}
            href={hrefFor(courseId, tab.id, query)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-[var(--account-accent)] bg-[var(--account-nav-active-bg)] text-[var(--account-accent)]"
                : "border-[var(--account-border)] bg-[var(--account-surface)] text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
            )}
          >
            {tab.label}
            {count !== undefined && count > 0 ? (
              <span className="ml-1.5 opacity-80">({count})</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
