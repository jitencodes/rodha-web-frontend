import { faculty } from "./faculty";
import {
  getAllCategoryLandings,
  getCategoryLandingById,
  getCategoryPathBySlug,
} from "./category-landings";
import type {
  CategoryId,
  CategoryLandingConfig,
  Course,
  CourseModule,
  CoursePricingPlan,
  CourseSchedule,
  Faculty,
  FaqItem,
  Testimonial,
} from "@/lib/types";

export interface CourseWithLanding {
  course: Course;
  landing: CategoryLandingConfig;
}

const DEFAULT_HIGHLIGHTS = [
  "Live Classes By Experts",
  "Structured Curriculum",
  "Practice & Tests",
  "Mentorship Support",
];

const DEFAULT_INCLUDED = [
  "Live Interactive Classes",
  "Class Recordings",
  "Structured Study Material",
  "Topic-wise Practice",
  "Mocks & Sectional Tests",
  "Mentorship & Doubt Support",
];

const DEFAULT_BENEFITS = [
  "Live Classes",
  "Structured Curriculum",
  "Practice & Tests",
  "Mentorship Support",
];

/** Canonical public path for a course detail page. */
export function getCoursePath(slug: string): string {
  return `/courses/${slug}`;
}

export function getAllCourses(): CourseWithLanding[] {
  return getAllCategoryLandings().flatMap((landing) =>
    landing.courses.map((course) => ({
      course: normalizeCourseCategory(course, landing),
      landing,
    }))
  );
}

export function getCourseBySlug(slug: string): CourseWithLanding | undefined {
  for (const landing of getAllCategoryLandings()) {
    const course = landing.courses.find((item) => item.slug === slug);
    if (course) {
      return {
        course: normalizeCourseCategory(course, landing),
        landing,
      };
    }
  }
  return undefined;
}

/** JSON sometimes stores category as "mba"; prefer landing.id. */
function normalizeCourseCategory(
  course: Course,
  landing: CategoryLandingConfig
): Course {
  return {
    ...course,
    category: landing.id,
  };
}

export function withCourseDetailDefaults(course: Course): Course {
  const enrollmentHref =
    course.externalLink || course.enrollmentUrl || undefined;

  const highlights =
    course.highlights?.length > 0 ? course.highlights : DEFAULT_HIGHLIGHTS;

  const benefits =
    course.benefits?.length && course.benefits.length > 0
      ? course.benefits
      : course.features?.length > 0
        ? course.features
        : DEFAULT_BENEFITS;

  const included =
    course.included?.length && course.included.length > 0
      ? course.included
      : course.features?.length > 0
        ? course.features
        : DEFAULT_INCLUDED;

  const modules =
    course.modules?.length && course.modules.length > 0
      ? course.modules
      : defaultModules(course);

  const schedule = course.schedule ?? defaultSchedule(course);

  const pricingPlans =
    course.pricingPlans?.length && course.pricingPlans.length > 0
      ? course.pricingPlans
      : defaultPricingPlans(course, benefits, enrollmentHref);

  const level =
    course.level ??
    (course.courseType === "crash"
      ? "Crash / Revision"
      : course.courseType === "individual"
        ? "Sectional"
        : course.courseType === "comprehensive"
          ? "Beginner to Advanced"
          : "All Levels");

  const exam =
    course.exam ??
    getCategoryLandingById(course.category)?.name ??
    course.category.toUpperCase();

  return {
    ...course,
    highlights,
    benefits,
    included,
    modules,
    schedule,
    pricingPlans,
    level,
    exam,
    language: course.language ?? "English",
  };
}

function defaultModules(course: Course): CourseModule[] {
  const typeLabel =
    course.courseType === "individual"
      ? "Core Topics"
      : course.courseType === "crash"
        ? "Revision Modules"
        : "Foundation Modules";

  return [
    {
      id: `${course.id}-mod-1`,
      title: typeLabel,
      topics: course.caourseCount
        ? `${course.caourseCount} Topics`
        : "Key Topics",
      duration: course.totalHours
        ? `${course.totalHours} Hours`
        : course.duration,
      description:
        course.shortDescription ||
        course.description ||
        "Structured live and recorded sessions covering the essentials for this program.",
    },
    {
      id: `${course.id}-mod-2`,
      title: "Practice & Assessment",
      topics: "Practice Sets",
      duration: course.classCount ? `${course.classCount} Classes` : "Ongoing",
      description:
        "Topic-wise practice, sectional drills, and performance reviews to build exam readiness.",
    },
    {
      id: `${course.id}-mod-3`,
      title: "Mentorship & Strategy",
      topics: "Doubt Support",
      duration: "Throughout Batch",
      description:
        "Mentor check-ins, doubt support via Rodha Buddy, and strategy sessions aligned to your goals.",
    },
  ];
}

