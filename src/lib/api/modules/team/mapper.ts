import { mapWebsiteBanner } from "@/lib/api/modules/banners/mapper";
import { mapGalleryImages } from "@/lib/api/modules/about/mapper";
import { mapFacultyCards } from "@/lib/api/modules/faculty/mapper";
import type {
  TeamPageApi,
  TeamPageViewModel,
} from "@/lib/api/modules/team/types";

export function mapTeamPage(
  data: TeamPageApi | null | undefined
): TeamPageViewModel | null {
  if (!data) return null;

  return {
    banner: mapWebsiteBanner(data.banner),
    featuredFaculty: mapFacultyCards(data.featuredFaculty),
    galleries: mapGalleryImages(data.galleries),
  };
}
