import type {
  Category,
  CategoryId,
  ContactInfo,
  SocialLink,
  ValueProp,
  HeroFeature,
  TrustMetric,
} from "./types";

export const SITE_NAME = "Rodha";
export const SITE_TAGLINE = "Expert Mentorship. Proven Strategies. Real Results.";
export const SITE_URL = "https://rodha.in";

export const EXTERNAL_URLS = {
  graphy: "https://rodha.graphy.com",
  thinkExam: "https://thinkexam.com",
  rodhaBuddy: "https://buddy.rodha.in",
  testSeries: "https://mocks.rodha.co.in/",
} as const;

export const CAT_FREE_COURSE_URL =
  "https://www.rodha.co.in/courses/Free-Course-for-CAT-2026--Free-Classes--Strategy-Sessions--Practice-Sessions-Copy-68df9c431bf5c8479d8dd7c3";

export const FREE_RESOURCE_URLS: Record<string, string> = {
  cat: CAT_FREE_COURSE_URL,
  skillhouse: CAT_FREE_COURSE_URL,
  ipmat:
    "https://ipmat.rodha.co.in/courses/IPMAT-Free-Course-686d1fed89239748a6354ab3",
  clat: "https://clat.rodha.co.in/courses/FREE-COURSE-CLAT-2027-69edb996e108967589ff4ad7",
  ssc: "https://ssc.rodha.co.in/courses/SSC-Free-Courses-69b3cfc74c2f7b1e462e3117",
};

export function getFreeResourceUrl(
  categoryId?: CategoryId | string | null
): string {
  if (categoryId && FREE_RESOURCE_URLS[categoryId]) {
    return FREE_RESOURCE_URLS[categoryId];
  }
  return CAT_FREE_COURSE_URL;
}

export function getCategoryIdFromPathname(
  pathname: string
): CategoryId | null {
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug =
    segments[0] === "category" ? segments[1] : segments[0];
  if (!categorySlug) return null;
  return CATEGORIES.find((cat) => cat.slug === categorySlug)?.id ?? null;
}

export const OFFER_END_DATE = "2026-08-31T23:59:59";

export const CATEGORIES: Category[] = [
  {
    id: "cat",
    name: "MBA",
    menuLabel: "MBA (CAT + GDPI)",
    fullName: "MBA — CAT & GDPI",
    slug: "cat",
    subHeading: "CAT & MBA Entrance",
    description:
      "CAT, SNAP, XAT, NMAT and GDPI coaching for the IIMs and India's top B-schools.",
    color: "#F97316",
    accentColor: "from-orange-500/25 to-orange-900/10",
    icon: "/assets/images/icons/exam/mba logo.png",
    image: "/assets/images/icons/exam/mba infographic.png",
    illustrationImage: "/assets/images/icons/exam/mba-3d.png",
    courseCount: "175+",
    selectionCount: "1,300+",
  },
  {
    id: "ipmat",
    name: "IPMAT",
    menuLabel: "Integrated Programs (IPMAT)",
    fullName: "Integrated Programme in Management Aptitude Test",
    slug: "ipmat",
    subHeading: "IPMAT & Integrated MBA",
    description:
      "IPMAT Indore, Rohtak and JIPMAT prep starts straight after class 12.",
    color: "#A855F7",
    accentColor: "from-purple-500/25 to-purple-900/10",
    icon: "/assets/images/icons/exam/ipmat logo.png",
    image: "/assets/images/icons/exam/ipmat infographic.png",
    illustrationImage: "/assets/images/icons/exam/ipmat-3d.png",
    courseCount: "40+",
    selectionCount: "200+",
  },
  {
    id: "clat",
    name: "CLAT",
    menuLabel: "Law (CLAT)",
    fullName: "Common Law Admission Test",
    slug: "clat",
    subHeading: "CLAT & Law Entrance",
    description:
      "CLAT, AILET, SLAT coaching built for a seat at the NLUs and other Top Law Schools.",
    color: "#D97706",
    accentColor: "from-amber-600/25 to-amber-900/10",
    icon: "/assets/images/icons/exam/clat logo.png",
    image: "/assets/images/icons/exam/clat infographic.png",
    illustrationImage: "/assets/images/icons/exam/clat-icon-3d.png",
    courseCount: "50+",
    selectionCount: "300+",
  },
  {
    id: "ssc",
    name: "SSC",
    menuLabel: "Banking & SSC Exams",
    fullName: "Banking & Government Exams (including SSC)",
    slug: "ssc",
    subHeading: "SSC & Government Exams",
    description:
      "SSC coaching built to help you achieve your dream government job.",
    color: "#65831d",
    accentColor: "from-lime-700/25 to-lime-900/10",
    icon: "/assets/images/icons/exam/ssc logo.png",
    image: "/assets/images/icons/exam/ssc infographic.png",
    illustrationImage: "/assets/images/icons/exam/banking-3d.png",
    courseCount: "30+",
    selectionCount: "500+",
  },
  {
    id: "skillhouse",
    name: "Skill House",
    menuLabel: "Skill House",
    fullName: "Skill House",
    slug: "skillhouse",
    subHeading: "Career & Pre-MBA Skills",
    description:
      "Job-ready courses for future managers on AI, Excel, Case Competitions and more.",
    color: "#F97316",
    accentColor: "from-orange-500/25 to-orange-900/10",
    icon: "/assets/images/icons/exam/skill house logo.png",
    image: "/assets/images/icons/exam/skill infographic.png",
    illustrationImage: "/assets/images/icons/exam/skillhouse-3d.png",
    courseCount: "20+",
    selectionCount: "1,000+",
  },
];