function defaultSchedule(course: Course): CourseSchedule {
  return {
    nextBatch: course.startDate || "Rolling admissions",
    days: "Mon - Sat",
    timing: "Batch timings shared on enrolment",
    duration: course.duration,
    mode: course.mode || "Live Online",
  };
}

function defaultPricingPlans(
  course: Course,
  benefits: string[],
  enrollmentHref?: string
): CoursePricingPlan[] {
  return [
    {
      name: course.badge || "Standard",
      description:
        course.shortDescription ||
        "Full access to this Rodha program with live classes and support.",
      price: course.price,
      originalPrice: course.originalPrice,
      features: benefits.slice(0, 5),
      ctaLabel: course.price === 0 ? "Start Free" : "Buy Now",
      href: enrollmentHref,
      popular: true,
    },
  ];
}

export function getFacultyForCourse(course: Course): Faculty[] {
  const facultyById = new Map(faculty.map((member) => [member.id, member]));

  if (course.facultyIds?.length) {
    return course.facultyIds
      .map((id) => facultyById.get(id))
      .filter((member): member is Faculty => Boolean(member));
  }

  if (!course.faculty?.trim()) return [];

  const line = course.faculty.toLowerCase();
  const matched: Faculty[] = [];
  const seen = new Set<string>();

  for (const member of faculty) {
    const tokens = member.name
      .replace(/[()]/g, " ")
      .split(/\s+/)
      .map((p) => p.trim().toLowerCase())
      .filter((p) => p.length >= 3);

    const aliases: string[] = [...tokens];
    if (member.slug === "kd") aliases.push("kd");
    if (member.slug === "swapnil") {
      aliases.push("swapnil", "swapanil");
    }

    const hits = aliases.some(
      (token) =>
        line.includes(token) ||
        line.includes(`${token} sir`) ||
        line.includes(`${token} ma'am`) ||
        line.includes(`${token} mam`)
    );

    if (!hits || seen.has(member.id)) continue;
    seen.add(member.id);
    matched.push(member);
  }

  return matched;
}

export function getRelatedCourses(
  course: Course,
  limit = 4
): Course[] {
  const all = getAllCourses().map(({ course: item, landing }) =>
    normalizeCourseCategory(item, landing)
  );

  const byId = new Map(all.map((item) => [item.id, item]));
  const result: Course[] = [];
  const seen = new Set<string>([course.id]);

  const push = (item: Course | undefined) => {
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    result.push(item);
  };

  for (const id of course.relatedCourseIds ?? []) {
    push(byId.get(id));
    if (result.length >= limit) return result;
  }

  const tags = new Set((course.tags ?? []).map((t) => t.toLowerCase()));
  if (tags.size > 0) {
    for (const item of all) {
      if (result.length >= limit) break;
      const itemTags = (item.tags ?? []).map((t) => t.toLowerCase());
      if (itemTags.some((t) => tags.has(t))) push(item);
    }
  }

  for (const item of all) {
    if (result.length >= limit) break;
    if (item.category === course.category) push(item);
  }

  const popular = all.filter((item) => item.isPopular);
  for (const item of popular) {
    if (result.length >= limit) break;
    push(item);
  }

  for (const item of all) {
    if (result.length >= limit) break;
    push(item);
  }

  return result;
}

export function getCourseTestimonials(
  course: Course,
  landing: CategoryLandingConfig,
  limit = 12
): Testimonial[] {
  return landing.testimonials.slice(0, limit);
}

export function getCourseFaqs(
  course: Course,
  landing: CategoryLandingConfig
): FaqItem[] {
  if (course.faqs?.length) return course.faqs;
  return landing.faqs;
}

export function getCourseEnrollmentHref(course: Course): string {
  return course.externalLink || course.enrollmentUrl || "#";
}

export function getCourseCategoryHref(categoryId: CategoryId): string {
  const landing = getCategoryLandingById(categoryId);
  return landing
    ? getCategoryPathBySlug(landing.slug)
    : `/category/${categoryId}`;
}
