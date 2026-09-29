"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface BannerFeature {
  icon: string;
  label: string;
}

interface BannerSlide {
  id: string;
  title: React.ReactNode;
  subtitle: string;
  features: BannerFeature[];
}

const SLIDES: BannerSlide[] = [
  {
    id: "journey",
    title: (
      <>
        Your Dream
        <br />
        Exam Journey
        <br />
        <span className="text-orange-500">Starts Here.</span>
      </>
    ),
    subtitle:
      "Expert mentorship, proven strategies and a supportive community to help you achieve your goals.",
    features: [
      { icon: "/assets/icons/video.svg", label: "Live Classes by Experts" },
      { icon: "/assets/icons/book.svg", label: "Structured Study Plan" },
      { icon: "/assets/icons/test-series.svg", label: "Tests & Practice Series" },
      { icon: "/assets/icons/mentorship.svg", label: "Mentorship & Support" },
    ],
  },
  {
    id: "strategies",
    title: (
      <>
        Expert Mentorship.
        <br />
        Proven{" "}
        <span className="text-orange-500">Strategies.</span>
        <br />
        Real Results.
      </>
    ),
    subtitle:
      "Learn from India's trusted faculty, practise exam-level mocks, and stay accountable with a community that wins together.",
    features: [
      { icon: "/assets/icons/top-faculty.svg", label: "Top Faculty" },
      { icon: "/assets/icons/guidance.svg", label: "Personalized Guidance" },
      { icon: "/assets/icons/practice.svg", label: "High-Quality Mocks" },
      { icon: "/assets/icons/community.svg", label: "Rodha Community" },
    ],
  },
];

const AUTOPLAY_MS = 6000;

export function AuthBannerSlider() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="relative isolate h-56 overflow-hidden sm:h-72 lg:h-full lg:min-h-0"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              isActive
                ? "z-[1] opacity-100"
                : "pointer-events-none z-0 opacity-0"
            )}
            aria-hidden={!isActive}
          >
            <Image
              src="/assets/auth/login-banner.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35"
              aria-hidden
            />
            <div className="relative z-10 flex h-full flex-col p-6 sm:p-8 lg:p-10">
              <div className="mt-auto max-w-md pb-8">
                <h2 className="font-montserrat text-[28px] font-bold leading-[1.15] tracking-tight text-white sm:text-[34px] lg:text-[38px]">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-sm text-body text-white/80 leading-relaxed">
                  {slide.subtitle}
                </p>

                <ul className="mt-6 hidden space-y-3 lg:block">
                  {slide.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-body-sm font-medium text-white"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/15">
                        <Icon src={feature.icon} size={16} alt="" />
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <Image
        src="/assets/images/rodha-logo.webp"
        alt="Rodha"
        width={120}
        height={36}
        className="absolute left-6 top-6 z-10 h-8 w-auto sm:left-8 sm:top-8 sm:h-9 lg:left-10 lg:top-10"
      />

      <div
        className="absolute bottom-6 left-6 z-10 flex items-center gap-2 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10"
        role="tablist"
        aria-label="Banner slides"
      >
        {SLIDES.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                isActive
                  ? "w-7 bg-orange-500"
                  : "w-2.5 bg-white/45 hover:bg-white/70"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
