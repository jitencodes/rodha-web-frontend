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

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedDate: string;
  updatedDate?: string;
  author?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}${post.url}`,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    author: {
      "@type": "Person",
      name: post.author ?? "Team Rodha",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/images/rodha-logo.webp`,
    },
  };
}

export function courseJsonLd(course: {
  title: string;
  description: string;
  url: string;
  image?: string;
  price: number;
  currency?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${SITE_URL}${course.url}`,
    image: course.image ? `${SITE_URL}${course.image}` : undefined,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency ?? "INR",
      url: `${SITE_URL}${course.url}`,
      availability: "https://schema.org/InStock",
    },
  };
}

export function webPageJsonLd(page: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: `${SITE_URL}${page.url === "/" ? "" : page.url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function collectionPageJsonLd(page: {
  name: string;
  description: string;
  url: string;
  items?: Array<{ name: string; url: string }>;
}): JsonLd {
  const list = page.items?.filter((item) => item.name && item.url) ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: `${SITE_URL}${page.url}`,
    mainEntity:
      list.length > 0
        ? {
            "@type": "ItemList",
            itemListElement: list.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: item.url.startsWith("http")
                ? item.url
                : `${SITE_URL}${item.url}`,
            })),
          }
        : undefined,
  };
}
