import type {
  Category,
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
} as const;

export const OFFER_END_DATE = "2026-08-31T23:59:59";

export const CATEGORIES: Category[] = [
  {
    id: "mba",
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
    id: "banking",
    name: "SSC",
    menuLabel: "Banking &s Government Exams",
    fullName: "Banking & Government Exams (including SSC)",
    slug: "banking",
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
        href: "/resources",
      },
    ],
  },
  {
    label: "Test Series",
    children: [
      {
        label: "CAT + OMETs",
        href: "/test-series/clat-omets",
      },
      {
        label: "IPMAT",
        href: "/test-series/ipmat",
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;

/** Public path for a category id (`mba` → `/cat`). */
export function getCategoryPath(categoryId: string): string {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return `/${category?.slug ?? categoryId}`;
}

export const NAV_ITEMS = {
  global: [
    { label: "Home", href: "/" },
    {
      label: "Courses",
      href: "#",
      children: [
        { label: "MBA Courses", href: "/cat" },
        { label: "Integrated Programs", href: "/ipmat" },
        { label: "Law Courses", href: "/clat" },
        { label: "Banking & Government", href: "/banking" },
        { label: "Skill House", href: "/skillhouse" },
      ],
    },
    { label: "Faculty", href: "/faculty" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  categories: {
    mba: [
      { label: "Overview", href: "/cat" },
      { label: "Courses", href: "/cat#courses" },
      { label: "Faculty", href: "/cat#faculty" },
      { label: "Results", href: "/cat#results" },
    ],
    ipmat: [
      { label: "Overview", href: "/ipmat" },
      { label: "Courses", href: "/ipmat#courses" },
      { label: "Faculty", href: "/ipmat#faculty" },
      { label: "Results", href: "/ipmat#results" },
    ],
    clat: [
      { label: "Overview", href: "/clat" },
      { label: "Courses", href: "/clat#courses" },
      { label: "Faculty", href: "/clat#faculty" },
      { label: "Results", href: "/clat#results" },
    ],
    banking: [
      { label: "Overview", href: "/banking" },
      { label: "Courses", href: "/banking#courses" },
      { label: "Faculty", href: "/banking#faculty" },
      { label: "Results", href: "/banking#results" },
    ],
    skillhouse: [
      { label: "Overview", href: "/skillhouse" },
      { label: "Courses", href: "/skillhouse#courses" },
      { label: "Faculty", href: "/skillhouse#faculty" },
      { label: "Results", href: "/skillhouse#results" },
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
