/** Student "Request Additional Discount" — shapes from Rodha_Discount_Requests_FE Postman. */

export type DiscountTypeCode = "COLLEGE" | "ACADEMIC" | "EWS" | "PREV_ATTEMPT";

export type DiscountRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "USED"
  | "EXPIRED"
  | "REVOKED";

export type DiscountScoreFormat = "PERCENTAGE" | "CGPA";

export type DiscountExamScoreType =
  | "PERCENTILE"
  | "RANK"
  | "MARKS"
  | "QUALIFIED_STAGE";

export type DiscountCertificateIssuer = "CENTRAL" | "STATE" | "OTHER";

export interface DiscountNamedRefApi {
  id: number;
  name: string;
}

/* ---------- GET /student/discount-requests/config ---------- */

export interface DiscountConfigTypeApi {
  code: DiscountTypeCode;
  name: string;
  helpText?: string | null;
}

export interface DiscountConfigCollegeApi {
  id: number;
  name: string;
  city?: string | null;
  state?: DiscountNamedRefApi | null;
}

export interface DiscountConfigBoardApi {
  id: number;
  name: string;
  needsStateBoardName?: boolean;
}

export interface DiscountConfigExamApi {
  id: number;
  websiteCategoryId: number;
  name: string;
  scoreType: DiscountExamScoreType;
  maxMarks?: number | null;
  years?: number[];
  stages?: DiscountNamedRefApi[];
}

export interface DiscountConfigApi {
  discountTypes?: DiscountConfigTypeApi[];
  colleges?: DiscountConfigCollegeApi[];
  class10Boards?: DiscountConfigBoardApi[];
  class12Boards?: DiscountConfigBoardApi[];
  verticals?: DiscountNamedRefApi[];
  exams?: DiscountConfigExamApi[];
  states?: DiscountNamedRefApi[];
  certificateIssuers?: string[];
  upload?: { allowedTypes?: string[]; maxSizeBytes?: number };
  reviewSlaText?: string | null;
  validityDays?: number | null;
}

/* ---------- Request record (list / detail / submit / current) ---------- */

export interface DiscountRequestFileApi {
  id: number;
  kind?: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  originalName?: string | null;
  createdAt?: string | null;
  label?: string | null;
}

export interface DiscountRequestPromocodeApi {
  id: number;
  code?: string | null;
  discountType?: "PERCENT" | "FLAT" | string;
  discountValue?: number | null;
  maxDiscountValue?: number | null;
  label?: string | null;
  finalPercent?: number | null;
}

export interface DiscountRequestSchoolApi {
  board?: DiscountNamedRefApi | null;
  stateBoardName?: string | null;
  school?: string | null;
  scoreFormat?: DiscountScoreFormat | null;
  score?: number | null;
  yearOfPassing?: number | null;
}

export interface DiscountRequestApi {
  id: number;
  status: DiscountRequestStatus;
  discountType: DiscountTypeCode;
  discountTypeName?: string | null;
  item?: {
    id: number;
    websiteCategoryId?: number | null;
    slug?: string | null;
    title?: string | null;
    salePrice?: number | null;
  } | null;
  packageId: number;
  previousRequestId?: number | null;
  suggestedPercent?: number | null;
  college?: DiscountNamedRefApi | null;
  collegeCity?: string | null;
  collegeState?: DiscountNamedRefApi | null;
  class10?: DiscountRequestSchoolApi | null;
  class12?: DiscountRequestSchoolApi | null;
  ews?: {
    annualFamilyIncome?: number | null;
    certificateIssuedBy?: DiscountCertificateIssuer | null;
    certificateIssuingAuthority?: string | null;
    certificateIssueDate?: string | null;
  } | null;
  prevAttempt?: {
    exam?: { id: number; name: string; websiteCategoryId?: number | null } | null;
    year?: number | null;
    scoreType?: DiscountExamScoreType | null;
    score?: number | null;
    stage?: DiscountNamedRefApi | null;
  } | null;
  promocode?: DiscountRequestPromocodeApi | null;
  validTill?: string | null;
  usedOrderId?: number | null;
  rejectReason?: string | null;
  revokeReason?: string | null;
  reviewedAt?: string | null;
  files?: DiscountRequestFileApi[];
  proofsPurgedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DiscountRequestListApi {
  items?: DiscountRequestApi[];
}

/* ---------- GET /student/discount-requests/current ---------- */

export interface DiscountRequestCurrentApi {
  canRequest?: boolean;
  canResubmit?: boolean;
  request?: DiscountRequestApi | null;
}

/* ---------- GET /student/discount-requests/:id/files/:fileId ---------- */

export interface DiscountRequestFileLinkApi {
  url: string;
  mimeType?: string | null;
  expiresInSeconds?: number | null;
}

/* ---------- View models ---------- */

export interface DiscountConfigViewModel {
  discountTypes: Array<{ code: DiscountTypeCode; name: string; helpText: string }>;
  colleges: Array<{
    id: string;
    name: string;
    city: string;
    stateId: string;
  }>;
  class10Boards: Array<{ id: string; name: string; needsStateBoardName: boolean }>;
  class12Boards: Array<{ id: string; name: string; needsStateBoardName: boolean }>;
  verticals: Array<{ id: string; name: string }>;
  exams: Array<{
    id: string;
    verticalId: string;
    name: string;
    scoreType: DiscountExamScoreType;
    maxMarks: number | null;
    years: number[];
    stages: Array<{ id: string; name: string }>;
  }>;
  states: Array<{ id: string; name: string }>;
  certificateIssuers: DiscountCertificateIssuer[];
  allowedFileTypes: string[];
  maxFileBytes: number;
  reviewSlaText: string;
  validityDays: number | null;
}

export interface DiscountCurrentViewModel {
  canRequest: boolean;
  canResubmit: boolean;
  request: DiscountRequestApi | null;
}
