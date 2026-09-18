import type { WebsiteBannerApi } from "@/lib/api/modules/banners/types";
import type { WebsiteBannerViewModel } from "@/lib/api/modules/banners/types";
import type { GalleryApi } from "@/lib/api/modules/about/types";
import type { GalleryImageViewModel } from "@/lib/api/modules/about/types";
import type { FacultyApi } from "@/lib/api/modules/faculty/types";
import type { Faculty } from "@/lib/types";

export interface TeamPageApi {
  banner?: WebsiteBannerApi | null;
  featuredFaculty?: FacultyApi[] | null;
  galleries?: GalleryApi[] | null;
}

export interface TeamPageViewModel {
  banner: WebsiteBannerViewModel | null;
  featuredFaculty: Faculty[];
  galleries: GalleryImageViewModel[];
}
