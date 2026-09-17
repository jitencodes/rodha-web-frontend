import { extractYoutubeId } from "@/lib/api/modules/banners/mapper";
import { mapWebsiteBanner } from "@/lib/api/modules/banners/mapper";
import { slugToCategoryId } from "@/lib/api/modules/categories/mapper";
import { mapCourses } from "@/lib/api/modules/courses/mapper";
import type {
  FacultyApi,
  FacultyListViewModel,
  FacultyPageApi,
  FacultyTestimonialApi,
} from "@/lib/api/modules/faculty/types";
import type {
  CategoryId,
  Faculty,
  FacultyReview,
  FacultyVideo,
} from "@/lib/types";

function youtubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function mapCategories(api: FacultyApi): CategoryId[] {
  const ids = (api.categories ?? [])
    .filter((category) => category.isActive !== false)
    .map((category) => slugToCategoryId(category.slug?.trim() || ""))
    .filter((id): id is CategoryId => Boolean(id));

  return ids;
}

function mapSpecialization(api: FacultyApi): string[] {
  return (api.subjects ?? [])
    .filter((subject) => subject.isActive !== false)
    .map((subject) => subject.name?.trim())
    .filter((value): value is string => Boolean(value));
}

function mapExperience(years: number | null | undefined): string {
  if (years === null || years === undefined) return "";
  return `${years}+ years`;
}

function mapReviews(
  testimonials: FacultyTestimonialApi[] | null | undefined
): FacultyReview[] {
  if (!testimonials?.length) return [];

  return testimonials
    .filter((item) => item.isActive !== false)
    .map((item): FacultyReview | null => {
      const name = item.fullName?.trim();
      const quote = item.reviewText?.trim();
      if (!name || !quote) return null;
      return {
        id: String(item.id),
        name,
        quote,
        rating: 5,
        avatar: item.profileImageUrl?.trim() || undefined,
      };
    })
    .filter((item): item is FacultyReview => item !== null);
}

function mapVideos(links: string[] | null | undefined): FacultyVideo[] {
  if (!links?.length) return [];

  return links
    .map((link, index): FacultyVideo | null => {
      const youtubeId = extractYoutubeId(link);
      if (!youtubeId) return null;
      return {
        id: `video-${index}-${youtubeId}`,
        title: "Video lecture",
        href: link.trim(),
        youtubeId,
        thumbnail: youtubeThumbnail(youtubeId),
      };
    })
    .filter((item): item is FacultyVideo => item !== null);
}

/** Listing / marquee card fields only. */
export function mapFacultyCard(api: FacultyApi): Faculty | null {
  if (api.isActive === false) return null;

  const name = api.fullName?.trim();
  const slug = api.slug?.trim();
  if (!name || !slug) return null;

  const designation = api.designation?.trim() || "";
  const specialization = mapSpecialization(api);

  return {
    id: String(api.id),
    slug,
    name,
    title: designation,
    qualification: designation,
    designation,
    badgeLabel: designation,
    specialization,
    experience: mapExperience(api.experienceYears),
    bio: api.about?.trim() || "",
    image: api.profileImageUrl?.trim() || "",
    categories: mapCategories(api),
    featured: api.isFeatured === true,
  };
}

export function mapFacultyCards(
  items: ReadonlyArray<FacultyApi> | null | undefined
): Faculty[] {
  if (!items?.length) return [];
  return items
    .map(mapFacultyCard)
    .filter((item): item is Faculty => item !== null);
}

export function mapFacultyDetail(api: FacultyApi | null): Faculty | null {
  const card = api ? mapFacultyCard(api) : null;
  if (!card || !api) return null;

  const specialization = card.specialization;
  const reviews = mapReviews(api.testimonials);
  const videos = mapVideos(api.videoLinks);
  const fallbackCategory = card.categories[0] ?? "cat";
  const courses = mapCourses(api.courses, fallbackCategory);

  const heroStats =
    api.experienceYears !== null && api.experienceYears !== undefined
      ? [
          {
            id: "exp",
            value: `${api.experienceYears}+`,
            label: "Years of Experience",
            icon: "experience",
          },
        ]
      : undefined;

  return {
    ...card,
    about: api.about?.trim() || undefined,
    philosophy: api.teachingPhilosophy?.trim() || undefined,
    expertiseTags: specialization.length > 0 ? specialization : undefined,
    achievements: (api.achievements ?? [])
      .map((item) => item.trim())
      .filter(Boolean),
    reviews: reviews.length > 0 ? reviews : undefined,
    videos: videos.length > 0 ? videos : undefined,
    courses: courses.length > 0 ? courses : undefined,
    heroStats,
  };
}

export function mapFacultyPage(
  data: FacultyPageApi | null | undefined
): FacultyListViewModel | null {
  if (!data) return null;

  const pagination = data.faculty?.pagination;

  return {
    banner: mapWebsiteBanner(data.banner),
    featuredFaculty: mapFacultyCards(data.featuredFaculty),
    items: mapFacultyCards(data.faculty?.items),
    pagination: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 15,
      total: pagination?.total ?? 0,
      totalPages: Math.max(1, pagination?.totalPages ?? 1),
    },
  };
}
