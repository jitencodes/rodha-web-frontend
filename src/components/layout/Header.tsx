"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES, EXTERNAL_URLS, HEADER_NAV } from "@/lib/constants";
import type { CategoryId } from "@/lib/types";
import { MobileNav } from "./MobileNav";
import { CircleUserRound, User, UserPlus } from "lucide-react";

interface HeaderProps {
  className?: string;
}

function getActiveCategoryId(pathname: string): CategoryId | null {
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug =
    segments[0] === "category" ? segments[1] : segments[0];
  if (!categorySlug) return null;
  const match = CATEGORIES.find((cat) => cat.slug === categorySlug);
  return match?.id ?? null;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const activeCategoryId = getActiveCategoryId(pathname);
  const activeCategory = CATEGORIES.find((cat) => cat.id === activeCategoryId);

  const [examOpen, setExamOpen] = useState(false);
  const examRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (examRef.current && !examRef.current.contains(e.target as Node)) {
        setExamOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const examTriggerLabel = activeCategory?.name ?? "Choose your exam";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 site-header !bg-[#191919]",
        className
      )}
    >
      <div className="container-rodha flex items-center justify-between h-14 md:h-16 gap-3 xl:gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/assets/images/rodha-logo.webp"
              alt="Rodha"
              width={120}
              height={32}
              className="h-7 md:h-8 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center min-w-0">
          {HEADER_NAV.map((item) => {
            const hasChildren = "children" in item;

            const isActive = hasChildren
              ? item.children.some((child) => pathname.startsWith(child.href))
              : pathname === item.href;

            if (hasChildren) {
              return (
                <div
                  key={item.label}
                  className="relative group"
                >
                  <button
                    className={cn(
                      "relative flex items-center gap-1 px-2 xl:px-2.5 py-1.5 text-body-sm transition-colors whitespace-nowrap after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-orange-500 after:transition-transform after:duration-300",
                      isActive
                        ? "text-orange-400 [text-shadow:0_0_14px_rgba(249,115,22,0.18)] after:scale-x-100"
                        : "text-text-secondary hover:text-text-primary after:scale-x-0 hover:after:scale-x-100"
                    )}
                  >
                    {item.label}

                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div
                    className="
                      invisible
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-2
                      w-72
                      rounded-xl
                      border
                      border-white/10
                      bg-[#121212]/95
                      backdrop-blur-xl
                      opacity-0
                      shadow-2xl
                      transition-all
                      duration-200
                      group-hover:visible
                      group-hover:opacity-100
                    "
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2.5 text-body-sm transition-colors",
                            pathname === child.href
                              ? "text-orange-400 bg-orange-500/5"
                              : "text-text-secondary hover:bg-orange-500/10 hover:text-text-primary"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-2 xl:px-2.5 py-1.5 text-body-sm transition-colors whitespace-nowrap after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-orange-500 after:transition-transform after:duration-300",
                  isActive
                    ? "text-orange-400 [text-shadow:0_0_14px_rgba(249,115,22,0.18)] after:scale-x-100"
                    : "text-text-secondary hover:text-text-primary after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <div onMouseLeave={() => setExamOpen(false)} ref={examRef} className="relative hidden lg:flex justify-end w-46">
            <button
              onMouseEnter={() => setExamOpen(!examOpen)}
              aria-expanded={examOpen}
              aria-haspopup="listbox"
              className={cn(
                "flex items-center justify-between gap-1.5 h-9.5 px-4 rounded-sm whitespace-nowrap text-[#F06B23] shadow-lg",
                "bg-transparent",
                "border border-[#F06B23] hover:bg-orange-600/10 hover:border-[#f06b23ca]",
                "focus:outline-none focus:ring-2 focus:ring-[#f06b23ef]",
                examTriggerLabel === "Choose your exam" ? "w-46" : "w-35"
              )}
            >
              {examTriggerLabel}
              <svg
                className={cn(
                  "h-3.5 w-3.5 text-white/50 transition-transform shrink-0",
                  examOpen && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {examOpen && (
              <div role="listbox" className="absolute top-full right-0">
                <div
                  className={cn(
                    "mt-3 w-72 z-50 overflow-hidden rounded-xl",
                    "border border-orange-500/20",
                    "bg-[#121212]/95 backdrop-blur-sm",
                    // "shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                    "animate-[dropdown-in_180ms_var(--ease-premium)]"
                  )}
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = cat.id === activeCategoryId;
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => setExamOpen(false)}
                        className={cn(
                          "block px-3 py-3 transition-all duration-200",
                          "border-b border-white/5 last:border-b-0",
                          "hover:bg-orange-500/10 hover:text-orange-300",
                          "focus:bg-orange-500/10",
                          isActive &&
                            "bg-orange-500/15 text-orange-300 border-l-2 border-orange-500"
                        )}
                      >
                        <span className="block text-white">{cat.menuLabel}</span>
                        <span className="mt-1 block text-caption text-white/60">
                          {cat.description}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <a
            href={EXTERNAL_URLS.rodhaBuddy}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9.5 px-4 text-body-sm font-semibold text-white border border-[#4B5563]/80 rounded-[4px] transition-colors whitespace-nowrap hover:border-orange-400/50
                hover:bg-orange-500/10"
          >
            Rodha Buddy
          </a>
          <div className="relative group shrink-0">
            <button
              className="
                flex items-center justify-center
                h-9.5
                w-[51px]
                rounded-sm
                border border-white/15
                backdrop-blur-sm
                transition-all duration-200
                hover:border-orange-400/50
                hover:bg-orange-500/10
              "
              aria-label="Account"
            >
              <User className="h-5 w-5 text-white group-hover:text-orange-300 transition-colors" />

              <svg
                className="h-auto w-5.5 text-white/50 transition-transform duration-300 group-hover:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div
              className="
                invisible
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-72
                rounded-xl
                border
                border-white/10
                bg-[#121212]/95
                backdrop-blur-xl
                opacity-0
                shadow-2xl
                transition-all
                duration-200
                group-hover:visible
                group-hover:opacity-100
              "
            >
              <div className="p-2">

                <a
                  href={EXTERNAL_URLS.graphy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-start gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    transition-colors
                    hover:bg-orange-500/10
                  "
                >
                  <User className="mt-0.5 h-5 w-5 text-orange-400 shrink-0" />

                  <div>
                    <div className="font-medium text-white">
                      Log In / Sign Up
                    </div>

                    <div className="text-caption text-white/60 mt-0.5">
                      Access existing account or create new
                    </div>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </div>

        <MobileNav activeCategoryId={activeCategoryId} />
      </div>
    </header>
  );
}
