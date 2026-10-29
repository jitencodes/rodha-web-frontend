import { getGoogleMapsApiKey } from "@/lib/constants";
import type { DetectedLocation } from "@/lib/store/user";

type GeocodeComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

type GeocodeResult = {
  address_components?: GeocodeComponent[];
};

type StatesResponse = {
  ok?: boolean;
  items?: Array<{
    stateId?: number;
    name?: string;
    code?: string;
    label?: string;
  }>;
};

const ALIASES: Record<string, string> = {
  "nct of delhi": "delhi",
  "national capital territory of delhi": "delhi",
  delhi: "delhi",
  orissa: "odisha",
  pondicherry: "puducherry",
  uttaranchal: "uttarakhand",
};

function normalizePlaceName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalPlaceName(value: string): string {
  const normalized = normalizePlaceName(value);
  return ALIASES[normalized] ?? normalized;
}

function readPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 60_000,
    });
  });
}

async function reverseGeocodeState(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<{ longName: string; shortName: string } | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${latitude},${longitude}`);
  url.searchParams.set("result_type", "administrative_area_level_1");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) return null;
  const data = (await response.json()) as { results?: GeocodeResult[] };
  for (const result of data.results ?? []) {
    for (const component of result.address_components ?? []) {
      if (!component.types?.includes("administrative_area_level_1")) continue;
      const longName = component.long_name?.trim() || "";
      const shortName = component.short_name?.trim() || "";
      if (!longName && !shortName) continue;
      return { longName, shortName };
    }
  }
  return null;
}

async function matchStateId(place: {
  longName: string;
  shortName: string;
}): Promise<{ stateId: number; stateName: string } | null> {
  const response = await fetch("/api/states/dropdown?limit=50");
  if (!response.ok) return null;
  const data = (await response.json()) as StatesResponse;
  if (!data.ok) return null;

  const longKey = place.longName ? canonicalPlaceName(place.longName) : "";
  const shortKey = place.shortName.trim().toUpperCase();

  for (const item of data.items ?? []) {
    if (item.stateId == null || !Number.isFinite(item.stateId)) continue;
    const names = [item.name, item.label].filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0
    );
    const nameMatch = longKey
      ? names.some((name) => canonicalPlaceName(name) === longKey)
      : false;
    const codeMatch =
      shortKey.length > 0 &&
      typeof item.code === "string" &&
      item.code.trim().toUpperCase() === shortKey;
    if (!nameMatch && !codeMatch) continue;
    return {
      stateId: item.stateId,
      stateName: item.name || item.label || place.longName || place.shortName,
    };
  }
  return null;
}

export type CheckoutStateResolution =
  | { status: "resolved"; stateName: string }
  | { status: "permission_denied" }
  | { status: "needs_manual" };

/**
 * Checkout-only state from GPS + Google reverse geocode.
 * Sends the administrative area long name, or the short code when that is all Google returns.
 * Does not write the student profile.
 */
export async function resolveCheckoutState(): Promise<CheckoutStateResolution> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { status: "needs_manual" };
  }
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return { status: "needs_manual" };

  let position: GeolocationPosition;
  try {
    position = await readPosition();
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? Number((error as GeolocationPositionError).code)
        : 0;
    if (code === 1) return { status: "permission_denied" };
    return { status: "needs_manual" };
  }

  try {
    const place = await reverseGeocodeState(
      position.coords.latitude,
      position.coords.longitude,
      apiKey
    );
    const stateName = place?.longName || place?.shortName || "";
    if (!stateName) return { status: "needs_manual" };
    return { status: "resolved", stateName };
  } catch {
    return { status: "needs_manual" };
  }
}

/** Browser GPS + Google reverse geocode. Returns null on any failure. */
export async function detectCurrentState(): Promise<DetectedLocation | null> {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || typeof navigator === "undefined" || !navigator.geolocation) {
    return null;
  }

  try {
    const position = await readPosition();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const place = await reverseGeocodeState(latitude, longitude, apiKey);
    if (!place) {
      return { latitude, longitude, stateId: null, stateName: null };
    }
    const match = await matchStateId(place);
    return {
      latitude,
      longitude,
      stateId: match?.stateId ?? null,
      stateName: match?.stateName ?? (place.longName || null),
    };
  } catch {
    return null;
  }
}
