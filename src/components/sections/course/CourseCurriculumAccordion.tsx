"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseModule } from "@/lib/types";

interface CourseCurriculumAccordionProps {
  modules: CourseModule[];
  className?: string;
}

export function CourseCurriculumAccordion({
  modules,
  className,
}: CourseCurriculumAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(modules[0]?.id ?? null);

  if (modules.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {modules.map((module, index) => {
        const isOpen = openId === module.id;
        const meta = [module.topics, module.duration, module.lectures]
          .filter(Boolean)
          .join(" • ");
        const number = String(index + 1).padStart(2, "0");

        return (
          <div
            key={module.id}
            className={cn(
              "w-full rounded-2xl border border-[#FFE8DE] p-4 md:p-6",
              isOpen && "bg-[#FFF3E8]"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : module.id)}
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-start gap-3 text-left md:items-center md:gap-4",
                isOpen && "mb-2.5"
              )}
            >
              <span className="shrink-0 text-h4 font-bold text-orange-500 tabular-nums">
                {number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-body text-[#333333]">
                  {module.title}
                </span>
                {meta && (
                  <span className="mt-1 block text-caption text-neutral-500">
                    {meta}
                  </span>
                )}
              </span>
              {isOpen ? (
                <ChevronUp className="relative mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
              ) : (
                <ChevronDown className="relative mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
              )}
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden pl-10 md:pl-12">
                <p className="text-sm leading-relaxed text-[#696969]">
                  {module.description ||
                    `Explore ${module.title.toLowerCase()} with structured sessions, practice, and mentor support.`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
