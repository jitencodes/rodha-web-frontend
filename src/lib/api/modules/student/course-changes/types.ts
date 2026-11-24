/**
 * Student course changes: `Rodha_Course_Changes_FE` Postman plus the listing
 * additions in `docs/API_CHANGES_COURSE_CHANGE_LISTING.md` (marked "requested").
 */

import type { ContinueWatchingItem } from "@/lib/account/types";

export type CourseChangeStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "FAILED";

export type CourseChangeBlockedReason =
  | "DISABLED"
  | "PENDING_EXISTS"
  | "MAX_REACHED"
  | "COOLDOWN";

export interface CourseChangePackageApi {
  id?: number;
  title?: string | null;
}

export interface CourseChangeCourseApi {
  id?: number;
  title?: string | null;
  slug?: string | null;
  graphyProductId?: string | null;
  bannerImageUrl?: string | null;
  isActive?: boolean;
  /** Requested. */
  language?: string | null;
}

export interface CourseChangePaginationApi {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

/** Requested: paginated options of one course (`fromCourseId`). */
export interface CourseChangeOptionsApi {
  package?: CourseChangePackageApi | null;
  course?: CourseChangeCourseApi | null;
  items?: CourseChangeCourseApi[];
  pagination?: CourseChangePaginationApi | null;
  filters?: {
    packages?: CourseChangePackageApi[] | null;
    languages?: string[] | null;
  } | null;
}

export interface CourseChangeEligibilityApi {
  enabled?: boolean;
  canRequest?: boolean;
  blockedReason?: CourseChangeBlockedReason | string | null;
  blockedMessage?: string | null;
  nextAllowedAt?: string | null;
  used?: number;
  max?: number;
  remaining?: number;
  cooldownDays?: number;
  pendingRequestId?: number | null;
  packages?: Array<{
    package?: CourseChangePackageApi | null;
    courses?: Array<{
      course?: CourseChangeCourseApi | null;
      options?: CourseChangeCourseApi[] | null;
    }> | null;
  }> | null;
  /** Requested. */
  options?: CourseChangeOptionsApi | null;
}

export interface CourseChangeRequestApi {
  id?: number;
  status?: CourseChangeStatus | string;
  reason?: string | null;
  adminRemark?: string | null;
  package?: CourseChangePackageApi | null;
  fromCourse?: CourseChangeCourseApi | null;
  toCourse?: CourseChangeCourseApi | null;
  reviewedAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string | null;
}

export interface CourseChangeRequestsApi {
  items?: CourseChangeRequestApi[];
  /** Requested. */
  pagination?: CourseChangePaginationApi | null;
}

export interface CourseChangeSubmitBody {
  packageId: number;
  fromCourseId: number;
  toCourseId: number;
  reason?: string;
}

export interface CourseChangeOptionsQuery {
  courseId: number;
  packageId?: number | null;
  search?: string;
  language?: string;
  /** Empty = the order set by the admin. */
  sort?: "" | "title_asc" | "title_desc";
  page?: number;
  limit?: number;
}

export interface CourseChangeRequestsQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseChangeSummary {
  enabled: boolean;
  canRequest: boolean;
  blockedReason: CourseChangeBlockedReason | null;
  blockedMessage: string;
  /** "20 Dec 2026" while in cooldown. */
  nextAllowedLabel: string;
  max: number;
  remaining: number;
  pendingRequestId: number | null;
}

export interface CourseChangeFilterOption {
  value: string;
  label: string;
}

export interface CourseChangeOptionsViewModel {
  summary: CourseChangeSummary;
  /** The open request is for this course (not another course of the student). */
  pendingForCourse: boolean;
  /** The course has at least one option in some package. */
  changeable: boolean;
  /** Package the request is for. */
  packageId: number | null;
  packageTitle: string;
  packageOptions: CourseChangeFilterOption[];
  languageOptions: CourseChangeFilterOption[];
  items: ContinueWatchingItem[];
  page: number;
  total: number;
  totalPages: number;
}

export interface CourseChangeRequestViewModel {
  id: number;
  status: Exclude<CourseChangeStatus, "FAILED">;
  statusLabel: string;
  reason: string;
  adminRemark: string;
  packageTitle: string;
  fromTitle: string;
  fromImageUrl: string;
  fromCourseId: number | null;
  toTitle: string;
  toImageUrl: string;
  requestedLabel: string;
  /** Review / cancellation date, when there is one. */
  closedLabel: string;
  canCancel: boolean;
}
