import { apiGet } from "@/lib/api/client";
import { mapContinueWatchingItems } from "@/lib/api/modules/student/courses/mapper";
import type { ContinueWatchingItem, LearningProgress, RecommendedProduct } from "@/lib/account/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";

interface DashboardApi {
  courseStats?: {
    completed?: number;
    inProgress?: number;
    notStarted?: number;
    total?: number;
    learningProgressPercentage?: number;
  };
  continueWatching?: unknown[];
  recommended?: Array<{
    type?: string;
    id?: number | string;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
    language?: string | null;
    price?: number | null;
    discountedPrice?: number | null;
  }>;
  latestOrders?: unknown[];
}

export interface StudentDashboardViewModel {
  continueWatching: ContinueWatchingItem[];
  recommended: RecommendedProduct[];
  learningProgress: LearningProgress;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function getStudentDashboard(
  accessToken: string
): Promise<StudentDashboardViewModel> {
  const data = await apiGet<DashboardApi>("api/website/student/dashboard", {
    accessToken,
    cache: "no-store",
  });

  const stats = data.courseStats ?? {};
  const continueWatching = mapContinueWatchingItems(
    data.continueWatching as never
  );

  const recommended: RecommendedProduct[] = [];
  for (const item of data.recommended ?? []) {
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const id = item.id != null ? String(item.id) : "";
    const slug = typeof item.slug === "string" ? item.slug : "";
    if (!title || !id) continue;
    const price = asNumber(item.discountedPrice ?? item.price);
    const original = asNumber(item.price);
    const discountPercent =
      original > price && original > 0
        ? Math.round(((original - price) / original) * 100)
        : 0;
    recommended.push({
      id,
      title,
      tag: typeof item.language === "string" ? item.language : "Package",
      thumbnail:
        (typeof item.bannerImageUrl === "string" && item.bannerImageUrl) ||
        COURSE_IMAGE_FALLBACK,
      price,
      originalPrice: original > price ? original : price,
      discountPercent,
      href: slug ? `/courses/${slug}` : "/courses",
      productType: "course",
    });
  }

  return {
    continueWatching,
    recommended,
    learningProgress: {
      percent: asNumber(stats.learningProgressPercentage),
      completed: asNumber(stats.completed),
      inProgress: asNumber(stats.inProgress),
      notStarted: asNumber(stats.notStarted),
      title: "Learning Progress",
      encouragement: "Keep going — consistency wins.",
    },
  };
}
