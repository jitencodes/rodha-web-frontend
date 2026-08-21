"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCounsellingModal } from "@/hooks/useCounsellingModal";
import { getCourseBySlug } from "@/data/course-details";
import { cn } from "@/lib/utils";

const COUNSELLING_CTA_SELECTOR =
  "#site-hero [data-counselling-cta], #site-footer-cta [data-counselling-cta], #course-enquiry [data-counselling-cta]";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: "0px 0px -8% 0px",
};

function isCounsellingCtaInView(el: Element) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  const viewportBottom = window.innerHeight * 0.92;
  const visibleHeight =
    Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, 0);
  return visibleHeight > 0 && visibleHeight >= rect.height * 0.1;
}

function hasVisibleCounsellingCtaInDom() {
  const targets = document.querySelectorAll(COUNSELLING_CTA_SELECTOR);
  return Array.from(targets).some(isCounsellingCtaInView);
}

export function FloatingCounsellingCta() {
  const pathname = usePathname();
  const { isOpen, openCounsellingModal } = useCounsellingModal();
  const [hideFloating, setHideFloating] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleRef = useRef(new Set<Element>());
  const observedRef = useRef(new Set<Element>());

  const isCoursePage = Boolean(pathname?.startsWith("/courses/"));
  const courseSlug = isCoursePage
    ? pathname.split("/").filter(Boolean)[1]
    : undefined;
  const courseExam = courseSlug
    ? getCourseBySlug(courseSlug)?.course.category
    : undefined;

  useEffect(() => {
    visibleRef.current.clear();
    observedRef.current.clear();

    const syncVisibility = () => {
      setHideFloating(hasVisibleCounsellingCtaInDom());
    };

    const observeTargets = () => {
      const targets = document.querySelectorAll(COUNSELLING_CTA_SELECTOR);

      targets.forEach((el) => {
        if (observedRef.current.has(el)) return;
        observedRef.current.add(el);
        observerRef.current?.observe(el);
      });

      syncVisibility();
    };

    if (typeof IntersectionObserver === "undefined") {
      syncVisibility();
      window.addEventListener("scroll", syncVisibility, { passive: true });
      window.addEventListener("resize", syncVisibility);

      return () => {
        window.removeEventListener("scroll", syncVisibility);
        window.removeEventListener("resize", syncVisibility);
      };
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleRef.current.add(entry.target);
        } else {
          visibleRef.current.delete(entry.target);
        }
      }

      if (visibleRef.current.size > 0) {
        setHideFloating(true);
      } else {
        setHideFloating(hasVisibleCounsellingCtaInDom());
      }
    }, OBSERVER_OPTIONS);

    observerRef.current = observer;
    observeTargets();

    const mutationObserver = new MutationObserver(() => observeTargets());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      observerRef.current = null;
    };
  }, [pathname]);

  const isVisible = !hideFloating && !isOpen;

  return (
    <div
      className={cn(
        "fixed top-1/2 right-0 z-40 -translate-y-1/2",
        "transition-[opacity,transform] duration-300",
        isVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      <button
        type="button"
        onClick={() =>
          openCounsellingModal(
            isCoursePage
              ? { mode: "enquiry", defaultExam: courseExam }
              : undefined
          )
        }
        aria-label={isCoursePage ? "Enquire now" : "Book free counselling"}
        className="floating-cta-btn floating-cta-pulse btn-primary btn-primary-premium premium-border-glow glow-accent-orange inline-flex min-h-11 origin-bottom-right -rotate-90 items-center justify-center whitespace-nowrap rounded-[6px] px-4 py-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-0"
      >
        {isCoursePage ? "Enquire Now" : "Book Free Counselling"}
      </button>
    </div>
  );
}
