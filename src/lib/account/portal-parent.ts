/**
 * Portal target for account-themed menus.
 * Prefer the nearest `.account-shell` so CSS variables resolve (portaling to
 * `document.body` leaves `--account-*` undefined → transparent menus).
 */
export function getAccountPortalParent(
  from: Element | null | undefined
): HTMLElement {
  if (typeof document === "undefined") {
    throw new Error("getAccountPortalParent requires document");
  }
  const nearest = from?.closest(".account-shell");
  if (nearest instanceof HTMLElement) return nearest;
  const first = document.querySelector(".account-shell");
  if (first instanceof HTMLElement) return first;
  return document.body;
}
