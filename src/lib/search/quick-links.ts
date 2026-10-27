import { ACCOUNT_NAV_ITEMS } from "@/data/account/user";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";
import type { WebsiteQuickLink } from "@/lib/api/modules/search/types";

export const WEBSITE_QUICK_LINKS: WebsiteQuickLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Faculty", href: "/faculty" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Results", href: "/results" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Resource Hub", href: "/resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function websiteQuickLinks(
  categories: WebsiteCategoryViewModel[] = []
): WebsiteQuickLink[] {
  const categoryLinks = categories.map((category) => ({
    label: category.menuLabel || category.name,
    href: `/category/${category.slug}`,
  }));
  return [...WEBSITE_QUICK_LINKS, ...categoryLinks];
}

export function accountQuickLinks(): WebsiteQuickLink[] {
  const links: WebsiteQuickLink[] = [];
  for (const item of ACCOUNT_NAV_ITEMS) {
    if (item.href) links.push({ label: item.label, href: item.href });
    for (const child of item.children ?? []) {
      if (child.href) links.push({ label: child.label, href: child.href });
    }
  }
  return links;
}
