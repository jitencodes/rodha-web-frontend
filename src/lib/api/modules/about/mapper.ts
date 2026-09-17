import { mapWebsiteBanner } from "@/lib/api/modules/banners/mapper";
import type {
  AboutJourneyApi,
  AboutPageApi,
  AboutPageViewModel,
  AboutStackApi,
  AboutJourneyViewModel,
  AboutStatViewModel,
  GalleryApi,
  GalleryImageViewModel,
} from "@/lib/api/modules/about/types";

export function mapGalleryImages(
  items: GalleryApi[] | null | undefined
): GalleryImageViewModel[] {
  if (!items?.length) return [];

  return items
    .filter((item) => item.isActive !== false)
    .map((item): GalleryImageViewModel | null => {
      const src = item.imageUrl?.trim();
      if (!src) return null;
      return {
        id: String(item.id),
        src,
        alt: item.title?.trim() || "Rodha team",
      };
    })
    .filter((item): item is GalleryImageViewModel => item !== null);
}

function formatJourneyYear(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.trim();
  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function mapJourney(item: AboutJourneyApi): AboutJourneyViewModel | null {
  if (item.isActive === false) return null;
  const title = item.title?.trim();
  if (!title) return null;

  return {
    id: String(item.id),
    year: formatJourneyYear(item.timelineDate),
    title,
    description: item.description?.trim() || "",
    icon: item.iconUrl?.trim() || "",
  };
}

function mapStat(item: AboutStackApi): AboutStatViewModel | null {
  if (item.isActive === false) return null;
  const value = item.count?.trim();
  const label = item.title?.trim();
  if (!value || !label) return null;

  return {
    id: String(item.id),
    value,
    label,
    icon: item.iconUrl?.trim() || "",
  };
}

export function mapAboutPage(
  data: AboutPageApi | null | undefined
): AboutPageViewModel | null {
  if (!data) return null;

  return {
    banner: mapWebsiteBanner(data.banner),
    journeys: (data.journeys ?? [])
      .map(mapJourney)
      .filter((item): item is AboutJourneyViewModel => item !== null),
    stats: (data.stacks ?? [])
      .map(mapStat)
      .filter((item): item is AboutStatViewModel => item !== null),
    galleries: mapGalleryImages(data.galleries),
  };
}
