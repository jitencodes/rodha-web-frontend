import { apiGetOrNull } from "@/lib/api/client";
import { mapSubjects } from "@/lib/api/modules/subjects/mapper";
import type {
  SubjectApi,
  SubjectViewModel,
} from "@/lib/api/modules/subjects/types";

const PATH = "api/website/subjects";

export async function getActiveSubjects(): Promise<SubjectViewModel[]> {
  const data = await apiGetOrNull<SubjectApi[]>(PATH);
  return mapSubjects(data);
}
