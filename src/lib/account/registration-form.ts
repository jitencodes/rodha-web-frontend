import { PROFILE_OTHER_VALUE } from "@/data/account/profile-options";
import type { StudentRegistrationFormViewModel } from "@/lib/api/modules/student/registration/types";
import {
  validateEmail,
  validateIndianMobile,
} from "@/lib/form-validation";

export type RegistrationFormValues = {
  // A read-only (display only)
  fullName: string;
  registeredEmail: string;
  mobile: string;
  courseEnrolled: string;
  batchEnrolled: string;

  // B Exam goal
  targetVerticalId: string;
  targetExamIds: string[];
  targetYear: string;
  currentStatusId: string;
  primaryLanguage: string;

  // C Personal
  dateOfBirth: string;
  gender: string;
  studentCategoryId: string;
  isPwd: string;
  govtIdLast4: string;

  // D Contact
  whatsappSameAsMobile: boolean;
  whatsappNumber: string;
  alternatePhone: string;
  alternateEmail: string;
  linkedinUrl: string;

  // E Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: string;
  pinCode: string;

  // F Parent
  parentName: string;
  parentRelation: string;
  parentMobile: string;

  // G Class 10 / 12
  class10BoardName: string;
  class10BoardOtherText: string;
  class10ScoringScheme: string;
  class10Score: string;
  class10YearOfPassing: string;
  class12Status: string;
  class12BoardName: string;
  class12BoardOtherText: string;
  class12Stream: string;
  class12ScoringScheme: string;
  class12Score: string;
  class12YearOfPassing: string;

  // H Graduation
  graduationStream: string;
  graduationDegree: string;
  graduationDegreeOtherText: string;
  graduationSpecialisation: string;
  graduationCollege: string;
  graduationStatus: string;
  graduationYear: string;
  graduationScoringScheme: string;
  graduationScore: string;

  // I PG
  postGraduationStatus: string;
  pgStream: string;
  pgDegreeSpecialization: string;
  pgCollege: string;
  pgScoringScheme: string;
  pgScore: string;

  // J Work
  hasWorkExperience: string;
  workExperienceMonths: string;
  workOrganization: string;
  workDesignation: string;
  industryId: string;

  // K CAT / colleges
  previousCatAttempts: string;
  previousCatYear: string;
  previousCatOverallPercentile: string;
  previousCatVarcPercentile: string;
  previousCatDilrPercentile: string;
  previousCatQaPercentile: string;
  targetCollegeIds: string[];

  // L Books
  bookIds: string[];
  bookSelectAll: boolean;

  // M Source
  source: string;
  sourceOtherText: string;

  // N Consents
  declarationAccepted: boolean;
  privacyConsentAccepted: boolean;
  whatsappConsent: boolean;
};

export type RegistrationFieldErrors = Partial<
  Record<keyof RegistrationFormValues, string>
> & {
  passportPhoto?: string;
};

export type RegistrationStatusKind =
  | "school"
  | "college"
  | "graduate"
  | "working"
  | "unknown";

const PIN_PATTERN = /^[1-9][0-9]{5}$/;
const LAST_FOUR_PATTERN = /^[0-9]{4}$/;
const LINKEDIN_PATTERN =
  /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/i;

function requiredSelect(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required.`;
  return undefined;
}

function requiredText(
  value: string,
  label: string,
  max?: number
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required.`;
  if (max && trimmed.length > max) {
    return `${label} must be at most ${max} characters.`;
  }
  return undefined;
}

function optionalMax(
  value: string,
  label: string,
  max: number
): string | undefined {
  if (!value.trim()) return undefined;
  if (value.trim().length > max) {
    return `${label} must be at most ${max} characters.`;
  }
  return undefined;
}

export function classifyCurrentStatus(
  statusId: string,
  statuses: { id: number; label: string }[]
): RegistrationStatusKind {
  const id = Number(statusId);
  const match = statuses.find((s) => s.id === id);
  const name = (match?.label || "").toLowerCase();
  if (name.includes("school")) return "school";
  if (
    name.includes("college") ||
    name.includes("undergrad") ||
    /\bug\b/.test(name)
  ) {
    return "college";
  }
  if (name.includes("working")) return "working";
  if (name.includes("graduate")) return "graduate";
  return "unknown";
}

