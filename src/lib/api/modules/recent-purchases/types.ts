export interface RecentPurchaseItemApi {
  userName?: string | null;
  itemName?: string | null;
  itemSlug?: string | null;
  /** e.g. `package` */
  itemType?: string | null;
  purchasedAt?: string | null;
}

/** `GET api/website/recent-purchases` → `data` */
export interface RecentPurchasesApi {
  items?: RecentPurchaseItemApi[] | null;
}

export interface RecentPurchaseViewModel {
  id: string;
  studentName: string;
  itemName: string;
  /** Detail page for the purchased item, when its type has one. */
  itemHref: string | null;
  purchasedAt: string;
}
