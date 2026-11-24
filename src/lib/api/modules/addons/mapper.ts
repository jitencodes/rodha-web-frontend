import type {
  AddonApi,
  AddonCarrierApi,
  AddonType,
  AddonViewModel,
  OrderAddonApi,
  OrderAddonViewModel,
} from "@/lib/api/modules/addons/types";

const TYPE_LABEL: Record<AddonType, string> = {
  GRAPHY_COURSE: "Course",
  BUDDY_PACKAGE: "Rodha Buddy",
  BOOK: "Book",
};

/** API limit for `addonIds`. */
const MAX_ADDON_IDS = 100;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asAmount(value: unknown): number {
  const n =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function asId(value: unknown): number | null {
  const n =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function asType(value: unknown): AddonType | null {
  return typeof value === "string" && value in TYPE_LABEL
    ? (value as AddonType)
    : null;
}

function addonDetail(addon: AddonApi, name: string): string {
  const points = addon.buddyPackage?.doubtPoints;
  if (typeof points === "number" && points > 0) {
    return `${points.toLocaleString("en-IN")} doubt points`;
  }
  const linked =
    asString(addon.course?.courseTitle) ||
    asString(addon.course?.graphyTitle) ||
    asString(addon.book?.name);
  return linked && linked.toLowerCase() !== name.toLowerCase() ? linked : "";
}

export function mapAddon(
  addon: AddonApi | null | undefined
): AddonViewModel | null {
  const id = asId(addon?.id);
  const name = asString(addon?.name);
  if (!addon || id == null || !name) return null;
  const type = asType(addon.type);
  const owned = addon.owned === true;
  return {
    id,
    name,
    type,
    typeLabel: type ? TYPE_LABEL[type] : "Add-on",
    detail: addonDetail(addon, name),
    price: asAmount(addon.price),
    owned,
    selectable:
      !owned && addon.isActive !== false && addon.selectable !== false,
  };
}

export function mapAddons(
  addons: AddonApi[] | null | undefined
): AddonViewModel[] {
  if (!Array.isArray(addons)) return [];
  return addons
    .map(mapAddon)
    .filter((addon): addon is AddonViewModel => addon != null);
}

/**
 * Add-ons to show for a package: everything still sellable plus what the
 * student owns (shown disabled). Falls back to `availableAddons` /
 * `ownedAddons` when the combined list is missing.
 */
export function mapCarrierAddons(
  carrier: AddonCarrierApi | null | undefined
): AddonViewModel[] {
  const combined = mapAddons(carrier?.addons);
  const list = combined.length
    ? combined
    : [
        ...mapAddons(carrier?.availableAddons),
        ...mapAddons(carrier?.ownedAddons),
      ];
  const seen = new Set<number>();
  return list.filter((addon) => {
    if (seen.has(addon.id) || (!addon.selectable && !addon.owned)) return false;
    seen.add(addon.id);
    return true;
  });
}

export function mapOrderAddons(
  addons: OrderAddonApi[] | null | undefined
): OrderAddonViewModel[] {
  if (!Array.isArray(addons)) return [];
  return addons.flatMap((addon) => {
    const name = asString(addon?.name);
    if (!name) return [];
    const type = asType(addon.type);
    return [
      {
        id: String(addon.id ?? addon.addonId ?? name),
        name,
        type,
        typeLabel: type ? TYPE_LABEL[type] : "Add-on",
        price: asAmount(addon.price),
      },
    ];
  });
}

/** Request body guard: positive integer ids, deduped, within the API limit. */
export function readAddonIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const ids = value.map(asId).filter((id): id is number => id != null);
  return [...new Set(ids)].slice(0, MAX_ADDON_IDS);
}