export const CONTACT_INFO: ContactInfo = {
  phone: "+91 98765 43210",
  email: "hello@rodha.in",
  address: "Mumbai, Maharashtra, India",
};

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Instagram", url: "https://instagram.com/rodha.in", icon: "instagram" },
  { platform: "Facebook", url: "https://facebook.com/rodha.in", icon: "facebook" },
  { platform: "YouTube", url: "https://youtube.com/@rodha", icon: "youtube" },
  { platform: "LinkedIn", url: "https://linkedin.com/company/rodha", icon: "linkedin" },
  { platform: "Twitter", url: "https://twitter.com/rodha_in", icon: "twitter" },
];

export const HEADER_NAV = [
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Faculty",
    href: "/faculty",
  },
  {
    label: "Resources",
    children: [
      {
        label: "Blogs",
        href: "/blog",
      },
      {
        label: "Free Resources",
        href: CAT_FREE_COURSE_URL,
      },
    ],
  },
  {
    label: "Test Series",
    href: EXTERNAL_URLS.testSeries,
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;

/** Public path for a category id (`mba` → `/category/cat`). */
export function getCategoryPath(categoryId: string): string {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return `/category/${category?.slug ?? categoryId}`;
}

export const NAV_ITEMS = {
  global: [
    { label: "Home", href: "/" },
    {
      label: "Courses",
      href: "#",
      children: [
        { label: "MBA Courses", href: "/category/cat" },
        { label: "Integrated Programs", href: "/category/ipmat" },
        { label: "Law Courses", href: "/category/clat" },
        { label: "Banking & Government", href: "/category/banking" },
        { label: "Skill House", href: "/category/skillhouse" },
      ],
    },
    { label: "Faculty", href: "/faculty" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  categories: {
    mba: [
      { label: "Overview", href: "/category/cat" },
      { label: "Courses", href: "/category/cat#courses" },
      { label: "Faculty", href: "/category/cat#faculty" },
      { label: "Results", href: "/category/cat#results" },
    ],
    ipmat: [
      { label: "Overview", href: "/category/ipmat" },
      { label: "Courses", href: "/category/ipmat#courses" },
      { label: "Faculty", href: "/category/ipmat#faculty" },
      { label: "Results", href: "/category/ipmat#results" },
    ],
    clat: [
      { label: "Overview", href: "/category/clat" },
      { label: "Courses", href: "/category/clat#courses" },
      { label: "Faculty", href: "/category/clat#faculty" },
    ],
    banking: [
      { label: "Overview", href: "/category/banking" },
      { label: "Courses", href: "/category/banking#courses" },
      { label: "Faculty", href: "/category/banking#faculty" },
    ],
    skillhouse: [
      { label: "Overview", href: "/category/skillhouse" },
      { label: "Courses", href: "/category/skillhouse#courses" },
      { label: "Faculty", href: "/category/skillhouse#faculty" },
    ],
  },
} as const;

export const TRUST_METRICS: TrustMetric[] = [
  {
    id: "students",
    value: "2,50,000+",
    label: "Students Enrolled",
    icon: "/assets/images/icons/selection.png",
  },
  {
    id: "rating",
    value: "4.8/5",
    label: "Google Rating",
    icon: "/assets/images/icons/rank.png",
  },
  {
    id: "selections",
    value: "10,000+",
    label: "Selections",
    icon: "/assets/images/icons/selection.png",
  },
];

export const HERO_FEATURES: HeroFeature[] = [
  {
    id: "faculty",
    title: "Top Faculty",
    subtitle: "Learn from Experts",
    icon: "/assets/images/icons/rank.png",
  },
  {
    id: "ai-buddy",
    title: "AI Buddy",
    subtitle: "24/7 Doubt Support",
    icon: "/assets/images/icons/ts-mocks.png",
  },
  {
    id: "practice",
    title: "Real Exam Practice",
    subtitle: "High Quality Mocks",
    icon: "/assets/images/icons/ts-sectional.png",
  },
  {
    id: "guidance",
    title: "Personalized Guidance",
    subtitle: "For Your Success",
    icon: "/assets/images/icons/selection.png",
  },
];

export const VALUE_PROPS: ValueProp[] = [
  {
    id: "top-faculty",
    title: "India's Top Faculty",
    description: "Learn from the best minds in the country",
    icon: "/assets/icons/top-faculty.svg",
  },
  {
    id: "mentorship",
    title: "Personalized Mentorship",
    description: "One-on-one guidance tailored for you",
    icon: "/assets/icons/mentorship.svg",
  },
  {
    id: "results",
    title: "Result-Oriented Approach",
    description: "Strategies that deliver results",
    icon: "/assets/icons/result-oriented.svg",
  },
  {
    id: "ai-buddy",
    title: "AI-Powered Rodha Buddy",
    description: "24/7 doubt solving & support",
    icon: "/assets/icons/ai-powered.svg",
  },
  {
    id: "test-series",
    title: "High Quality Test Series",
    description: "Mock tests that mirror real exams",
    icon: "/assets/icons/test-series.svg",
  },
  {
    id: "community",
    title: "Engaged Community",
    description: "Be a part of our learning family",
    icon: "/assets/icons/community.svg",
  },
];

export const RESULT_STATS = [
  { label: "Selections", value: "10,000", suffix: "+", description: "across all exams" },
  { label: "Top 100 Ranks", value: "250", suffix: "+", description: "in the last 3 years" },
] as const;

export const HERO_TRUST_STATS = [
  { label: "Students Enrolled", value: "2,50,000", suffix: "+" },
  { label: "Google Rating", value: "4.8", suffix: "/5" },
  { label: "Selections", value: "10,000", suffix: "+" },
] as const;
