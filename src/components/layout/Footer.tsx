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
} from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

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
  { label: "Free Resources", href: "/blog" },
  { label: "Success Stories", href: "/#results" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const PREFERRED_ACTIVE_LABEL: Record<string, string> = {
  "/cat": "MBA (CAT + GDPI)",
  "/blog": "Blog",
  "/contact": "Contact Us",
  "/faq": "FAQ",
  "/team": "Meet the Team",
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
    ...CATEGORIES.map((c) => ({ label: c.menuLabel, href: `/${c.slug}` })),
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
  const examLinks = CATEGORIES.map((c) => ({ label: c.menuLabel, href: `/${c.slug}` }));
  
  const isHomePage = pathname === "/" || pathname === "/cat";
const footerTheme = isHomePage
? {
    heading: "text-slate-900",
    body: "text-slate-600",
    muted: "text-slate-500 hover:text-orange-500",
    dimmed: "text-slate-500",

    link: "text-slate-600 hover:text-orange-500",
    activeLink: "text-orange-600 font-medium",

    social:
      "border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-500",

    divider: "border-slate-200",
  }
: {
    heading: "text-text-primary",
    body: "text-text-secondary",
    muted: "text-text-muted",
    dimmed: "text-text-dimmed",

    link: "text-text-dimmed hover:text-orange-400",
    activeLink: "text-orange-400 font-medium",

    social:
      "border-white/40 text-white hover:border-orange-500 hover:text-orange-400",

    divider: "border-border-default",
  };

function FooterColumn({
  title,
  links,
  activeLabel,
  }: {
  title: string;
  links: { label: string; href: string }[];
  activeLabel: string | null;
  }) {
  return (
    <div className="text-left">
      <h4
            className={cn(
              "text-body font-semibold mb-4",
              footerTheme.heading
            )}
          >{title}</h4>
      <ul className="space-y-2.5">
        {links.map((item) => {
          return (
            <li
                key={item.label}
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
              <Link
                href={item.href}
                className={cn(
                  "text-body-sm transition-colors",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
  return (
    <footer
      data-home-zone={isHomePage ? "footer" : undefined}
      className={cn(
        "relative",
        // isHomePage
        //   ? "bg-[#0a0a0a] border-t border-transparent"
        //   : "bg-bg-primary border-t border-border-default",
       "bg-[#FCFAF8] border-t-[10px] border-[#F06B23]")}
    >
      {!isHomePage && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)",
          }}
        />
      )}

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
                    src={SOCIAL_ICON_PATHS[link.icon] || "/assets/icons/external-link.svg"}
                    size={14}
                    className="text-current"
                  />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Courses" links={examLinks} activeLabel={activeLabel} />
          <FooterColumn title="Quick Links" links={QUICK_LINKS} activeLabel={activeLabel} />
          <FooterColumn title="Resources" links={RESOURCES_LINKS} activeLabel={activeLabel} />

          <div className="col-span-2 sm:col-span-1 text-left">
          <h4
            className={cn(
              "text-body font-semibold mb-4",
              footerTheme.heading
            )}
          >Contact Us</h4>
            <ul className="space-y-3">
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon src="/assets/icons/phone.svg" size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon src="/assets/icons/email.svg" size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className={cn(
                  "transition-colors",
                  isHomePage
                    ? "hover:text-orange-600"
                    : "hover:text-orange-400"
                )}>
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li
                className={cn(
                  "flex items-start gap-2.5 text-body-sm",
                  footerTheme.muted
                )}
              >
                <Icon src="/assets/icons/location.svg" size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-t",
          footerTheme.divider
        )}
      >
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
                  "flex items-start gap-2.5",
                  footerTheme.muted
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
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
