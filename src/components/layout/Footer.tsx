"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CATEGORIES,
  CONTACT_INFO,
  SOCIAL_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  CAT_FREE_COURSE_URL,
  getCategoryIdFromPathname,
  getFreeResourceUrl,
} from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { cn, isExternalHref } from "@/lib/utils";

const SOCIAL_ICON_PATHS: Record<string, string> = {
  instagram: "/assets/icons/instagram.svg",
  facebook: "/assets/icons/facebook.svg",
  youtube: "/assets/icons/youtube.svg",
  linkedin: "/assets/icons/linkedin.svg",
  twitter: "/assets/icons/twitter.svg",
};

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Faculty", href: "/faculty" },
  { label: "Meet the Team", href: "/team" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const RESOURCES_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Free Resources", href: CAT_FREE_COURSE_URL },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const PREFERRED_ACTIVE_LABEL: Record<string, string> = {
  "/category/cat": "MBA (CAT + GDPI)",
  "/blog": "Blog",
  "/contact": "Contact Us",
  "/faq": "FAQ",
  "/team": "Meet the Team",
};

type FooterTheme = {
  heading: string;
  muted: string;
  dimmed: string;
  social: string;
  divider: string;
  link: string;
  activeLink: string;
};

const LIGHT_FOOTER_THEME: FooterTheme = {
  heading: "text-slate-900",
  muted: "text-slate-500 hover:text-orange-500",
  dimmed: "text-slate-500",
  link: "text-slate-600 hover:text-orange-500",
  activeLink: "text-orange-600 font-medium",
  social:
    "border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-500",
  divider: "border-slate-200",
};

function normalizePath(path: string): string {
  const base = path.split("#")[0] || "/";
  return base.length > 1 && base.endsWith("/") ? base.slice(0, -1) : base;
}

function parseFooterHref(href: string): { path: string; hash: string } {
  const [pathPart, hashPart] = href.split("#");
  return {
    path: normalizePath(pathPart || "/"),
    hash: hashPart ? `#${hashPart}` : "",
  };
}

function getActiveFooterLabel(pathname: string, currentHash: string): string | null {
  const currentPath = normalizePath(pathname);
  const hash = currentHash || "";

  const allLinks = [
    ...CATEGORIES.map((c) => ({ label: c.menuLabel, href: `/category/${c.slug}` })),
    ...QUICK_LINKS,
    ...RESOURCES_LINKS,
    ...LEGAL_LINKS,
  ];

  const matches = allLinks.filter((item) => {
    const { path, hash: itemHash } = parseFooterHref(item.href);
    if (path !== currentPath) return false;
    if (itemHash) return itemHash === hash;
    return hash === "";
  });

  if (matches.length === 0) return null;

  const preferred = PREFERRED_ACTIVE_LABEL[currentPath];
  if (preferred && matches.some((m) => m.label === preferred)) {
    return preferred;
  }

  return matches[0].label;
}

function FooterColumn({
  title,
  links,
  activeLabel,
  theme,
}: {
  title: string;
  links: { label: string; href: string }[];
  activeLabel: string | null;
  theme: FooterTheme;
}) {
  return (
    <div className="text-left">
      <h4 className={cn("text-body font-semibold mb-4", theme.heading)}>
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((item) => {
          const isActive = activeLabel === item.label;
          return (
            <li key={item.label}>
              {isExternalHref(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-body-sm transition-colors",
                    isActive ? theme.activeLink : theme.link
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "text-body-sm transition-colors",
                    isActive ? theme.activeLink : theme.link
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  const activeLabel = getActiveFooterLabel(pathname, hash);
  const examLinks = CATEGORIES.map((c) => ({
    label: c.menuLabel,
    href: `/category/${c.slug}`,
  }));
  const resourceLinks = RESOURCES_LINKS.map((item) =>
    item.label === "Free Resources"
      ? {
          ...item,
          href: getFreeResourceUrl(getCategoryIdFromPathname(pathname)),
        }
      : item
  );
  const isCategoryRoute = pathname.startsWith("/category/");
  const footerTheme = LIGHT_FOOTER_THEME;

  return (
    <footer
      data-home-zone={pathname === "/" || isCategoryRoute ? "footer" : undefined}
      className="relative bg-section-cream border-t-[10px] border-brand-orange"
    >
      <div className="container-rodha relative py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/rodha-logo.webp"
                alt={SITE_NAME}
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p
              className={cn(
                "mt-3 text-body-sm max-w-xs leading-relaxed",
                footerTheme.muted
              )}
            >
              {SITE_TAGLINE}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-transparent border transition-all",
                    footerTheme.social
                  )}
                  aria-label={link.platform}
                >
                  <Icon
                    src={
                      SOCIAL_ICON_PATHS[link.icon] ||
                      "/assets/icons/external-link.svg"
                    }
                    size={14}
                    className="text-current"
                  />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Courses"
            links={examLinks}
            activeLabel={activeLabel}
            theme={footerTheme}
          />
          <FooterColumn
            title="Quick Links"
            links={QUICK_LINKS}
            activeLabel={activeLabel}
            theme={footerTheme}
          />
          <FooterColumn
            title="Resources"
            links={resourceLinks}
            activeLabel={activeLabel}
            theme={footerTheme}
          />

          <div className="col-span-2 sm:col-span-1 text-left">
            <h4 className={cn("text-body font-semibold mb-4", footerTheme.heading)}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon
                  src="/assets/icons/phone.svg"
                  size={16}
                  className="text-orange-400 mt-0.5 shrink-0"
                />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon
                  src="/assets/icons/email.svg"
                  size={16}
                  className="text-orange-400 mt-0.5 shrink-0"
                />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="transition-colors hover:text-orange-600"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon
                  src="/assets/icons/location.svg"
                  size={16}
                  className="text-orange-400 mt-0.5 shrink-0"
                />
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={cn("border-t", footerTheme.divider)}>
        <div className="container-rodha py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className={cn(
              "text-caption text-center md:text-left",
              footerTheme.dimmed
            )}
          >
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-caption transition-colors",
                  activeLabel === item.label
                    ? footerTheme.activeLink
                    : footerTheme.link
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 z-40 w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-orange md:bottom-6 md:right-6"
        aria-label="Scroll to top"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </footer>
  );
}