export function needsHigherEducation(
  kind: RegistrationStatusKind
): boolean {
  return kind === "college" || kind === "graduate" || kind === "working";
}

export function needsGradOrWorking(kind: RegistrationStatusKind): boolean {
  return kind === "graduate" || kind === "working";
}

/** UG / graduate (and working) cannot still be Appearing in Class 12. */
export function class12AppearingAllowed(
  kind: RegistrationStatusKind
): boolean {
  return kind === "school" || kind === "unknown";
}

export function calculateAge(dobIso: string, now = new Date()): number | null {
  if (!dobIso) return null;
  const dob = new Date(dobIso);
  if (Number.isNaN(dob.getTime())) return null;
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function validateScore(
  value: string,
  scheme: string,
  label: string,
  required: boolean
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? `${label} is required.` : undefined;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return `${label} must be a number.`;
  if (scheme === "CGPA") {
    if (num < 0 || num > 10) return `${label} must be between 0 and 10.`;
  } else {
    if (num < 0 || num > 100) return `${label} must be between 0 and 100.`;
  }
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(trimmed)) {
    return `${label} allows up to 2 decimal places.`;
  }
  return undefined;
}

export function validatePercentile(
  value: string,
  label: string,
  required: boolean
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? `${label} is required.` : undefined;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0 || num > 100) {
    return `${label} must be between 0 and 100.`;
  }
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(trimmed)) {
    return `${label} allows up to 2 decimal places.`;
  }
  return undefined;
}

export function createEmptyRegistrationForm(
  data?: StudentRegistrationFormViewModel | null
): RegistrationFormValues {
  const account = data?.account;
  return {
    fullName: account?.fullName || "",
    registeredEmail: account?.email || "",
    mobile: account?.mobile || "",
    courseEnrolled: data?.batchCourse || "—",
    batchEnrolled: data?.batch || "—",

    targetVerticalId:
      data?.preselectedTargetVerticalId != null
        ? String(data.preselectedTargetVerticalId)
        : "",
    targetExamIds: [],
    targetYear: "",
    currentStatusId: "",
    primaryLanguage: "",

    dateOfBirth: "",
    gender: "",
    studentCategoryId: "",
    isPwd: "false",
    govtIdLast4: "",

    whatsappSameAsMobile: true,
    whatsappNumber: "",
    alternatePhone: "",
    alternateEmail: "",
    linkedinUrl: "",

    addressLine1: "",
    addressLine2: "",
    city: "",
    stateId: "",
    pinCode: "",

    parentName: "",
    parentRelation: "",
    parentMobile: "",

    class10BoardName: "",
    class10BoardOtherText: "",
    class10ScoringScheme: "",
    class10Score: "",
    class10YearOfPassing: "",
    class12Status: "",
    class12BoardName: "",
    class12BoardOtherText: "",
    class12Stream: "",
    class12ScoringScheme: "",
    class12Score: "",
    class12YearOfPassing: "",

    graduationStream: "",
    graduationDegree: "",
    graduationDegreeOtherText: "",
    graduationSpecialisation: "",
    graduationCollege: "",
    graduationStatus: "",
    graduationYear: "",
    graduationScoringScheme: "",
    graduationScore: "",

    postGraduationStatus: "",
    pgStream: "",
    pgDegreeSpecialization: "",
    pgCollege: "",
    pgScoringScheme: "",
    pgScore: "",

    hasWorkExperience: "false",
    workExperienceMonths: "",
    workOrganization: "",
    workDesignation: "",
    industryId: "",

    previousCatAttempts: "",
    previousCatYear: "",
    previousCatOverallPercentile: "",
    previousCatVarcPercentile: "",
    previousCatDilrPercentile: "",
    previousCatQaPercentile: "",
    targetCollegeIds: [],

    bookIds: [],
    bookSelectAll: false,

    source: "",
    sourceOtherText: "",

    declarationAccepted: false,
    privacyConsentAccepted: false,
    whatsappConsent: false,
  };
}

