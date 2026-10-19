export interface RecentPurchaseApi {
  studentName?: string | null;
  itemName?: string | null;
  purchasedAt?: string | null;
}

export interface RecentPurchaseViewModel {
  studentName: string;
  itemName: string;
  purchasedAt: string;
}
