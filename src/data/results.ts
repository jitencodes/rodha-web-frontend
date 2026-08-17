import type { TopperResult, ResultStat } from "@/lib/types";

export const topResults: TopperResult[] = [
  {
    id: "r1",
    name: "Arjun Patel",
    exam: "CAT 2024",
    rank: 5,
    college: "IIM Ahmedabad",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-4.png",
  },
  {
    id: "r2",
    name: "Sneha Rao",
    exam: "IPMAT 2024",
    rank: 12,
    college: "IIM Indore",
    year: 2024,
    category: "ipmat",
    image: "/assets/images/profiles/female-3.png",
  },
  {
    id: "r3",
    name: "Priya Gupta",
    exam: "CAT 2024",
    rank: 22,
    college: "IIM Bangalore",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/female-4.png",
  },
  {
    id: "r4",
    name: "Vikram Singh",
    exam: "CLAT 2024",
    rank: 7,
    college: "NLSIU Bangalore",
    year: 2024,
    category: "clat",
    image: "/assets/images/profiles/male-5.png",
  },
  {
    id: "r5",
    name: "Meera Krishnan",
    exam: "IPMAT 2024",
    rank: 3,
    college: "IIM Rohtak",
    year: 2024,
    category: "ipmat",
    image: "/assets/images/profiles/female-1.png",
  },
  {
    id: "r6",
    name: "Rohan Mehta",
    exam: "CAT 2024",
    rank: 18,
    college: "IIM Calcutta",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-6.png",
  },
  {
    id: "r7",
    name: "Ananya Desai",
    exam: "CAT 2024",
    rank: 31,
    college: "FMS Delhi",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/female-2.png",
  },
  {
    id: "r8",
    name: "Kabir Nair",
    exam: "CAT 2024",
    rank: 44,
    college: "IIM Lucknow",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-1.png",
  },
  {
    id: "r9",
    name: "Ishita Verma",
    exam: "CAT 2024",
    rank: 9,
    college: "IIM Kozhikode",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/female-3.png",
  },
  {
    id: "r10",
    name: "Aarav Kapoor",
    exam: "GDPI 2024",
    rank: 1,
    score: "Converted",
    college: "IIM Ahmedabad",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-4.png",
  },
  {
    id: "r11",
    name: "Diya Banerjee",
    exam: "GDPI 2024",
    rank: 2,
    score: "Converted",
    college: "IIM Bangalore",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/female-4.png",
  },
  {
    id: "r12",
    name: "Harsh Vardhan",
    exam: "GDPI 2024",
    rank: 3,
    score: "Converted",
    college: "IIM Calcutta",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-5.png",
  },
  {
    id: "r13",
    name: "Aditi Menon",
    exam: "CLAT 2024",
    rank: 18,
    college: "NALSAR Hyderabad",
    year: 2024,
    category: "clat",
    image: "/assets/images/profiles/female-1.png",
  },
  {
    id: "r14",
    name: "Nikhil Joshi",
    exam: "IPMAT 2024",
    rank: 8,
    college: "IIM Indore",
    year: 2024,
    category: "ipmat",
    image: "/assets/images/profiles/male-2.png",
  },
  {
    id: "r15",
    name: "Tara Iyer",
    exam: "IPMAT 2024",
    rank: 21,
    college: "IIM Rohtak",
    year: 2024,
    category: "ipmat",
    image: "/assets/images/profiles/female-2.png",
  },
  {
    id: "r16",
    name: "Yash Kapadia",
    exam: "IPMAT 2024",
    rank: 35,
    college: "IIM Ranchi",
    year: 2024,
    category: "ipmat",
    image: "/assets/images/profiles/male-6.png",
  },
  {
    id: "r17",
    name: "Pooja Raut",
    exam: "CLAT 2024",
    rank: 42,
    college: "NUJS Kolkata",
    year: 2024,
    category: "clat",
    image: "/assets/images/profiles/female-3.png",
  },
  {
    id: "r18",
    name: "Samarth Jain",
    exam: "CLAT 2024",
    rank: 55,
    college: "NLIU Bhopal",
    year: 2024,
    category: "clat",
    image: "/assets/images/profiles/male-1.png",
  },
  {
    id: "r19",
    name: "Kritika Shah",
    exam: "CLAT 2024",
    rank: 63,
    college: "RMLNLU Lucknow",
    year: 2024,
    category: "clat",
    image: "/assets/images/profiles/female-4.png",
  },
  {
    id: "r20",
    name: "Manav Oberoi",
    exam: "GDPI 2024",
    rank: 4,
    score: "Converted",
    college: "IIM Lucknow",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-3.png",
  },
  {
    id: "r21",
    name: "Naina Chopra",
    exam: "GDPI 2024",
    rank: 5,
    score: "Converted",
    college: "XLRI Jamshedpur",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/female-2.png",
  },
  {
    id: "r22",
    name: "Ishan Reddy",
    exam: "GDPI 2024",
    rank: 6,
    score: "Converted",
    college: "FMS Delhi",
    year: 2024,
    category: "mba",
    image: "/assets/images/profiles/male-6.png",
  },
  {
    id: "r23",
    name: "Kavya Nair",
    exam: "IBPS PO 2024",
    rank: 18,
    score: "Selected",
    college: "SBI PO",
    year: 2024,
    category: "banking",
    image: "/assets/images/profiles/female-1.png",
  },
  {
    id: "r24",
    name: "Harsh Malhotra",
    exam: "SSC CGL 2024",
    rank: 42,
    score: "Selected",
    college: "SSC CGL",
    year: 2024,
    category: "banking",
    image: "/assets/images/profiles/male-2.png",
  },
  {
    id: "r25",
    name: "Ritu Desai",
    exam: "SBI Clerk 2024",
    rank: 9,
    score: "Selected",
    college: "SBI",
    year: 2024,
    category: "banking",
    image: "/assets/images/profiles/female-3.png",
  },
  {
    id: "r26",
    name: "Aman Joshi",
    exam: "IBPS Clerk 2024",
    rank: 31,
    score: "Selected",
    college: "IBPS",
    year: 2024,
    category: "banking",
    image: "/assets/images/profiles/male-4.png",
  },
  {
    id: "r27",
    name: "Sara Ali",
    exam: "Skill House 2024",
    rank: 1,
    score: "Placed",
    college: "Product Associate",
    year: 2024,
    category: "skillhouse",
    image: "/assets/images/profiles/female-2.png",
  },
  {
    id: "r28",
    name: "Nikhil Bose",
    exam: "Skill House 2024",
    rank: 2,
    score: "Placed",
    college: "Business Analyst",
    year: 2024,
    category: "skillhouse",
    image: "/assets/images/profiles/male-5.png",
  },
  {
    id: "r29",
    name: "Tanya Gill",
    exam: "Skill House 2024",
    rank: 3,
    score: "Placed",
    college: "Marketing Associate",
    year: 2024,
    category: "skillhouse",
    image: "/assets/images/profiles/female-4.png",
  },
  {
    id: "r30",
    name: "Omar Sheikh",
    exam: "Skill House 2024",
    rank: 4,
    score: "Placed",
    college: "Operations Lead",
    year: 2024,
    category: "skillhouse",
    image: "/assets/images/profiles/male-1.png",
  },
];
interface ResultBanner {
  id: string;

