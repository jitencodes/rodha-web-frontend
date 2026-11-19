import type {
  DiscountCertificateIssuer,
  DiscountConfigViewModel,
  DiscountRequestApi,
  DiscountScoreFormat,
  DiscountTypeCode,
} from "@/lib/api/modules/student/discount-requests/types";

/** Multipart file fields, per discount type (API field names). */
export const DISCOUNT_FILE_FIELDS = {
  COLLEGE: ["collegeIdCard", "bonafideCertificate"],
  ACADEMIC: ["class10Marksheet", "class12Marksheet"],
  EWS: ["ewsCertificate"],
  PREV_ATTEMPT: ["examScorecard"],
} as const satisfies Record<DiscountTypeCode, readonly string[]>;

export type DiscountFileField =
  (typeof DISCOUNT_FILE_FIELDS)[DiscountTypeCode][number];

/** `files[].kind` on a saved request → its upload field. */
const FILE_KIND_TO_FIELD: Record<string, DiscountFileField> = {
  COLLEGE_ID_CARD: "collegeIdCard",
  BONAFIDE_CERTIFICATE: "bonafideCertificate",
  CLASS10_MARKSHEET: "class10Marksheet",
  CLASS12_MARKSHEET: "class12Marksheet",
  EWS_CERTIFICATE: "ewsCertificate",
  EXAM_SCORECARD: "examScorecard",
};

export const DISCOUNT_FILE_LABEL: Record<DiscountFileField, string> = {
  collegeIdCard: "College ID card",
  bonafideCertificate: "Bonafide certificate / fee receipt",
  class10Marksheet: "Class 10 marksheet",
  class12Marksheet: "Class 12 marksheet",
  ewsCertificate: "Income / EWS certificate",
  examScorecard: "Scorecard / result",
};

export type DiscountSchoolValues = {
  boardId: string;
  stateBoardName: string;
  school: string;
  scoreFormat: DiscountScoreFormat | "";
  score: string;
  yearOfPassing: string;
};

export type DiscountFormValues = {
  discountType: DiscountTypeCode | "";
  collegeId: string;
  collegeCity: string;
  collegeStateId: string;
  class10: DiscountSchoolValues;
  class12: DiscountSchoolValues;
  /** Digits only; shown with Indian grouping. */
  annualFamilyIncome: string;
  certificateIssuedBy: DiscountCertificateIssuer | "";
  certificateIssuingAuthority: string;
  certificateIssueDate: string;
  /** Filters exams only — not sent. */
  prevVerticalId: string;
  prevExamId: string;
  prevExamYear: string;
  prevScore: string;
  prevStageId: string;
  declarationAccepted: boolean;
  files: Partial<Record<DiscountFileField, File | null>>;
};

/** Field name → first error message (API field names, `class10.score` style for schools). */
export type DiscountFormErrors = Partial<Record<string, string>>;

export const ACADEMIC_MIN_YEAR = 1990;

const STATE_BOARD_MAX = 100;
const SCHOOL_MAX = 150;
const CITY_MAX = 100;
const AUTHORITY_MAX = 150;

function emptySchool(): DiscountSchoolValues {
  return {
    boardId: "",
    stateBoardName: "",
    school: "",
    scoreFormat: "",
    score: "",
    yearOfPassing: "",
  };
}

function str(value: number | string | null | undefined): string {
  return value == null ? "" : String(value);
}

function schoolFrom(
  school: DiscountRequestApi["class10"]
): DiscountSchoolValues {
  if (!school) return emptySchool();
  return {
    boardId: str(school.board?.id),
    stateBoardName: school.stateBoardName ?? "",
    school: school.school ?? "",
    scoreFormat: school.scoreFormat ?? "",
    score: str(school.score),
    yearOfPassing: str(school.yearOfPassing),
  };
}

/**
 * Vertical dropdown for PREV_ATTEMPT. Uses config.verticals when present;
 * otherwise derives unique vertical ids from exams so the filter is never empty
 * when exams exist.
 */
export function discountVerticalOptions(
  config: DiscountConfigViewModel
): Array<{ id: string; name: string }> {
  if (config.verticals.length > 0) return config.verticals;

  const byId = new Map<string, string>();
  for (const exam of config.exams) {
    if (!exam.verticalId || byId.has(exam.verticalId)) continue;
    byId.set(exam.verticalId, `Vertical ${exam.verticalId}`);
  }
  return Array.from(byId.entries()).map(([id, name]) => ({ id, name }));
}

