"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionV2Item {
  id: string;
  question: string;
  answer: string;
}

interface AccordionV2Props {
  items: AccordionV2Item[];
  className?: string;
  /** Chevron for default FAQs; plus shows orange + / − like the CAT mockup */
  iconVariant?: "chevron" | "plus";
}

export function AccordionV2({
  items,
  className,
  iconVariant = "chevron",
}: AccordionV2Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={cn("w-full rounded-2xl border-[#FFE8DE] border items-center justify-between p-4 md:p-6", `${isOpen?"bg-[#FFF3E8]":""}`)}>
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className={cn("flex justify-between items-center w-full", `${isOpen?"mb-2.5":""}`)}
            >
              <span className="pr-4 font-semibold text-body w-full text-left text-[#333333] block">{item.question}</span>
              {isOpen ? (
                <ChevronUp
                  className={cn(
                    "relative h-5 w-5 shrink-0 text-orange-400",
                    "before:absolute before:left-1/2 before:top-1/2 before:h-0.5 before:w-3.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-current before:rounded-full",
                    "after:absolute after:left-1/2 after:top-1/2 after:h-3.5 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-current after:rounded-full after:transition-transform after:duration-200",
                    isOpen && "after:scale-y-0"
                  )}
                />
              ) : (
                <ChevronDown className={cn(
                  "relative h-5 w-5 shrink-0 text-orange-400",
                  "before:absolute before:left-1/2 before:top-1/2 before:h-0.5 before:w-3.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-current before:rounded-full",
                  "after:absolute after:left-1/2 after:top-1/2 after:h-3.5 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-current after:rounded-full after:transition-transform after:duration-200",
                  isOpen && "after:scale-y-0"
                )}/>
              )}
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-[#696969] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
