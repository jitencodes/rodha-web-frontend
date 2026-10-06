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
  courseTakeUrl?: string | null;
  courseTakeSsoLandingPath?: string | null;
}

export interface StudentEnrollmentListItemApi {
  enrollmentId?: number;
  learningStatus?: string;
  progress?: number;
  progressPercent?: number;
  totalTime?: number;
  completed?: boolean;
  validTill?: string | null;
  lastAccessDate?: string | null;
  startDate?: string | null;
  assignedAt?: string | null;
  course?: StudentAssignedCourseApi | null;
}

export interface StudentCoursesListDataApi {
  items?: StudentEnrollmentListItemApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
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
  takeUrl?: string | null;
  ssoLandingPath?: string | null;
  items?: StudentCourseContentItemApi[];
}

export interface StudentCourseDetailDataApi {
  enrollment?: {
    id?: number;
    status?: string;
    assignedAt?: string;
  };
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
      progressPercent?: number;
    };
    items?: StudentCourseContentItemApi[];
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