  badge: string;

  title: string;

  highlight: string;

  subtitle: string;

  description: string;

  cta: string;

  href: string;

  backgroundClass: string;

  toppers: TopperResult[];
}
export const resultBanners: ResultBanner[] = [
  {
    id: "cat",

    badge: "CAT 2025",

    title: "CAT 2025",
    highlight: "Results",

    subtitle: "100+ above 99 percentile",

    description:
      "250+ BLACKI Conversions",

    cta: "View CAT Results",
    href: "/category/cat#results",

    backgroundClass:
      "bg-gradient-to-br from-[#0C2D4A] via-[#103C63] to-[#164E7A]",

    // Dynamic student images/cards
    toppers: topResults.slice(0, 4),
  },

  {
    id: "ipmat",

    badge: "IPMAT 2026",

    title: "IPMAT 2026",
    highlight: "Results",

    subtitle: "50+ Conversions into IIMs",

    description:
      "25% Conversion Rate in a span of first year",

    cta: "Explore Results",
    href: "/category/ipmat#results",

    backgroundClass:
      "bg-gradient-to-br from-[#2A1408] via-[#4A2108] to-[#7C320C]",

    // Dynamic student images/cards
    toppers: topResults.slice(4, 8),
  },

  {
    id: "gdpi",

    badge: "GDPI 2025",

    title: "Interview",

    highlight: "Success",

    subtitle: "Final Converts",

    description:
      "Outstanding interview performances leading to final admissions.",

    cta: "View GDPI Results",

    href: "/category/cat#results",

    backgroundClass:
      "bg-gradient-to-br from-[#26103A] via-[#3A165A] to-[#5A2390]",

    toppers: topResults.slice(8, 12),
  },

  {
    id: "clat",

    badge: "CLAT 2025",

    title: "National",

    highlight: "Rankers",

    subtitle: "NLU Admissions",

    description:
      "Top CLAT performers securing admissions into premier NLUs.",

    cta: "View CLAT Results",

    href: "/category/clat",

    backgroundClass:
      "bg-gradient-to-br from-[#0F3A2A] via-[#17543C] to-[#227D56]",

    toppers: topResults.slice(12, 16),
  },
];

export const overallStats: ResultStat[] = [
  { label: "Selections", value: "10,000", suffix: "+", description: "across all exams" },
  { label: "Top 100 Ranks", value: "250", suffix: "+", description: "in the last 3 years" },
];

export const categoryStats: Record<string, ResultStat[]> = {
  mba: [
    { label: "99+ Percentilers", value: "150", suffix: "+" },
    { label: "IIM Calls", value: "800", suffix: "+" },
    { label: "Average Score", value: "95", suffix: "%ile" },
  ],
  ipmat: [
    { label: "Top 50 Ranks", value: "25", suffix: "+" },
    { label: "IIM Indore Selections", value: "40", suffix: "+" },
  ],
  clat: [
    { label: "Top 100 Ranks", value: "30", suffix: "+" },
    { label: "NLU Selections", value: "60", suffix: "+" },
  ],
  banking: [
    { label: "Banking Selects", value: "2,000", suffix: "+" },
    { label: "SSC Selects", value: "1,500", suffix: "+" },
  ],
  skillhouse: [
    { label: "Learners", value: "10,000", suffix: "+" },
    { label: "Career Outcomes", value: "1,000", suffix: "+" },
  ],
};

export function getResultsByCategory(categoryId: string): TopperResult[] {
  return topResults.filter((r) => r.category === categoryId);
}
