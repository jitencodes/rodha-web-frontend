/** Raw announcement from GET /api/website/announcements */
export interface AnnouncementApi {
  id: number;
  title: string;
  description: string;
  endAt: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/** UI view-model for PromotionalBanner */
export interface AnnouncementViewModel {
  id: number;
  title: string;
  /** HTML description from API */
  descriptionHtml: string;
  /** Present only when API provides endAt and it is in the future */
  endAt: string | null;
}
