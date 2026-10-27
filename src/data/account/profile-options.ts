/** Static enums for student registration (masters come from API). */

export type ProfileOption = { value: string; label: string };

function opts(values: readonly string[]): ProfileOption[] {
  return values.map((value) => ({ value, label: value }));
}

/** API gender enums */
export const PROFILE_GENDER_OPTIONS: ProfileOption[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

export const PROFILE_LANGUAGE_OPTIONS = opts([
  "English",
  "Hindi",
  "Hinglish",
] as const);

export const PROFILE_SCORING_SCHEME_OPTIONS: ProfileOption[] = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "CGPA", label: "CGPA (out of 10)" },
];

export const PROFILE_CLASS12_STATUS_OPTIONS: ProfileOption[] = [
  { value: "PASSED", label: "Passed" },
  { value: "APPEARING", label: "Appearing" },
];

export const PROFILE_GRADUATION_STATUS_OPTIONS: ProfileOption[] = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
];

export const PROFILE_PG_STATUS_OPTIONS: ProfileOption[] = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "PURSUING", label: "Pursuing" },
];

export const PROFILE_YES_NO_OPTIONS: ProfileOption[] = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const PROFILE_PARENT_RELATION_OPTIONS = opts([
  "Father",
  "Mother",
  "Guardian",
] as const);

export const PROFILE_CAT_ATTEMPTS_OPTIONS = opts([
  "0",
  "1",
  "2",
  "3+",
] as const);

export const PROFILE_SOURCE_OPTIONS = opts([
  "YouTube",
  "Instagram",
  "Telegram",
  "WhatsApp group",
  "Friend/Senior",
  "Google search",
  "Online ad",
  "Other",
] as const);

export const PROFILE_CONSENT_STATEMENTS = {
  declaration: "I confirm the information provided is true and accurate.",
  privacy:
    "I consent to my data being used for course delivery, counselling, GDPI services and updates, only for internal purposes, as per the Privacy Policy.",
  whatsapp:
    "I agree to receive WhatsApp communications for important updates.",
} as const;

export const PROFILE_OTHER_VALUE = "Other";

export function profileYearOptions(
  fromYear: number,
  toYear: number
): ProfileOption[] {
  const years: ProfileOption[] = [];
  for (let y = toYear; y >= fromYear; y -= 1) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

/** Target year: current year to current year + 3 */
export function profileTargetYearOptions(now = new Date()): ProfileOption[] {
  const y = now.getFullYear();
  return profileYearOptions(y, y + 3).reverse();
}

export function profilePassingYearOptions(now = new Date()): ProfileOption[] {
  return profileYearOptions(1995, now.getFullYear() + 1);
}

/** Last 5 calendar years for previous CAT year */
export function profilePreviousCatYearOptions(
  now = new Date()
): ProfileOption[] {
  const y = now.getFullYear();
  return profileYearOptions(y - 4, y);
}
