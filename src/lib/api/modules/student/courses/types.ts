export interface StudentAssignedCourseApi {
  id: number | string;
  slug?: string;
  graphyProductId?: string;
  title?: string;
  bannerImageUrl?: string | null;
  language?: string | null;
  duration?: string | number | null;
  price?: number | null;
  discountedPrice?: number | null;
  averageRating?: number | null;
  ratingCount?: number | null;
  categories?: Array<{ id?: number | string; name?: string; slug?: string }>;
  subCategory1?: string | null;
  courseTakeUrl?: string | null;
  courseTakeSsoLandingPath?: string | null;
}

export interface StudentCourseIncludesApi {
  liveClass?: number;
  video?: number;
  quiz?: number;
  pdf?: number;
}

export interface StudentEnrollmentListItemApi {
  enrollmentId?: number;
  id?: number | string;
  status?: string;
  learningStatus?: string;
  progress?: number;
  progressPercent?: number;
  totalTime?: number;
  completed?: boolean;
  validTill?: string | null;
  lastAccessDate?: string | null;
  startDate?: string | null;
  assignedAt?: string | null;
  includes?: StudentCourseIncludesApi | null;
  course?: StudentAssignedCourseApi | null;
}

/** Shared shape for todayContents (dashboard / assigned courses) and productContents (course detail). */
export interface StudentLiveContentApi {
  id?: number | string;
  source?: string;
  graphyItemId?: string;
  title?: string;
  type?: string;
  contentType?: string;
  startTime?: string | null;
  endTime?: string | null;
  graphyCreatedAt?: string | null;
  graphyModifiedAt?: string | null;
  liveClassStatus?: string | null;
  takeUrl?: string | null;
  ssoLandingPath?: string | null;
  course?: {
    id?: number | string;
    slug?: string;
    graphyProductId?: string;
    title?: string;
  } | null;
  package?: unknown;
}

export interface StudentCoursesListDataApi {
  items?: StudentEnrollmentListItemApi[];
  todayContents?: StudentLiveContentApi[] | null;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface StudentCourseChapterApi {
  id?: number | string;
  title?: string;
  courseId?: number | string;
}

export interface StudentCourseContentItemApi {
  id?: number | string;
  graphyItemId?: string;
  courseId?: number;
  parentId?: number | null;
  title?: string;
  type?: string;
  liveclassType?: string | null;
  videoType?: string | null;
  duration?: number | null;
  pages?: number | null;
  questions?: number | null;
  sortOrder?: number | null;
  completed?: boolean;
  liveClassStatus?: string | null;
  quizResultStatus?: string | null;
  quizMarksObtained?: number | string | null;
  takeUrl?: string | null;
  ssoLandingPath?: string | null;
  chapter?: StudentCourseChapterApi | null;
  course?: {
    id?: number | string;
    slug?: string;
    graphyProductId?: string;
    title?: string;
  } | null;
  items?: StudentCourseContentItemApi[];
}

export interface StudentCourseDetailEnrollmentApi {
  id?: number;
  status?: string;
  learningStatus?: string;
  progress?: number;
  progressPercent?: number;
  totalTime?: number;
  completed?: boolean;
  validTill?: string | null;
  lastAccessDate?: string | null;
  startDate?: string | null;
  assignedAt?: string | null;
}

export interface StudentCourseDetailDataApi {
  enrollment?: StudentCourseDetailEnrollmentApi;
  course?: StudentAssignedCourseApi & {
    instructor?: string | null;
    syllabus?: string | null;
    itemCount?: number;
    contentSummary?: {
      total?: number;
      byType?: Record<string, number>;
    };
    progress?: {
      totalTimeSpent?: number;
      averageCompletion?: number;
      averageCourseCompletion?: number;
      progressPercent?: number;
      lastSyncedAt?: string | null;
    };
    chapters?: StudentCourseChapterApi[];
    items?: StudentCourseContentItemApi[];
    productContents?: StudentLiveContentApi[] | null;
  };
  items?: StudentCourseContentItemApi[];
  type?: string;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface QuickActionsDataApi {
  type?: string;
  items?: StudentCourseContentItemApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface StudentCourseFilterOptionApi {
  value?: string;
  label?: string;
  id?: number | string;
  name?: string;
  title?: string;
  slug?: string;
}

export interface StudentCourseFilterOptionsDataApi {
  packages?: StudentCourseFilterOptionApi[];
  categories?: StudentCourseFilterOptionApi[];
  subCategories?: StudentCourseFilterOptionApi[];
  courses?: Array<{
    id?: number | string;
    slug?: string;
    graphyProductId?: string;
    title?: string;
    bannerImageUrl?: string | null;
  }>;
}

export interface StudentCourseChapterOptionsDataApi {
  items?: Array<
    StudentCourseChapterApi & {
      course?: {
        id?: number | string;
        slug?: string;
        title?: string;
      } | null;
    }
  >;
}

/** Quick Actions / content-type query values (requirement + Postman). Never use `all`. */
export type StudentCourseContentTypeQuery =
  | "videos"
  | "quizzes"
  | "pdfs"
  | "live-classes"
  | "assignments";

export interface QuickActionsQuery {
  type: StudentCourseContentTypeQuery;
  search?: string;
  page?: number;
  limit?: number;
  courseId?: string | number;
  courseIds?: string;
  packageId?: string | number;
  packageIds?: string;
  completionStatus?: string;
  liveClassStatus?: string;
  resultStatus?: string;
}

/** Postman-supported completionStatus values */
export type StudentCompletionStatusQuery =
  | "all"
  | "completed"
  | "not_completed";

/** Postman-supported liveClassStatus values */
export type StudentLiveClassStatusQuery = "all" | "live" | "upcoming";

/** Postman-supported resultStatus values */
export type StudentResultStatusQuery =
  | "all"
  | "passed"
  | "failed"
  | "in_review";

/** Postman-supported sortBy for assigned courses list */
export type StudentCoursesSortByQuery =
  | "last_updated"
  | "recently_purchased"
  | "recently_viewed"
  | "continue_watching";
