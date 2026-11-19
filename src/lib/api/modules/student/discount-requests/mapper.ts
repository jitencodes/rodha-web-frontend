import type {
  DiscountCertificateIssuer,
  DiscountConfigApi,
  DiscountConfigViewModel,
  DiscountCurrentViewModel,
  DiscountExamScoreType,
  DiscountRequestApi,
  DiscountRequestCurrentApi,
  DiscountRequestStatus,
} from "./types";

const DEFAULT_MAX_FILE_BYTES = 5 * 1024 * 1024;
const DEFAULT_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const DEFAULT_REVIEW_SLA = "We'll review your request within 24 hours.";
const ISSUERS: DiscountCertificateIssuer[] = ["CENTRAL", "STATE", "OTHER"];

export function mapDiscountConfig(
  data: DiscountConfigApi | null | undefined
): DiscountConfigViewModel {
  const issuers = (data?.certificateIssuers ?? [])
    .map((value) => String(value).toUpperCase())
    .filter((value): value is DiscountCertificateIssuer =>
      ISSUERS.includes(value as DiscountCertificateIssuer)
    );

  return {
    discountTypes: (data?.discountTypes ?? []).map((type) => ({
      code: type.code,
      name: type.name || type.code,
      helpText: type.helpText?.trim() || "",
    })),
    colleges: (data?.colleges ?? []).map((college) => ({
      id: String(college.id),
      name: college.name,
      city: college.city?.trim() || "",
      stateId: college.state?.id != null ? String(college.state.id) : "",
    })),
    class10Boards: (data?.class10Boards ?? []).map((board) => ({
      id: String(board.id),
      name: board.name,
      needsStateBoardName: Boolean(board.needsStateBoardName),
    })),
    class12Boards: (data?.class12Boards ?? []).map((board) => ({
      id: String(board.id),
      name: board.name,
      needsStateBoardName: Boolean(board.needsStateBoardName),
    })),
    verticals: (data?.verticals ?? [])
      .filter((vertical) => vertical?.id != null && Boolean(vertical.name?.trim()))
      .map((vertical) => ({
        id: String(vertical.id),
        name: vertical.name.trim(),
      })),
    exams: (data?.exams ?? [])
      .filter(
        (exam) =>
          exam?.id != null &&
          exam.websiteCategoryId != null &&
          Boolean(exam.name?.trim())
      )
      .map((exam) => ({
        id: String(exam.id),
        verticalId: String(exam.websiteCategoryId),
        name: exam.name.trim(),
        scoreType: exam.scoreType,
        maxMarks: typeof exam.maxMarks === "number" ? exam.maxMarks : null,
        years: (exam.years ?? [])
          .map((year) =>
            typeof year === "number" ? year : Number.parseInt(String(year), 10)
          )
          .filter((year) => Number.isFinite(year) && year > 0)
          .sort((a, b) => b - a),
        stages: (exam.stages ?? [])
          .filter((stage) => stage?.id != null && Boolean(stage.name?.trim()))
          .map((stage) => ({
            id: String(stage.id),
            name: stage.name.trim(),
          })),
      })),
    states: (data?.states ?? []).map((state) => ({
      id: String(state.id),
      name: state.name,
    })),
    // OTHER is always offered on the form (free-text authority).
    certificateIssuers: issuers.length
      ? Array.from(new Set([...issuers, "OTHER" as const]))
      : ISSUERS,
    allowedFileTypes: data?.upload?.allowedTypes?.length
      ? data.upload.allowedTypes
      : DEFAULT_ALLOWED_TYPES,
    maxFileBytes:
      data?.upload?.maxSizeBytes && data.upload.maxSizeBytes > 0
        ? data.upload.maxSizeBytes
        : DEFAULT_MAX_FILE_BYTES,
    reviewSlaText: data?.reviewSlaText?.trim() || DEFAULT_REVIEW_SLA,
    validityDays:
      typeof data?.validityDays === "number" ? data.validityDays : null,
  };
}

export function mapDiscountCurrent(
  data: DiscountRequestCurrentApi | null | undefined
): DiscountCurrentViewModel {
  return {
    canRequest: Boolean(data?.canRequest),
    canResubmit: Boolean(data?.canResubmit),
    request: data?.request ?? null,
  };
}

/* ---------- Display helpers (shared by CTA, dashboard list, drawer) ---------- */

export const DISCOUNT_STATUS_LABEL: Record<DiscountRequestStatus, string> = {
  PENDING: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  USED: "Used",
  EXPIRED: "Expired",
  REVOKED: "Cancelled",
};

export const DISCOUNT_SCORE_TYPE_LABEL: Record<DiscountExamScoreType, string> = {
  PERCENTILE: "Percentile",
  RANK: "Rank",
  MARKS: "Marks",
  QUALIFIED_STAGE: "Qualified stage",
};

export const DISCOUNT_ISSUER_LABEL: Record<DiscountCertificateIssuer, string> = {
  CENTRAL: "Central Government",
  STATE: "State Government",
  OTHER: "Other",
};

/** `promocode.label` ("10%" / "₹500"), else built from type + value. */
export function discountPromocodeLabel(request: DiscountRequestApi): string {
  const promo = request.promocode;
  if (!promo) return "";
  if (promo.label?.trim()) return promo.label.trim();
  const value = promo.discountValue ?? 0;
  if (promo.discountType === "FLAT") {
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return `${value}%`;
}

/** `validTill` is an inclusive IST date — the code works until end of that day. */
export function discountValidTillEnd(validTill: string): string {
  return `${validTill}T23:59:59+05:30`;
}

export function formatDiscountDate(value: string | null | undefined): string {
  if (!value) return "";
  // Date-only strings are IST calendar dates; pin them so the day never shifts.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00+05:30` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/** One-line status message for the student (B1 status table). */
export function discountStatusMessage(
  request: DiscountRequestApi,
  reviewSlaText?: string
): string {
  switch (request.status) {
    case "PENDING":
      return `Under review — ${reviewSlaText || DEFAULT_REVIEW_SLA}`;
    case "APPROVED": {
      const label = discountPromocodeLabel(request);
      const till = formatDiscountDate(request.validTill);
      return `Approved${label ? `: ${label} off` : ""}${till ? ` — valid till ${till}` : ""}`;
    }
    case "REJECTED":
      return request.rejectReason
        ? `Rejected: ${request.rejectReason}`
        : "Rejected";
    case "USED":
      return request.usedOrderId
        ? `Used on order #${request.usedOrderId}`
        : "Discount used";
    case "EXPIRED":
      return "Expired";
    case "REVOKED":
      return request.revokeReason
        ? `Cancelled: ${request.revokeReason}`
        : "Cancelled";
    default:
      return "";
  }
}
