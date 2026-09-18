import type {
  CategoryCta,
  CategoryId,
  CategoryLandingConfig,
  CategoryLandingCta,
  CategoryLandingHero,
  CategoryLandingSectionCopy,
} from "@/lib/types";

/** Brand orange used by every authored category landing. */
export const DEFAULT_CATEGORY_COLOR = "#F97316";
export const DEFAULT_CATEGORY_ACCENT_COLOR =
  "from-orange-500/25 to-orange-900/10";

export const DEFAULT_CATEGORY_SECTION_THEMES: CategoryLandingConfig["sectionThemes"] =
  {
    results: "white",
    courses: "beige",
    "test-series": "white",
    faculty: "beige",
    testimonials: "dark",
    cta: "beige",
    stories: "white",
    "app-promo": "beige",
    faqs: "white",
  };

const DEFAULT_HERO_CTA: CategoryCta = {
  label: "Explore Courses",
  href: "#courses",
};

const DEFAULT_CTA_PRIMARY: CategoryCta = {
  label: "Book Free Counselling",
  href: "/contact",
};

const DEFAULT_CTA_SECONDARY: CategoryCta = {
  label: "Contact Us",
  href: "/contact",
};

function filled(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function filledCta(
  value: CategoryCta | null | undefined,
  fallback: CategoryCta
): CategoryCta {
  return {
    label: filled(value?.label, fallback.label),
    href: filled(value?.href, fallback.href),
    ...(value?.external ? { external: true } : {}),
  };
}

export function getCategoryHeroAccentWords(
  accent: string | string[] | undefined
): string[] {
  if (Array.isArray(accent)) {
    return accent.map((word) => word.trim()).filter(Boolean);
  }
  if (typeof accent === "string" && accent.trim()) {
    return [accent.trim()];
  }
  return [];
}

function defaultDescription(name: string): string {
  return `Expert-led ${name} preparation with live classes, mock tests, and personalized mentorship from Rodha.`;
}

export function buildCategorySectionCopy(
  name: string
): CategoryLandingSectionCopy {
  return {
    facultyBadge: "Meet The Mentors",
    coursesBadge: `${name} Programs`,
    coursesTitle: `Flagship ${name} Programs`,
    coursesSubtitle: `Pick the ${name} track that fits you. Explore what's included in every course.`,
    testSeriesBadge: `${name} Test Series`,
    testSeriesTitle: "Practice like it's the real exam.",
    testSeriesSubtitle: `Identify your strengths, fix your weak areas, and walk into ${name} with confidence.`,
    facultyTitle: `Star Faculty for ${name}`,
    facultySubtitle: `Learn from mentors who have guided thousands of ${name} aspirants.`,
    testimonialSubtitle: `Real stories from Rodha ${name} aspirants`,
    storiesSubtitle:
      "They were exactly where you are today — hear their stories, in their own words.",
  };
}

export function buildCategoryHero(
  name: string,
  description?: string
): CategoryLandingHero {
  return {
    eyebrow: `${name} · Rodha`,
    title: `Prepare for ${name} with expert mentors who turn aspirants into`,
    accent: ["Top Rankers", "Exam-Day Ready", "Confident Aspirants"],
    subtitle: filled(description, defaultDescription(name)),
    primaryCta: { ...DEFAULT_HERO_CTA },
  };
}

export function buildCategoryCta(name: string): CategoryLandingCta {
  return {
    title: "Still Confused? Don't know where to start?",
    subtitle: `Join thousands of serious aspirants and start your ${name} journey today.`,
    primaryAction: { ...DEFAULT_CTA_PRIMARY },
    secondaryAction: { ...DEFAULT_CTA_SECONDARY },
  };
}

export interface CategoryLandingFallbackInput {
  slug: string;
  name: string;
  title?: string;
  description?: string;
  id?: CategoryId;
}

/**
 * Name-based chrome for a category that has no `category-landings.json` entry.
 * List surfaces (courses, faculty, results, etc.) stay empty so those sections hide.
 */
export function buildCategoryLandingFallback(
  input: CategoryLandingFallbackInput
): CategoryLandingConfig {
  const name = filled(input.name, input.slug);
  const title = filled(input.title, name);
  const description = filled(input.description, defaultDescription(name));
  const id = input.id ?? (input.slug as CategoryId);

  return {
    id,
    name,
    menuLabel: title,
    fullName: title,
    slug: input.slug,
    subHeading: `${name} Preparation`,
    description,
    color: DEFAULT_CATEGORY_COLOR,
    accentColor: DEFAULT_CATEGORY_ACCENT_COLOR,
    metadata: {
      title: `${title} — Rodha`,
      description,
    },
    hero: buildCategoryHero(name, description),
    sectionCopy: buildCategorySectionCopy(name),
    cta: buildCategoryCta(name),
    sectionThemes: { ...DEFAULT_CATEGORY_SECTION_THEMES },
    quickStats: [],
    resultStats: [],
    testSeries: [],
    faqs: [],
    courses: [],
    facultyIds: [],
    facultyMembers: [],
    results: [],
    testimonials: [],
    stories: [],
  };
}

function mergeSectionCopy(
  value: CategoryLandingSectionCopy | undefined,
  fallback: CategoryLandingSectionCopy
): CategoryLandingSectionCopy {
  return {
    facultyBadge: filled(value?.facultyBadge, fallback.facultyBadge ?? ""),
    coursesBadge: filled(value?.coursesBadge, fallback.coursesBadge),
    coursesTitle: filled(value?.coursesTitle, fallback.coursesTitle),
    coursesSubtitle: filled(value?.coursesSubtitle, fallback.coursesSubtitle),
    testSeriesBadge: filled(value?.testSeriesBadge, fallback.testSeriesBadge),
    testSeriesTitle: filled(value?.testSeriesTitle, fallback.testSeriesTitle),
    testSeriesSubtitle: filled(
      value?.testSeriesSubtitle,
      fallback.testSeriesSubtitle
    ),
    facultyTitle: filled(value?.facultyTitle, fallback.facultyTitle),
    facultySubtitle: filled(value?.facultySubtitle, fallback.facultySubtitle),
    testimonialSubtitle: filled(
      value?.testimonialSubtitle,
      fallback.testimonialSubtitle
    ),
    storiesSubtitle: filled(value?.storiesSubtitle, fallback.storiesSubtitle),
  };
}

/**
 * Fill empty chrome (titles, colors, hero, CTA, themes) from the category name.
 * Does not invent list/card data.
 */
export function withCategoryLandingDefaults(
  landing: CategoryLandingConfig
): CategoryLandingConfig {
  const fallback = buildCategoryLandingFallback({
    slug: landing.slug,
    name: landing.name,
    title: landing.fullName || landing.menuLabel || landing.name,
    description: landing.description,
    id: landing.id,
  });

  const accent = getCategoryHeroAccentWords(landing.hero?.accent);
  const fallbackAccent = getCategoryHeroAccentWords(fallback.hero.accent);

  return {
    ...landing,
    name: filled(landing.name, fallback.name),
    menuLabel: filled(landing.menuLabel, fallback.menuLabel),
    fullName: filled(landing.fullName, fallback.fullName),
    description: filled(landing.description, fallback.description),
    subHeading: filled(landing.subHeading, fallback?.subHeading ?? ""),
    color: filled(landing.color, fallback.color ?? DEFAULT_CATEGORY_COLOR),
    accentColor: filled(
      landing.accentColor,
      fallback.accentColor ?? DEFAULT_CATEGORY_ACCENT_COLOR
    ),
    metadata: {
      title: filled(landing.metadata?.title, fallback.metadata.title),
      description: filled(
        landing.metadata?.description,
        fallback.metadata.description
      ),
    },
    hero: {
      eyebrow: filled(landing.hero?.eyebrow, fallback.hero.eyebrow),
      title: filled(landing.hero?.title, fallback.hero.title),
      accent: accent.length > 0 ? accent : fallbackAccent,
      subtitle: filled(landing.hero?.subtitle, fallback.hero.subtitle),
      primaryCta: filledCta(landing.hero?.primaryCta, fallback.hero.primaryCta),
      videoId: landing.hero?.videoId,
      imageUrl: landing.hero?.imageUrl,
    },
    sectionCopy: mergeSectionCopy(landing.sectionCopy, fallback.sectionCopy),
    cta: {
      title: filled(landing.cta?.title, fallback.cta.title),
      subtitle: filled(landing.cta?.subtitle, fallback.cta.subtitle),
      primaryAction: filledCta(
        landing.cta?.primaryAction,
        fallback.cta.primaryAction
      ),
      secondaryAction: filledCta(
        landing.cta?.secondaryAction,
        fallback.cta.secondaryAction
      ),
    },
    sectionThemes: {
      ...DEFAULT_CATEGORY_SECTION_THEMES,
      ...landing.sectionThemes,
    },
  };
}
