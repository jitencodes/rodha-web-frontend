export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const PHONE_LENGTH = 10;
export const EMAIL_MAX_LENGTH = 100;
export const MESSAGE_MIN_LENGTH = 5;
export const MESSAGE_MAX_LENGTH = 1000;

const NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const PHONE_PATTERN = /^[0-9]{10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BLOCKED_PHONE_KEYS = new Set(["e", "E", "+", "-", ".", " "]);

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^A-Za-z\s]/g, "").slice(0, NAME_MAX_LENGTH);
}

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_LENGTH);
}

export function isBlockedPhoneKey(key: string): boolean {
  return BLOCKED_PHONE_KEYS.has(key);
}

export function validateName(value: string): string | undefined {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "Name is required.";
  if (name.length < NAME_MIN_LENGTH) {
    return `Name must be at least ${NAME_MIN_LENGTH} characters.`;
  }
  if (!NAME_PATTERN.test(name)) {
    return "Name can only contain letters and spaces.";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const phone = value.trim();
  if (!phone) return "Mobile number is required.";
  if (!PHONE_PATTERN.test(phone)) {
    return "Enter a 10-digit mobile number.";
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Email is required.";
  if (email.length > EMAIL_MAX_LENGTH) return "Email is too long.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

export function validateExam(value: string): string | undefined {
  if (!value.trim()) return "Please select a category.";
  return undefined;
}

export function validateExamYear(value: string, required: boolean): string | undefined {
  if (required && !value.trim()) return "Please select an exam year.";
  return undefined;
}

export function validateMessage(value: string): string | undefined {
  const message = value.trim();
  if (!message) return "Message is required.";
  if (message.length < MESSAGE_MIN_LENGTH) {
    return "Please enter a bit more detail.";
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return `Message must be under ${MESSAGE_MAX_LENGTH} characters.`;
  }
  return undefined;
}
