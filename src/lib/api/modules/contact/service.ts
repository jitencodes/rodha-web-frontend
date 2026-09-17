import { apiPost } from "@/lib/api/client";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import {
  mapContactRequest,
  mapContactResponse,
} from "@/lib/api/modules/contact/mapper";
import type {
  ContactSubmitApi,
  ContactSubmitViewModel,
} from "@/lib/api/modules/contact/types";
import { ApiError } from "@/lib/api/types";

const PATH = "api/website/contact";

export async function resolveWebsiteCategoryId(
  examId?: string
): Promise<number | undefined> {
  const raw = examId?.trim();
  if (!raw) return undefined;
  if (/^\d+$/.test(raw)) return Number.parseInt(raw, 10);

  const categories = await getActiveCategories();
  const match = categories.find(
    (category) =>
      category.id === raw ||
      category.slug === raw ||
      category.counsellingExamId === raw
  );
  if (!match) return undefined;

  const id = Number.parseInt(match.id, 10);
  return Number.isFinite(id) ? id : undefined;
}

export async function submitContact(input: {
  name: string;
  phone: string;
  email?: string;
  websiteCategoryId?: number;
  message?: string;
}): Promise<ContactSubmitViewModel> {
  const body = mapContactRequest(input);
  const data = await apiPost<ContactSubmitApi, typeof body>(PATH, body);
  const mapped = mapContactResponse(data);
  if (!mapped) {
    throw new ApiError("Contact submit returned no id", 502, data);
  }
  return mapped;
}
