import type { RegistrationFormValues } from "@/lib/account/registration-form";
import { validatePassportPhoto } from "@/lib/account/passport-photo";

/**
 * Unsubmitted registration form drafts, kept per account until submit.
 * - Field values → localStorage (far larger than a cookie allows; never needs
 *   to reach the server).
 * - Passport photo → IndexedDB, which can hold the binary `File`.
 */
const DRAFT_KEY_PREFIX = "rodha.registration.draft:";
const DRAFT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Prefilled from the account/enrolment; always taken fresh from the API. */
const READ_ONLY_KEYS = new Set<keyof RegistrationFormValues>([
  "fullName",
  "registeredEmail",
  "mobile",
  "courseEnrolled",
  "batchEnrolled",
]);

type StoredDraft = {
  savedAt: number;
  values: Partial<RegistrationFormValues>;
};

function draftKey(accountKey: string): string | null {
  const id = accountKey.trim().toLowerCase();
  return id ? `${DRAFT_KEY_PREFIX}${id}` : null;
}

function sameShape(a: unknown, b: unknown): boolean {
  if (Array.isArray(a)) {
    return Array.isArray(b) && b.every((item) => typeof item === "string");
  }
  return typeof a === typeof b;
}

/** Overlay a saved draft onto fresh defaults. Unknown or mistyped keys are ignored. */
export function applyRegistrationDraft(
  base: RegistrationFormValues,
  accountKey: string
): RegistrationFormValues {
  const key = draftKey(accountKey);
  if (!key || typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return base;
    const draft = JSON.parse(raw) as StoredDraft | null;
    if (
      !draft ||
      typeof draft.savedAt !== "number" ||
      Date.now() - draft.savedAt > DRAFT_TTL_MS ||
      !draft.values ||
      typeof draft.values !== "object"
    ) {
      window.localStorage.removeItem(key);
      return base;
    }

    const next: RegistrationFormValues = { ...base };
    const target = next as Record<string, unknown>;
    for (const [field, value] of Object.entries(draft.values)) {
      if (READ_ONLY_KEYS.has(field as keyof RegistrationFormValues)) continue;
      if (!(field in base)) continue;
      if (!sameShape(target[field], value)) continue;
      target[field] = value;
    }
    return next;
  } catch {
    return base;
  }
}

export function saveRegistrationDraft(
  values: RegistrationFormValues,
  accountKey: string
): void {
  const key = draftKey(accountKey);
  if (!key || typeof window === "undefined") return;
  const stored: Partial<RegistrationFormValues> = {};
  const source = values as Record<string, unknown>;
  const out = stored as Record<string, unknown>;
  for (const field of Object.keys(values)) {
    if (READ_ONLY_KEYS.has(field as keyof RegistrationFormValues)) continue;
    out[field] = source[field];
  }
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ savedAt: Date.now(), values: stored } satisfies StoredDraft)
    );
  } catch {
    // storage full / blocked — drafts are best-effort
  }
}

/** Removes both the saved field values and the saved passport photo. */
export function clearRegistrationDraft(accountKey: string): void {
  const key = draftKey(accountKey);
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  void deletePassportPhotoDraft(accountKey);
}

let allDraftsCleared = false;

/**
 * Wipes every registration draft on this browser (all accounts). Used once the
 * gate reports registration completed, e.g. after submitting on another device.
 */
export function clearAllRegistrationDrafts(): void {
  if (allDraftsCleared || typeof window === "undefined") return;
  allDraftsCleared = true;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(DRAFT_KEY_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
  void withPhotoStore("readwrite", (store) => store.clear());
}

/* ---- Passport photo (IndexedDB) ---- */

const PHOTO_DB_NAME = "rodha-registration";
const PHOTO_DB_VERSION = 1;
const PHOTO_STORE = "passport-photos";

type StoredPhoto = {
  blob: Blob;
  name: string;
  type: string;
  lastModified: number;
  savedAt: number;
};

function openPhotoDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(PHOTO_STORE)) {
          request.result.createObjectStore(PHOTO_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Runs one request in its own transaction; resolves null on any failure. */
async function withPhotoStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T | null> {
  const db = await openPhotoDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PHOTO_STORE, mode);
      const request = run(tx.objectStore(PHOTO_STORE));
      let result: T | null = null;
      request.onsuccess = () => {
        result = request.result;
      };
      tx.oncomplete = () => {
        db.close();
        resolve(result);
      };
      tx.onerror = () => {
        db.close();
        resolve(null);
      };
      tx.onabort = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function savePassportPhotoDraft(
  accountKey: string,
  file: File
): Promise<void> {
  const key = draftKey(accountKey);
  if (!key) return;
  const record: StoredPhoto = {
    blob: file,
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    savedAt: Date.now(),
  };
  await withPhotoStore("readwrite", (store) => store.put(record, key));
}

export async function deletePassportPhotoDraft(accountKey: string): Promise<void> {
  const key = draftKey(accountKey);
  if (!key) return;
  await withPhotoStore("readwrite", (store) => store.delete(key));
}

/** Saved photo for this account, or null when missing, expired or no longer valid. */
export async function loadPassportPhotoDraft(
  accountKey: string
): Promise<File | null> {
  const key = draftKey(accountKey);
  if (!key) return null;
  const record = (await withPhotoStore("readonly", (store) =>
    store.get(key)
  )) as StoredPhoto | undefined | null;
  if (!record || !(record.blob instanceof Blob)) return null;

  const file = new File([record.blob], record.name || "passport-photo", {
    type: record.type || record.blob.type,
    lastModified: record.lastModified || Date.now(),
  });
  if (
    Date.now() - (record.savedAt || 0) > DRAFT_TTL_MS ||
    validatePassportPhoto(file)
  ) {
    await deletePassportPhotoDraft(accountKey);
    return null;
  }
  return file;
}
