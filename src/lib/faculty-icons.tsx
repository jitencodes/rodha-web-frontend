import type { IconType } from "react-icons";
import {
  FaBook,
  FaBriefcase,
  FaCheck,
  FaPlay,
  FaQuoteLeft,
  FaStar,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, IconType> = {
  experience: FaBriefcase,
  students: FaUsers,
  selections: FaTrophy,
  book: FaBook,
  play: FaPlay,
  quote: FaQuoteLeft,
  check: FaCheck,
  star: FaStar,
  trophy: FaTrophy,
};

interface FacultyIconProps {
  name: string;
  size?: number;
  className?: string;
}

/** Resolve a faculty JSON icon key (or legacy SVG path suffix) to a react-icons glyph. */
export function FacultyIcon({ name, size = 20, className }: FacultyIconProps) {
  const key = normalizeIconKey(name);
  const Icon = ICON_MAP[key] ?? FaBook;
  return <Icon size={size} className={cn("shrink-0", className)} aria-hidden />;
}

function normalizeIconKey(name: string): string {
  if (!name.startsWith("/")) return name;
  if (name.includes("top-faculty") || name.includes("guidance")) return "experience";
  if (name.includes("users")) return "students";
  if (name.includes("result-oriented") || name.includes("rank")) return "selections";
  if (name.includes("book")) return "book";
  if (name.includes("star")) return "star";
  if (name.includes("check")) return "check";
  if (name.includes("play")) return "play";
  if (name.includes("quote")) return "quote";
  return "book";
}

export function normalizeFacultyIconKey(name: string): string {
  return normalizeIconKey(name);
}