/** Empty form, or pre-filled from a rejected request (resubmit). */
export function createDiscountFormValues(
  config: DiscountConfigViewModel,
  options: { request?: DiscountRequestApi | null; defaultVerticalId?: string }
): DiscountFormValues {
  const request = options.request ?? null;
  const activeTypes = config.discountTypes.map((type) => type.code);
  const requestType =
    request && activeTypes.includes(request.discountType)
      ? request.discountType
      : "";
  const verticals = discountVerticalOptions(config);
  const examVertical = request?.prevAttempt?.exam?.websiteCategoryId;
  const examVerticalId =
    examVertical != null ? String(examVertical) : "";
  const defaultVertical =
    options.defaultVerticalId &&
    verticals.some((vertical) => vertical.id === options.defaultVerticalId)
      ? options.defaultVerticalId
      : verticals.some((vertical) => vertical.id === examVerticalId)
        ? examVerticalId
        : verticals[0]?.id ?? "";

  return {
    discountType: requestType || (activeTypes.length === 1 ? activeTypes[0] : ""),
    collegeId: str(request?.college?.id),
    collegeCity: request?.collegeCity ?? "",
    collegeStateId: str(request?.collegeState?.id),
    class10: schoolFrom(request?.class10),
    class12: schoolFrom(request?.class12),
    annualFamilyIncome: str(request?.ews?.annualFamilyIncome),
    certificateIssuedBy: request?.ews?.certificateIssuedBy ?? "",
    certificateIssuingAuthority: request?.ews?.certificateIssuingAuthority ?? "",
    certificateIssueDate: request?.ews?.certificateIssueDate ?? "",
    prevVerticalId: examVerticalId && verticals.some((v) => v.id === examVerticalId)
      ? examVerticalId
      : defaultVertical,
    prevExamId: str(request?.prevAttempt?.exam?.id),
    prevExamYear: str(request?.prevAttempt?.year),
    prevScore: str(request?.prevAttempt?.score),
    prevStageId: str(request?.prevAttempt?.stage?.id),
    declarationAccepted: false,
    files: {},
  };
}

/** Proofs on the rejected request that the API will carry over when not re-uploaded. */
export function carriedOverFiles(
  request: DiscountRequestApi | null | undefined
): Partial<Record<DiscountFileField, string>> {
  if (!request || request.proofsPurgedAt) return {};
  const out: Partial<Record<DiscountFileField, string>> = {};
  for (const file of request.files ?? []) {
    const field = file.kind ? FILE_KIND_TO_FIELD[file.kind] : undefined;
    if (field) out[field] = file.originalName || file.label || "Uploaded file";
  }
  return out;
}

/* ---------- Validation (mirrors backend rules) ---------- */

export function todayIst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function currentYearIst(): number {
  return Number.parseInt(todayIst().slice(0, 4), 10);
}

const DECIMAL_2 = /^\d+(\.\d{1,2})?$/;
const WHOLE = /^\d+$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatIndianNumber(digits: string): string {
  const clean = digitsOnly(digits);
  if (!clean) return "";
  return Number(clean).toLocaleString("en-IN");
}

/** Proof file check: allowed types + size from config (backend re-checks content). */
export function validateDiscountProof(
  file: File,
  config: Pick<DiscountConfigViewModel, "allowedFileTypes" | "maxFileBytes">
): string | null {
  const allowed = new Set(config.allowedFileTypes.map((type) => type.toLowerCase()));
  // PNG is documented as allowed even if a config example omits it.
  allowed.add("image/png");
  const type = file.type.toLowerCase();
  const extensionOk = /\.(pdf|jpe?g|png)$/i.test(file.name);
  const typeOk = type ? allowed.has(type) || (type === "image/jpg" && allowed.has("image/jpeg")) : extensionOk;
  if (!typeOk || !extensionOk) return "Only PDF, JPG or PNG files are allowed.";
  if (file.size <= 0) return "The selected file is empty. Please choose another file.";
  if (file.size > config.maxFileBytes) {
    const max = Math.round(config.maxFileBytes / (1024 * 1024));
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `File is ${mb} MB. Maximum allowed size is ${max} MB.`;
  }
  return null;
}

