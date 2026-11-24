/** Package add-ons — shapes from `Rodha_Package_Addons_FE` Postman. */

export type AddonType = "GRAPHY_COURSE" | "BUDDY_PACKAGE" | "BOOK";

export interface AddonApi {
  id?: number | string;
  name?: string | null;
  type?: AddonType | string | null;
  price?: number | string | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  /** Already in the student's account. */
  owned?: boolean | null;
  selectable?: boolean | null;
  course?: {
    courseTitle?: string | null;
    graphyTitle?: string | null;
  } | null;
  buddyPackage?: { name?: string | null; doubtPoints?: number | null } | null;
  book?: { name?: string | null } | null;
}

/** Add-on fields carried by packages, cart products and upgrade targets. */
export interface AddonCarrierApi {
  addons?: AddonApi[] | null;
  ownedAddons?: AddonApi[] | null;
  availableAddons?: AddonApi[] | null;
}

export interface AddonViewModel {
  id: number;
  name: string;
  type: AddonType | null;
  typeLabel: string;
  /** Extra line (doubt points, linked course); empty when it repeats the name. */
  detail: string;
  price: number;
  owned: boolean;
  selectable: boolean;
}

/** `items[].addons[]` on an order. */
export interface OrderAddonApi {
  id?: number | string;
  addonId?: number | string | null;
  name?: string | null;
  type?: AddonType | string | null;
  price?: number | string | null;
}

export interface OrderAddonViewModel {
  id: string;
  name: string;
  type: AddonType | null;
  typeLabel: string;
  price: number;
}
