import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { FaqItem } from "@/lib/types";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/images/rodha-logo.webp`,
    sameAs: [
      "https://instagram.com/rodha.in",
      "https://facebook.com/rodha.in",
      "https://youtube.com/@rodha",
      "https://linkedin.com/company/rodha",
      "https://twitter.com/rodha_in",
    ],
    areaServed: "IN",
    educationalCredentialAwarded: [
      "MBA entrance preparation",
      "Integrated Programs preparation",
      "Law entrance preparation",
      "Banking and government exam preparation",
      "Skill House career skills",
    ],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ label: string; href?: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };
}

export function categoryBreadcrumbJsonLd(categorySlug: string): JsonLd {
  const category = CATEGORIES.find((item) => item.slug === categorySlug);
  return breadcrumbJsonLd([
    { label: "Home", href: "/" },
    {
      label: category?.menuLabel ?? categorySlug,
      href: category ? `/category/${category.slug}` : undefined,
    },
  ]);
}

export function faqPageJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function personJsonLd(person: {
  name: string;
  description: string;
  image?: string;
  url: string;
  jobTitle?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.description,
    image: person.image ? `${SITE_URL}${person.image}` : undefined,
    url: `${SITE_URL}${person.url}`,
    jobTitle: person.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