function validateSchool(
  prefix: "class10" | "class12",
  school: DiscountSchoolValues,
  boards: DiscountConfigViewModel["class10Boards"],
  errors: DiscountFormErrors
) {
  const board = boards.find((entry) => entry.id === school.boardId);
  if (!board) errors[`${prefix}BoardId`] = "Select your board.";
  if (board?.needsStateBoardName) {
    const name = school.stateBoardName.trim();
    if (!name) errors[`${prefix}StateBoardName`] = "Enter the state board name.";
    else if (name.length > STATE_BOARD_MAX)
      errors[`${prefix}StateBoardName`] = `Keep it within ${STATE_BOARD_MAX} characters.`;
  }
  const schoolName = school.school.trim();
  if (!schoolName) errors[`${prefix}School`] = "Enter your school name.";
  else if (schoolName.length > SCHOOL_MAX)
    errors[`${prefix}School`] = `Keep it within ${SCHOOL_MAX} characters.`;
  if (!school.scoreFormat) errors[`${prefix}ScoreFormat`] = "Choose percentage or CGPA.";

  const score = school.score.trim();
  if (!score) {
    errors[`${prefix}Score`] = "Enter your score.";
  } else if (!DECIMAL_2.test(score)) {
    errors[`${prefix}Score`] = "Use a number with up to 2 decimals.";
  } else if (school.scoreFormat) {
    const value = Number(score);
    const max = school.scoreFormat === "CGPA" ? 10 : 100;
    if (value < 0 || value > max) {
      errors[`${prefix}Score`] =
        school.scoreFormat === "CGPA"
          ? "CGPA must be between 0 and 10."
          : "Percentage must be between 0 and 100.";
    }
  }

  const year = Number.parseInt(school.yearOfPassing, 10);
  if (!Number.isFinite(year)) {
    errors[`${prefix}YearOfPassing`] = "Select the year of passing.";
  } else if (year < ACADEMIC_MIN_YEAR || year > currentYearIst()) {
    errors[`${prefix}YearOfPassing`] = `Year must be between ${ACADEMIC_MIN_YEAR} and ${currentYearIst()}.`;
  }
}

export function validateDiscountForm(
  values: DiscountFormValues,
  config: DiscountConfigViewModel,
  carried: Partial<Record<DiscountFileField, string>> = {}
): DiscountFormErrors {
  const errors: DiscountFormErrors = {};
  const type = values.discountType;
  if (!type) {
    errors.discountType = "Select a discount type.";
    return errors;
  }

  if (type === "COLLEGE") {
    if (!config.colleges.some((college) => college.id === values.collegeId)) {
      errors.collegeId = "Select your college.";
    }
    const city = values.collegeCity.trim();
    if (!city) errors.collegeCity = "Enter the college city.";
    else if (city.length > CITY_MAX) errors.collegeCity = `Keep it within ${CITY_MAX} characters.`;
    if (!values.collegeStateId) errors.collegeStateId = "Select the college state.";
  }

  if (type === "ACADEMIC") {
    validateSchool("class10", values.class10, config.class10Boards, errors);
    validateSchool("class12", values.class12, config.class12Boards, errors);
    const y10 = Number.parseInt(values.class10.yearOfPassing, 10);
    const y12 = Number.parseInt(values.class12.yearOfPassing, 10);
    if (
      Number.isFinite(y10) &&
      Number.isFinite(y12) &&
      !errors.class12YearOfPassing &&
      y12 <= y10
    ) {
      errors.class12YearOfPassing = "Class 12 year must be later than class 10.";
    }
  }

  if (type === "EWS") {
    const income = digitsOnly(values.annualFamilyIncome);
    if (!income || !WHOLE.test(income)) {
      errors.annualFamilyIncome = "Enter your annual family income in rupees.";
    }
    if (!values.certificateIssuedBy) {
      errors.certificateIssuedBy = "Choose who issued the certificate.";
    }
    if (values.certificateIssuedBy === "OTHER") {
      const authority = values.certificateIssuingAuthority.trim();
      if (!authority) errors.certificateIssuingAuthority = "Enter the issuing authority.";
      else if (authority.length > AUTHORITY_MAX)
        errors.certificateIssuingAuthority = `Keep it within ${AUTHORITY_MAX} characters.`;
    }
    if (!values.certificateIssueDate) {
      errors.certificateIssueDate = "Select the issue date.";
    } else if (values.certificateIssueDate > todayIst()) {
      errors.certificateIssueDate = "Issue date cannot be in the future.";
    }
  }

  if (type === "PREV_ATTEMPT") {
    const exam = config.exams.find((entry) => entry.id === values.prevExamId);
    if (!exam) {
      errors.prevExamId = "Select the exam.";
    } else {
      if (!exam.years.includes(Number.parseInt(values.prevExamYear, 10))) {
        errors.prevExamYear = "Select the exam year.";
      }
      if (exam.scoreType === "QUALIFIED_STAGE") {
        if (!exam.stages.some((stage) => stage.id === values.prevStageId)) {
          errors.prevStageId = "Select the stage you qualified.";
        }
      } else {
        const raw = values.prevScore.trim();
        const value = Number(raw);
        if (!raw) {
          errors.prevScore = "Enter your score.";
        } else if (exam.scoreType === "RANK") {
          if (!WHOLE.test(raw) || value < 1) errors.prevScore = "Rank must be a whole number of 1 or more.";
        } else if (!DECIMAL_2.test(raw)) {
          errors.prevScore = "Use a number with up to 2 decimals.";
        } else if (exam.scoreType === "PERCENTILE" && value > 100) {
          errors.prevScore = "Percentile must be between 0 and 100.";
        } else if (
          exam.scoreType === "MARKS" &&
          exam.maxMarks != null &&
          value > exam.maxMarks
        ) {
          errors.prevScore = `Marks must be between 0 and ${exam.maxMarks}.`;
        }
      }
    }
  }

  for (const field of DISCOUNT_FILE_FIELDS[type]) {
    if (!values.files[field] && !carried[field]) {
      errors[field] = `${DISCOUNT_FILE_LABEL[field]} is required.`;
    }
  }

  if (!values.declarationAccepted) {
    errors.declarationAccepted = "Please confirm the declaration.";
  }

  return errors;
}

