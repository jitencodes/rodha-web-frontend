/** Passport photo rules for the registration form (enforced on the frontend). */
export const PASSPORT_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PASSPORT_PHOTO_MAX_LABEL = "5 MB";
export const PASSPORT_PHOTO_ACCEPT = "image/jpeg,image/png,.jpg,.jpeg,.png";
export const PASSPORT_PHOTO_HELPER_TEXT = `JPG, JPEG or PNG, max ${PASSPORT_PHOTO_MAX_LABEL}, face clearly visible, plain background.`;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/pjpeg"]);
const ALLOWED_EXTENSION = /\.(jpe?g|png)$/i;

/** Returns an error message, or null when the file is acceptable. */
export function validatePassportPhoto(file: File | Blob): string | null {
  const name = "name" in file ? file.name : "";
  const type = file.type.toLowerCase();
  // Some browsers report an empty type; fall back to the extension then.
  const typeOk = type ? ALLOWED_TYPES.has(type) : ALLOWED_EXTENSION.test(name);
  const extensionOk = !name || ALLOWED_EXTENSION.test(name);
  if (!typeOk || !extensionOk) {
    return "Only JPG, JPEG or PNG images are allowed.";
  }
  if (file.size <= 0) {
    return "The selected file is empty. Please choose another photo.";
  }
  if (file.size > PASSPORT_PHOTO_MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `Photo is ${mb} MB. Maximum allowed size is ${PASSPORT_PHOTO_MAX_LABEL}.`;
  }
  return null;
}