function resolveBoard(
  name: string,
  other: string
): { board: string; otherText: string } {
  if (name === "State Board" || name === PROFILE_OTHER_VALUE) {
    return { board: name, otherText: other.trim() };
  }
  return { board: name, otherText: "" };
}

export function validateRegistrationStep(
  step: 1 | 2 | 3,
  values: RegistrationFormValues,
  ctx: {
    statuses: { id: number; label: string }[];
    examOptions: { id: number; label: string }[];
    requiresBooks: boolean;
    hasPassportPhoto: boolean;
  }
): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};
  const kind = classifyCurrentStatus(values.currentStatusId, ctx.statuses);
  const age = calculateAge(values.dateOfBirth);
  const under18 = age !== null && age < 18;
  const class12Appearing = values.class12Status === "APPEARING";
  const showLinkedIn = needsHigherEducation(kind);
  // Class 12 Appearing → graduation / PG / work are not mandatory (and hidden in UI).
  const showGrad = needsHigherEducation(kind) && !class12Appearing;
  const showPgWork = needsGradOrWorking(kind) && !class12Appearing;

  if (step === 1) {
    const e = requiredSelect(values.targetVerticalId, "Target Vertical");
    if (e) errors.targetVerticalId = e;
    if (values.targetExamIds.length === 0) {
      errors.targetExamIds = "Select at least one target exam.";
    }
    const ty = requiredSelect(values.targetYear, "Target Year");
    if (ty) errors.targetYear = ty;
    const cs = requiredSelect(values.currentStatusId, "Current Status");
    if (cs) errors.currentStatusId = cs;
    const lang = requiredSelect(
      values.primaryLanguage,
      "Primary Language for Instruction"
    );
    if (lang) errors.primaryLanguage = lang;

    if (!values.dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of Birth is required.";
    } else if (age === null || age < 12 || age > 60) {
      errors.dateOfBirth = "Age must be between 12 and 60.";
    }

    const gender = requiredSelect(values.gender, "Gender");
    if (gender) errors.gender = gender;
    const cat = requiredSelect(values.studentCategoryId, "Category");
    if (cat) errors.studentCategoryId = cat;
    const pwd = requiredSelect(values.isPwd, "Person with Disability (PwD)");
    if (pwd) errors.isPwd = pwd;

    if (!ctx.hasPassportPhoto) {
      errors.passportPhoto = "Passport-size photo is required.";
    }

    if (!LAST_FOUR_PATTERN.test(values.govtIdLast4.trim())) {
      errors.govtIdLast4 = "Enter exactly 4 digits.";
    }

    if (!values.whatsappSameAsMobile) {
      const wa = validateIndianMobile(values.whatsappNumber);
      if (wa) errors.whatsappNumber = wa;
    }

    if (values.alternatePhone.trim()) {
      const alt = validateIndianMobile(values.alternatePhone);
      if (alt) errors.alternatePhone = alt;
      else if (
        values.alternatePhone.replace(/\D/g, "").slice(-10) ===
        values.mobile.replace(/\D/g, "").slice(-10)
      ) {
        errors.alternatePhone = "Must differ from registered mobile.";
      }
    }

    if (values.alternateEmail.trim()) {
      const ae = validateEmail(values.alternateEmail);
      if (ae) errors.alternateEmail = ae;
      else if (
        values.alternateEmail.trim().toLowerCase() ===
        values.registeredEmail.trim().toLowerCase()
      ) {
        errors.alternateEmail = "Must differ from registered email.";
      }
    }

    if (showLinkedIn && values.linkedinUrl.trim()) {
      if (!LINKEDIN_PATTERN.test(values.linkedinUrl.trim())) {
        errors.linkedinUrl =
          "URL must start with https://www.linkedin.com/in/";
      }
    }

    const a1 = requiredText(values.addressLine1, "Address Line 1", 150);
    if (a1) errors.addressLine1 = a1;
    const a2 = optionalMax(values.addressLine2, "Address Line 2", 150);
    if (a2) errors.addressLine2 = a2;
    const city = requiredText(values.city, "City", 60);
    if (city) errors.city = city;
    const state = requiredSelect(values.stateId, "State/UT");
    if (state) errors.stateId = state;
    if (!PIN_PATTERN.test(values.pinCode.trim())) {
      errors.pinCode = "Enter a valid 6-digit PIN code.";
    }

    if (under18) {
      const pn = requiredText(values.parentName, "Parent/Guardian Name", 100);
      if (pn) errors.parentName = pn;
      const pr = requiredSelect(values.parentRelation, "Relation");
      if (pr) errors.parentRelation = pr;
      const pm = validateIndianMobile(values.parentMobile);
      if (pm) errors.parentMobile = pm;
    }
  }

  if (step === 2) {
    const b10 = requiredSelect(values.class10BoardName, "Class 10 Board");
    if (b10) errors.class10BoardName = b10;
    if (
      values.class10BoardName === "State Board" &&
      !values.class10BoardOtherText.trim()
    ) {
      errors.class10BoardOtherText = "Enter State Board name.";
    }
    const s10 = requiredSelect(
      values.class10ScoringScheme,
      "Class 10 Scoring Scheme"
    );
    if (s10) errors.class10ScoringScheme = s10;
    const sc10 = validateScore(
      values.class10Score,
      values.class10ScoringScheme,
      "Class 10 Score",
      true
    );
    if (sc10) errors.class10Score = sc10;
    const y10 = requiredSelect(
      values.class10YearOfPassing,
      "Class 10 Year of Passing"
    );
    if (y10) errors.class10YearOfPassing = y10;

    const c12 = requiredSelect(values.class12Status, "Class 12 Status");
    if (c12) errors.class12Status = c12;
    if (values.class12Status === "PASSED") {
      const b12 = requiredSelect(values.class12BoardName, "Class 12 Board");
      if (b12) errors.class12BoardName = b12;
      if (
        values.class12BoardName === "State Board" &&
        !values.class12BoardOtherText.trim()
      ) {
        errors.class12BoardOtherText = "Enter State Board name.";
      }
      const st12 = requiredSelect(values.class12Stream, "Class 12 Stream");
      if (st12) errors.class12Stream = st12;
      const s12 = requiredSelect(
        values.class12ScoringScheme,
        "Class 12 Scoring Scheme"
      );
      if (s12) errors.class12ScoringScheme = s12;
      const sc12 = validateScore(
        values.class12Score,
        values.class12ScoringScheme,
        "Class 12 Score",
        true
      );
      if (sc12) errors.class12Score = sc12;
      const y12 = requiredSelect(
        values.class12YearOfPassing,
        "Class 12 Year of Passing"
      );
      if (y12) errors.class12YearOfPassing = y12;
    }

    if (showGrad) {
      const gs = requiredSelect(
        values.graduationStream,
        "Graduation Stream"
      );
      if (gs) errors.graduationStream = gs;
      const gd = requiredSelect(
        values.graduationDegree,
        "Graduation Degree"
      );
      if (gd) errors.graduationDegree = gd;
      if (
        values.graduationDegree === PROFILE_OTHER_VALUE &&
        !values.graduationDegreeOtherText.trim()
      ) {
        errors.graduationDegreeOtherText = "Enter your degree.";
      }
      const gspec = optionalMax(
        values.graduationSpecialisation,
        "Specialisation",
        80
      );
      if (gspec) errors.graduationSpecialisation = gspec;
      const gc = requiredText(
        values.graduationCollege,
        "College / University",
        150
      );
      if (gc) errors.graduationCollege = gc;
      const gst = requiredSelect(
        values.graduationStatus,
        "Graduation Status"
      );
      if (gst) errors.graduationStatus = gst;
      const gy = requiredSelect(
        values.graduationYear,
        "Graduation Year"
      );
      if (gy) errors.graduationYear = gy;
      const gsc = requiredSelect(
        values.graduationScoringScheme,
        "Graduation Scoring Scheme"
      );
      if (gsc) errors.graduationScoringScheme = gsc;
      const gscore = validateScore(
        values.graduationScore,
        values.graduationScoringScheme,
        "Graduation Score",
        true
      );
      if (gscore) errors.graduationScore = gscore;
    }

    if (showPgWork) {
      const pg = requiredSelect(
        values.postGraduationStatus,
        "Post Graduation?"
      );
      if (pg) errors.postGraduationStatus = pg;
      if (
        values.postGraduationStatus === "YES" ||
        values.postGraduationStatus === "PURSUING"
      ) {
        const pgd = requiredText(
          values.pgDegreeSpecialization,
          "PG Degree & Specialization",
          100
        );
        if (pgd) errors.pgDegreeSpecialization = pgd;
        const pgc = requiredText(
          values.pgCollege,
          "PG College / University",
          150
        );
        if (pgc) errors.pgCollege = pgc;
      }
      if (values.postGraduationStatus === "YES") {
        const pgs = requiredSelect(
          values.pgScoringScheme,
          "PG Scoring Scheme"
        );
        if (pgs) errors.pgScoringScheme = pgs;
        const pgscore = validateScore(
          values.pgScore,
          values.pgScoringScheme,
          "PG Score",
          true
        );
        if (pgscore) errors.pgScore = pgscore;
      }

      const we = requiredSelect(
        values.hasWorkExperience,
        "Full-time Work Experience?"
      );
      if (we) errors.hasWorkExperience = we;
      if (values.hasWorkExperience === "true") {
        const months = values.workExperienceMonths.trim();
        if (!months) {
          errors.workExperienceMonths = "Total Experience is required.";
        } else {
          const n = Number(months);
          if (!Number.isFinite(n) || n < 0 || n > 480) {
            errors.workExperienceMonths =
              "Enter months between 0 and 480.";
          }
        }
        const org = requiredText(
          values.workOrganization,
          "Current / Last Organization",
          100
        );
        if (org) errors.workOrganization = org;
        const des = requiredText(
          values.workDesignation,
          "Designation / Role",
          80
        );
        if (des) errors.workDesignation = des;
        const ind = requiredSelect(values.industryId, "Industry");
        if (ind) errors.industryId = ind;
      }
    }
  }

  if (step === 3) {
    const selectedExamLabels = values.targetExamIds
      .map((id) => {
        const match = ctx.examOptions.find((e) => String(e.id) === id);
        return match?.label || "";
      })
      .join(" ")
      .toLowerCase();
    const includesCat = /\bcat\b/.test(selectedExamLabels);

    if (includesCat) {
      const att = requiredSelect(
        values.previousCatAttempts,
        "Previous CAT Attempts"
      );
      if (att) errors.previousCatAttempts = att;
      const attemptsNum =
        values.previousCatAttempts === "3+"
          ? 3
          : Number(values.previousCatAttempts);
      if (Number.isFinite(attemptsNum) && attemptsNum >= 1) {
        const cy = requiredSelect(
          values.previousCatYear,
          "Previous CAT Year"
        );
        if (cy) errors.previousCatYear = cy;
        const overall = validatePercentile(
          values.previousCatOverallPercentile,
          "Previous CAT Overall Percentile",
          true
        );
        if (overall) errors.previousCatOverallPercentile = overall;
        const varc = validatePercentile(
          values.previousCatVarcPercentile,
          "VARC Percentile",
          false
        );
        if (varc) errors.previousCatVarcPercentile = varc;
        const dilr = validatePercentile(
          values.previousCatDilrPercentile,
          "DILR Percentile",
          false
        );
        if (dilr) errors.previousCatDilrPercentile = dilr;
        const qa = validatePercentile(
          values.previousCatQaPercentile,
          "QA Percentile",
          false
        );
        if (qa) errors.previousCatQaPercentile = qa;
      }
    }

    if (ctx.requiresBooks) {
      if (!values.bookSelectAll && values.bookIds.length === 0) {
        errors.bookIds = "Select books to be delivered.";
      }
    }

    const source = requiredSelect(values.source, "How did you hear about Rodha?");
    if (source) errors.source = source;
    if (
      values.source === PROFILE_OTHER_VALUE &&
      !values.sourceOtherText.trim()
    ) {
      errors.sourceOtherText = "Please specify.";
    }

    if (!values.declarationAccepted) {
      errors.declarationAccepted = "Declaration is required.";
    }
    if (!values.privacyConsentAccepted) {
      errors.privacyConsentAccepted = "Privacy consent is required.";
    }
  }

  return errors;
}

