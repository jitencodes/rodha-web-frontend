export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const PHONE_LENGTH = 10;
export const EMAIL_MAX_LENGTH = 100;
export const MESSAGE_MIN_LENGTH = 5;
export const MESSAGE_MAX_LENGTH = 1000;
export const PASSWORD_MIN_LENGTH = 8;

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

export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

export function getPasswordRules(value: string): PasswordRule[] {
  return [
    {
      id: "length",
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      met: value.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "lower",
      label: "One lowercase letter",
      met: /[a-z]/.test(value),
    },
    {
      id: "upper",
      label: "One uppercase letter",
      met: /[A-Z]/.test(value),
    },
    {
      id: "number",
      label: "One number",
      met: /\d/.test(value),
    },
    {
      id: "special",
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(value),
    },
  ];
}

export type PasswordStrength = "weak" | "medium" | "strong";

export function getPasswordStrength(value: string): PasswordStrength | null {
  if (!value) return null;
  const met = getPasswordRules(value).filter((rule) => rule.met).length;
  if (met <= 2) return "weak";
  if (met <= 4) return "medium";
  return "strong";
}

export function validatePassword(
  value: string,
  options?: { strict?: boolean }
): string | undefined {
  if (!value) return "Password is required.";
  if (options?.strict) {
    const unmet = getPasswordRules(value).filter((rule) => !rule.met);
    if (unmet.length > 0) return "Password does not meet all requirements.";
    return undefined;
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return undefined;
}

export function validatePasswordConfirm(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm) return "Confirm your password.";
  if (confirm !== password) return "Passwords do not match.";
  return undefined;
}
