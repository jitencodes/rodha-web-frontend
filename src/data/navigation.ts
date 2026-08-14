import type { NavItem, CategoryId } from "@/lib/types";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "#",
    children: [
      { label: "MBA (CAT + GDPI)", href: "/cat" },
      { label: "Integrated Programs", href: "/ipmat" },
      { label: "Law (CLAT)", href: "/clat" },
      { label: "Banking & Government", href: "/banking" },
      { label: "Skill House", href: "/skillhouse" },
    ],
  },
  { label: "Faculty", href: "/faculty" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const categoryNavigation: Record<CategoryId, NavItem[]> = {
  mba: [
    { label: "Overview", href: "/cat" },
    { label: "Courses", href: "/cat#courses" },
    { label: "Faculty", href: "/cat#faculty" },
    { label: "Results", href: "/cat#results" },
    { label: "FAQ", href: "/cat#faqs" },
  ],
  ipmat: [
    { label: "Overview", href: "/ipmat" },
    { label: "Courses", href: "/ipmat#courses" },
    { label: "Faculty", href: "/ipmat#faculty" },
    { label: "Results", href: "/ipmat#results" },
    { label: "FAQ", href: "/ipmat#faqs" },
  ],
  clat: [
    { label: "Overview", href: "/clat" },
    { label: "Courses", href: "/clat#courses" },
    { label: "Faculty", href: "/clat#faculty" },
    { label: "Results", href: "/clat#results" },
    { label: "FAQ", href: "/clat#faqs" },
  ],
  banking: [
    { label: "Overview", href: "/banking" },
    { label: "Courses", href: "/banking#courses" },
    { label: "Faculty", href: "/banking#faculty" },
    { label: "Results", href: "/banking#results" },
    { label: "FAQ", href: "/banking#faqs" },
  ],
  skillhouse: [
    { label: "Overview", href: "/skillhouse" },
    { label: "Courses", href: "/skillhouse#courses" },
    { label: "Faculty", href: "/skillhouse#faculty" },
    { label: "Results", href: "/skillhouse#results" },
    { label: "FAQ", href: "/skillhouse#faqs" },
  ],
};

export const footerNavigation = {
  courses: [
    { label: "MBA (CAT + GDPI)", href: "/cat" },
    { label: "Integrated Programs", href: "/ipmat" },
    { label: "Law (CLAT)", href: "/clat" },
    { label: "Banking & Government", href: "/banking" },
    { label: "Skill House", href: "/skillhouse" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Faculty", href: "/faculty" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};
