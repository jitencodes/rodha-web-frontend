import type { NavItem, CategoryId } from "@/lib/types";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "#",
    children: [
      { label: "MBA (CAT + GDPI)", href: "/category/cat" },
      { label: "Integrated Programs", href: "/category/ipmat" },
      { label: "Law (CLAT)", href: "/category/clat" },
      { label: "Banking & Government", href: "/category/banking" },
      { label: "Skill House", href: "/category/skillhouse" },
    ],
  },
  { label: "Faculty", href: "/faculty" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const categoryNavigation: Record<CategoryId, NavItem[]> = {
  cat: [
    { label: "Overview", href: "/category/cat" },
    { label: "Courses", href: "/category/cat#courses" },
    { label: "Faculty", href: "/category/cat#faculty" },
    { label: "Results", href: "/category/cat#results" },
    { label: "FAQ", href: "/category/cat#faqs" },
  ],
  ipmat: [
    { label: "Overview", href: "/category/ipmat" },
    { label: "Courses", href: "/category/ipmat#courses" },
    { label: "Faculty", href: "/category/ipmat#faculty" },
    { label: "Results", href: "/category/ipmat#results" },
    { label: "FAQ", href: "/category/ipmat#faqs" },
  ],
  clat: [
    { label: "Overview", href: "/category/clat" },
    { label: "Courses", href: "/category/clat#courses" },
    { label: "Faculty", href: "/category/clat#faculty" },
    { label: "FAQ", href: "/category/clat#faqs" },
  ],
  ssc: [
    { label: "Overview", href: "/category/banking" },
    { label: "Courses", href: "/category/banking#courses" },
    { label: "Faculty", href: "/category/banking#faculty" },
    { label: "FAQ", href: "/category/banking#faqs" },
  ],
  skillhouse: [
    { label: "Overview", href: "/category/skillhouse" },
    { label: "Courses", href: "/category/skillhouse#courses" },
    { label: "Faculty", href: "/category/skillhouse#faculty" },
    { label: "FAQ", href: "/category/skillhouse#faqs" },
  ],
};

export const footerNavigation = {
  courses: [
    { label: "MBA (CAT + GDPI)", href: "/category/cat" },
    { label: "Integrated Programs", href: "/category/ipmat" },
    { label: "Law (CLAT)", href: "/category/clat" },
    { label: "Banking & Government", href: "/category/banking" },
    { label: "Skill House", href: "/category/skillhouse" },
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