function appendIf(
  form: FormData,
  key: string,
  value: string | number | boolean | null | undefined
) {
  if (value === null || value === undefined) return;
  if (typeof value === "string" && value === "") return;
  form.append(key, String(value));
}

export function buildRegistrationFormData(
  values: RegistrationFormValues,
  passportFile: File | null,
  ctx: {
    statuses: { id: number; label: string }[];
    examOptions: { id: number; label: string }[];
    requiresBooks: boolean;
  }
): FormData {
  const form = new FormData();
  const kind = classifyCurrentStatus(values.currentStatusId, ctx.statuses);
  const age = calculateAge(values.dateOfBirth);
  const under18 = age !== null && age < 18;
  const class12Appearing = values.class12Status === "APPEARING";
  const showGrad = needsHigherEducation(kind) && !class12Appearing;
  const showPgWork = needsGradOrWorking(kind) && !class12Appearing;

  if (passportFile) {
    form.append("passportPhoto", passportFile, passportFile.name);
  }

  appendIf(form, "targetVerticalId", values.targetVerticalId);
  form.append(
    "targetExamIds",
    JSON.stringify(values.targetExamIds.map((id) => Number(id)))
  );
  appendIf(form, "targetYear", values.targetYear);
  appendIf(form, "currentStatusId", values.currentStatusId);
  appendIf(form, "studentCategoryId", values.studentCategoryId);
  appendIf(form, "primaryLanguage", values.primaryLanguage);
  appendIf(form, "dateOfBirth", values.dateOfBirth);
  appendIf(form, "gender", values.gender);
  appendIf(form, "isPwd", values.isPwd);
  appendIf(form, "govtIdLast4", values.govtIdLast4.trim());

  form.append(
    "whatsappSameAsMobile",
    values.whatsappSameAsMobile ? "true" : "false"
  );
  if (!values.whatsappSameAsMobile) {
    appendIf(form, "whatsappNumber", values.whatsappNumber.trim());
  }
  appendIf(form, "alternatePhone", values.alternatePhone.trim());
  appendIf(form, "alternateEmail", values.alternateEmail.trim());
  if (needsHigherEducation(kind)) {
    appendIf(form, "linkedinUrl", values.linkedinUrl.trim());
  }

  appendIf(form, "addressLine1", values.addressLine1.trim());
  appendIf(form, "addressLine2", values.addressLine2.trim());
  appendIf(form, "city", values.city.trim());
  appendIf(form, "stateId", values.stateId);
  appendIf(form, "pinCode", values.pinCode.trim());

  if (under18) {
    appendIf(form, "parentName", values.parentName.trim());
    appendIf(form, "parentRelation", values.parentRelation);
    appendIf(form, "parentMobile", values.parentMobile.trim());
  }

  const c10 = resolveBoard(
    values.class10BoardName,
    values.class10BoardOtherText
  );
  appendIf(form, "class10BoardName", c10.board);
  appendIf(form, "class10BoardOtherText", c10.otherText || null);
  appendIf(form, "class10ScoringScheme", values.class10ScoringScheme);
  appendIf(form, "class10Score", values.class10Score.trim());
  appendIf(form, "class10YearOfPassing", values.class10YearOfPassing);

  appendIf(form, "class12Status", values.class12Status);
  if (values.class12Status === "PASSED") {
    const c12 = resolveBoard(
      values.class12BoardName,
      values.class12BoardOtherText
    );
    appendIf(form, "class12BoardName", c12.board);
    appendIf(form, "class12BoardOtherText", c12.otherText || null);
    appendIf(form, "class12Stream", values.class12Stream);
    appendIf(form, "class12ScoringScheme", values.class12ScoringScheme);
    appendIf(form, "class12Score", values.class12Score.trim());
    appendIf(form, "class12YearOfPassing", values.class12YearOfPassing);
  }

  if (showGrad) {
    appendIf(form, "graduationStream", values.graduationStream);
    appendIf(form, "graduationDegree", values.graduationDegree);
    appendIf(
      form,
      "graduationDegreeOtherText",
      values.graduationDegree === PROFILE_OTHER_VALUE
        ? values.graduationDegreeOtherText.trim()
        : null
    );
    appendIf(
      form,
      "graduationSpecialisation",
      values.graduationSpecialisation.trim()
    );
    appendIf(form, "graduationCollege", values.graduationCollege.trim());
    appendIf(form, "graduationStatus", values.graduationStatus);
    appendIf(form, "graduationYear", values.graduationYear);
    appendIf(form, "graduationScoringScheme", values.graduationScoringScheme);
    appendIf(form, "graduationScore", values.graduationScore.trim());
  }

  if (showPgWork) {
    appendIf(form, "postGraduationStatus", values.postGraduationStatus);
    if (
      values.postGraduationStatus === "YES" ||
      values.postGraduationStatus === "PURSUING"
    ) {
      appendIf(form, "pgStream", values.pgStream || null);
      appendIf(
        form,
        "pgDegreeSpecialization",
        values.pgDegreeSpecialization.trim()
      );
      appendIf(form, "pgCollege", values.pgCollege.trim());
    }
    if (values.postGraduationStatus === "YES") {
      appendIf(form, "pgScoringScheme", values.pgScoringScheme);
      appendIf(form, "pgScore", values.pgScore.trim());
    }

    form.append("hasWorkExperience", values.hasWorkExperience);
    if (values.hasWorkExperience === "true") {
      appendIf(form, "workExperienceMonths", values.workExperienceMonths);
      appendIf(form, "workOrganization", values.workOrganization.trim());
      appendIf(form, "workDesignation", values.workDesignation.trim());
      appendIf(form, "industryId", values.industryId);
    }
  }

  const selectedExamLabels = values.targetExamIds
    .map((id) => {
      const match = ctx.examOptions.find((e) => String(e.id) === id);
      return match?.label || "";
    })
    .join(" ")
    .toLowerCase();
  if (/\bcat\b/.test(selectedExamLabels)) {
    const attempts =
      values.previousCatAttempts === "3+"
        ? "3"
        : values.previousCatAttempts;
    appendIf(form, "previousCatAttempts", attempts);
    const attemptsNum = Number(attempts);
    if (Number.isFinite(attemptsNum) && attemptsNum >= 1) {
      appendIf(form, "previousCatYear", values.previousCatYear);
      appendIf(
        form,
        "previousCatOverallPercentile",
        values.previousCatOverallPercentile.trim()
      );
      appendIf(
        form,
        "previousCatVarcPercentile",
        values.previousCatVarcPercentile.trim() || null
      );
      appendIf(
        form,
        "previousCatDilrPercentile",
        values.previousCatDilrPercentile.trim() || null
      );
      appendIf(
        form,
        "previousCatQaPercentile",
        values.previousCatQaPercentile.trim() || null
      );
    }
  }

  form.append(
    "targetCollegeIds",
    JSON.stringify(values.targetCollegeIds.map((id) => Number(id)))
  );

  if (ctx.requiresBooks) {
    form.append(
      "bookSelectAll",
      values.bookSelectAll ? "true" : "false"
    );
    form.append(
      "bookIds",
      JSON.stringify(
        values.bookSelectAll
          ? []
          : values.bookIds.map((id) => Number(id))
      )
    );
  }

  appendIf(form, "source", values.source);
  if (values.source === PROFILE_OTHER_VALUE) {
    appendIf(form, "sourceOtherText", values.sourceOtherText.trim());
  }

  form.append(
    "declarationAccepted",
    values.declarationAccepted ? "true" : "false"
  );
  form.append(
    "privacyConsentAccepted",
    values.privacyConsentAccepted ? "true" : "false"
  );
  form.append(
    "whatsappConsent",
    values.whatsappConsent ? "true" : "false"
  );

  return form;
}
