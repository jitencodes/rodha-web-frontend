import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapStudentResultList } from "@/lib/api/modules/student-results/mapper";
import type {
  StudentResultListApi,
  StudentResultListViewModel,
} from "@/lib/api/modules/student-results/types";

const PATH = "api/website/student-results";

export async function getStudentResults(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  resultId?: string;
}): Promise<StudentResultListViewModel> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search?.trim(),
    category:
      params.category && params.category !== "all"
        ? params.category.trim()
        : undefined,
    resultId: params.resultId?.trim(),
  });
  const data = await apiGetOrNull<StudentResultListApi>(`${PATH}${query}`);
  return mapStudentResultList(data);
}
