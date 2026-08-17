"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES, EXTERNAL_URLS, HEADER_NAV } from "@/lib/constants";
import type { CategoryId } from "@/lib/types";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  activeCategoryId?: CategoryId | null;
}

export function MobileNav({ activeCategoryId = null }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCategory = CATEGORIES.find((cat) => cat.id === activeCategoryId);
  
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  const pathname = usePathname();
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center text-text-secondary relative z-100"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-10 bg-balck-500",
          isOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col p-6 space-y-1 bg-black">
          <p className="text-caption text-text-dimmed uppercase tracking-wider mb-2">
            {activeCategory ? `Exam: ${activeCategory.name}` : "Choose your exam"}
          </p>
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2.5 text-body font-medium transition-colors",
                  isActive ? "text-orange-400" : "text-text-primary hover:text-orange-400"
                )}
              >
                <span className="block">{cat.menuLabel}</span>
                <span className="block text-caption text-text-dimmed mt-0.5 font-normal">
                  {cat.description}
                </span>
              </Link>
            );
          })}

          <div className="border-t border-border-default my-4" />

          {HEADER_NAV.map((item) => {
            const hasChildren = "children" in item;

            if (hasChildren) {
              const isExpanded = expandedItem === item.label;
              const isActive = item.children.some((child) =>
                pathname.startsWith(child.href)
              );

              return (
                <div
                  key={item.label}
                  className="border-b border-border-default/40 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedItem((prev) =>
                        prev === item.label ? null : item.label
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between py-3 text-left text-body font-medium transition-colors",
                      isActive
                        ? "text-orange-400"
                        : "text-text-primary hover:text-orange-400"
                    )}
                  >
                    <span>{item.label}</span>

                    <svg
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}
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
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col pl-4 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "py-2 text-body-sm transition-colors",
                              pathname === child.href
                                ? "text-orange-400"
                                : "text-text-secondary hover:text-orange-400"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 text-body font-medium transition-colors",
                  isActive
                    ? "text-orange-400"
                    : "text-text-primary hover:text-orange-400"
                )}
              >
                {item.label}
              </Link>
            );
})}

          <div className="border-t border-border-default my-4" />

          <a
            href={EXTERNAL_URLS.rodhaBuddy}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center py-3"
            onClick={() => setIsOpen(false)}
          >
            Rodha Buddy
          </a>
          <a
            href={EXTERNAL_URLS.graphy}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 text-center text-body font-medium text-text-secondary hover:text-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Login / Sign Up
          </a>
        </nav>
      </div>
    </div>
  );
}
