import { CATEGORIES } from "@/lib/constants";
import type {
  CategoryApi,
  WebsiteCategoryViewModel,
} from "@/lib/api/modules/categories/types";
import { KNOWN_CATEGORY_IDS } from "@/lib/api/modules/categories/types";
import type { CategoryId } from "@/lib/types";

export function slugToCategoryId(slug: string): CategoryId | undefined {
  if ((KNOWN_CATEGORY_IDS as readonly string[]).includes(slug)) {
    return slug as CategoryId;
  }
  return undefined;
}

function findLocalCategory(slug: string) {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Map API category → UI view-model.
 * Local CATEGORIES assets (image/icon) are reused when slug matches
 * so ExamCardV2 keeps its 3D infographic look.
 */
export function mapCategory(
  item: CategoryApi
): WebsiteCategoryViewModel | null {
  if (!item?.slug?.trim() || !item?.name?.trim()) return null;
  if (item.isActive === false) return null;

  const local = findLocalCategory(item.slug);
  const counsellingExamId = slugToCategoryId(item.slug);
  const description =
    item.description?.trim() ||
    local?.description ||
    item.title?.trim() ||
    "";

  return {
    id: String(item.id),
    name: item.name.trim(),
    menuLabel: item.title?.trim() || item.name.trim(),
    slug: item.slug.trim(),
    description,
    subHeading: item.title?.trim() || local?.subHeading,
    icon: local?.icon || item.iconUrl || undefined,
    image: local?.image || item.iconUrl || undefined,
    counsellingExamId,
  };
}

export function mapCategories(
  items: CategoryApi[] | null | undefined
): WebsiteCategoryViewModel[] {
  if (!items?.length) return [];
  return items
    .map(mapCategory)
    .filter((item): item is WebsiteCategoryViewModel => item !== null);
}