/* ---------- Multipart body ---------- */

function appendSchool(
  form: FormData,
  prefix: "class10" | "class12",
  school: DiscountSchoolValues,
  boards: DiscountConfigViewModel["class10Boards"]
) {
  const board = boards.find((entry) => entry.id === school.boardId);
  form.append(`${prefix}BoardId`, school.boardId);
  if (board?.needsStateBoardName) {
    form.append(`${prefix}StateBoardName`, school.stateBoardName.trim());
  }
  form.append(`${prefix}School`, school.school.trim());
  form.append(`${prefix}ScoreFormat`, school.scoreFormat);
  form.append(`${prefix}Score`, school.score.trim());
  form.append(`${prefix}YearOfPassing`, school.yearOfPassing);
}

/** Every field is sent as a string; only the chosen type's section is included. */
export function buildDiscountFormData(
  values: DiscountFormValues,
  packageId: number,
  config: DiscountConfigViewModel
): FormData {
  const form = new FormData();
  const type = values.discountType as DiscountTypeCode;
  form.append("packageId", String(packageId));
  form.append("discountType", type);
  form.append("declarationAccepted", values.declarationAccepted ? "true" : "false");

  if (type === "COLLEGE") {
    form.append("collegeId", values.collegeId);
    form.append("collegeCity", values.collegeCity.trim());
    form.append("collegeStateId", values.collegeStateId);
  }
  if (type === "ACADEMIC") {
    appendSchool(form, "class10", values.class10, config.class10Boards);
    appendSchool(form, "class12", values.class12, config.class12Boards);
  }
  if (type === "EWS") {
    form.append("annualFamilyIncome", digitsOnly(values.annualFamilyIncome));
    form.append("certificateIssuedBy", values.certificateIssuedBy);
    if (values.certificateIssuedBy === "OTHER") {
      form.append("certificateIssuingAuthority", values.certificateIssuingAuthority.trim());
    }
    form.append("certificateIssueDate", values.certificateIssueDate);
  }
  if (type === "PREV_ATTEMPT") {
    const exam = config.exams.find((entry) => entry.id === values.prevExamId);
    form.append("prevExamId", values.prevExamId);
    form.append("prevExamYear", values.prevExamYear);
    if (exam?.scoreType === "QUALIFIED_STAGE") {
      form.append("prevStageId", values.prevStageId);
    } else {
      form.append("prevScore", values.prevScore.trim());
    }
  }

  for (const field of DISCOUNT_FILE_FIELDS[type]) {
    const file = values.files[field];
    if (file) form.append(field, file, file.name);
  }

  return form;
}
