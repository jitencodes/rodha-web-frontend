import type {
  SubjectApi,
  SubjectViewModel,
} from "@/lib/api/modules/subjects/types";

export function mapSubject(item: SubjectApi): SubjectViewModel | null {
  const name = item.name?.trim();
  if (!name) return null;

  return {
    id: String(item.id),
    name,
    categoryIds: (item.categories ?? [])
      .filter((category) => category.isActive !== false)
      .map((category) => String(category.id)),
  };
}

export function mapSubjects(
  items: SubjectApi[] | null | undefined
): SubjectViewModel[] {
  if (!items?.length) return [];
  return items
    .map(mapSubject)
    .filter((item): item is SubjectViewModel => item !== null);
}
