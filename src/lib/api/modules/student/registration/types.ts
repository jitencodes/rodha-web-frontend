/** API DTOs + view-models for student registration form. */

export type EducationLevelCode =
  | "CLASS_10"
  | "CLASS_12"
  | "GRADUATION"
  | "POST_GRADUATION";

export type MasterOption = {
  value: string;
  label: string;
};

export type MasterIdOption = MasterOption & {
  id: number;
};

export type TargetExamOption = MasterIdOption & {
  websiteCategoryId: number;
};

export type TargetCollegeOption = MasterIdOption & {
  websiteCategoryId: number;
};

export type EducationDegreeOption = MasterIdOption;

export type EducationStreamOption = MasterIdOption & {
  degrees: EducationDegreeOption[];
};

export type EducationLevelViewModel = {
  id: number;
  code: EducationLevelCode | string;
  name: string;
  boards: MasterIdOption[];
  streams: EducationStreamOption[];
};

export type PurchasedCourseViewModel = {
  enrollmentId: number;
  packageId: number;
  courseTitle: string;
  packageTitle: string;
  batchEnrolled: string[];
  bookType: "WITH_BOOK" | "WITHOUT_BOOK" | string;
  isRepeater: boolean;
  books: MasterIdOption[];
};

export type RegistrationGateViewModel = {
  required: boolean;
  submitted: boolean;
  overdue: boolean;
  deadlineAt: string | null;
  firstEnrollmentAt: string | null;
};

export type RegistrationAccountViewModel = {
  fullName: string;
  email: string;
  mobile: string;
};

export type RegistrationMastersViewModel = {
  targetVerticals: MasterIdOption[];
  books: MasterIdOption[];
  targetExams: TargetExamOption[];
  currentStatuses: MasterIdOption[];
  categories: MasterIdOption[];
  education: EducationLevelViewModel[];
  industries: MasterIdOption[];
  targetColleges: TargetCollegeOption[];
  states: MasterIdOption[];
};

/** Nested registration record returned after submit / on profile. */
export type StudentRegistrationRecord = {
  id: number;
  targetVerticalId: number | null;
  currentStatusId: number | null;
  studentCategoryId: number | null;
  industryId: number | null;
  stateId: number | null;
  targetYear: number | null;
  primaryLanguage: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  isPwd: boolean;
  passportPhotoPath: string | null;
  govtIdLast4: string | null;
  whatsappNumber: string | null;
  whatsappSameAsMobile: boolean;
  alternatePhone: string | null;
  alternateEmail: string | null;
  linkedinUrl: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  pinCode: string | null;
  parentName: string | null;
  parentRelation: string | null;
  parentMobile: string | null;
  class10BoardName: string | null;
  class10BoardOtherText: string | null;
  class10ScoringScheme: string | null;
  class10Score: number | null;
  class10YearOfPassing: number | null;
  class12Status: string | null;
  class12BoardName: string | null;
  class12BoardOtherText: string | null;
  class12Stream: string | null;
  class12ScoringScheme: string | null;
  class12Score: number | null;
  class12YearOfPassing: number | null;
  graduationStream: string | null;
  graduationDegree: string | null;
  graduationDegreeOtherText: string | null;
  graduationSpecialisation: string | null;
  graduationCollege: string | null;
  graduationStatus: string | null;
  graduationYear: number | null;
  graduationScoringScheme: string | null;
  graduationScore: number | null;
  postGraduationStatus: string | null;
  pgStream: string | null;
  pgDegreeSpecialization: string | null;
  pgCollege: string | null;
  pgScoringScheme: string | null;
  pgScore: number | null;
  hasWorkExperience: boolean;
  workExperienceMonths: number | null;
  workOrganization: string | null;
  workDesignation: string | null;
  previousCatAttempts: number | null;
  previousCatYear: number | null;
  previousCatOverallPercentile: number | null;
  previousCatVarcPercentile: number | null;
  previousCatDilrPercentile: number | null;
  previousCatQaPercentile: number | null;
  source: string | null;
  sourceOtherText: string | null;
  declarationAccepted: boolean;
  privacyConsentAccepted: boolean;
  whatsappConsent: boolean;
  submittedAt: string | null;
  targetVerticalName: string | null;
  currentStatusName: string | null;
  studentCategoryName: string | null;
  industryName: string | null;
  stateName: string | null;
  stateCode: string | null;
  targetExamNames: string[];
  targetExamIds: number[];
  targetCollegeNames: string[];
  targetCollegeIds: number[];
  bookNames: string[];
  bookIds: number[];
};

export type BookDispatchViewModel = {
  id: number;
  enrollmentId: number;
  packageId: number;
  packageTitle: string;
  bookType: string;
  isRepeater: boolean;
  status: string;
  trackingId: string | null;
  dispatchedAt: string | null;
  isBookSentConfirmed: boolean;
  books: { id: number; name: string }[];
};

export type StudentRegistrationFormViewModel = {
  batch?: string;
  batchCourse?: string;
  account: RegistrationAccountViewModel;
  alreadySubmitted: boolean;
  registration: StudentRegistrationRecord | null;
  gate: RegistrationGateViewModel;
  purchasedCourses: PurchasedCourseViewModel[];
  preselectedTargetVerticalId: number | null;
  masters: RegistrationMastersViewModel;
  /** Unique books from WITH_BOOK non-repeater courses. */
  availableBooks: MasterIdOption[];
  requiresBooks: boolean;
  courseEnrolledLabel: string;
  batchEnrolledLabel: string;
};

/* ---- Raw API shapes ---- */

export type MasterItemApi = {
  id?: number;
  name?: string;
  title?: string;
  slug?: string;
  code?: string;
  isActive?: boolean;
  websiteCategoryId?: number;
  category?: { id?: number; name?: string; title?: string; slug?: string };
};

export type EducationDegreeApi = { id?: number; name?: string };

export type EducationStreamApi = {
  id?: number;
  name?: string;
  degrees?: EducationDegreeApi[];
};

export type EducationLevelApi = {
  id?: number;
  code?: string;
  name?: string;
  boards?: EducationDegreeApi[];
  streams?: EducationStreamApi[];
};

export type PurchasedCourseApi = {
  enrollmentId?: number;
  packageId?: number;
  courseTitle?: string;
  packageTitle?: string;
  batchEnrolled?: string[] | null;
  batchStarts?: string[] | null;
  bookType?: string;
  books?: MasterItemApi[];
  bookDispatch?: {
    isRepeater?: boolean;
    status?: string;
  } | null;
  categories?: MasterItemApi[];
};

export type RegistrationRecordApi = Record<string, unknown>;

export type RegistrationFormApi = {
  batch?: string;
  batchCourse?: string;
  account?: {
    fullName?: string;
    email?: string;
    mobile?: string;
  };
  alreadySubmitted?: boolean;
  registration?: RegistrationRecordApi | null;
  gate?: {
    required?: boolean;
    submitted?: boolean;
    overdue?: boolean;
    deadlineAt?: string | null;
    firstEnrollmentAt?: string | null;
  };
  purchasedCourses?: PurchasedCourseApi[];
  preselectedTargetVerticalId?: number | null;
  masters?: {
    targetVerticals?: MasterItemApi[];
    books?: MasterItemApi[];
    targetExams?: MasterItemApi[];
    currentStatuses?: MasterItemApi[];
    categories?: MasterItemApi[];
    education?: EducationLevelApi[];
    industries?: MasterItemApi[];
    targetColleges?: MasterItemApi[];
    states?: MasterItemApi[];
  };
};

export type StudentProfileDetailApi = {
  id?: string;
  email?: string;
  mobile?: string;
  fullName?: string;
  profilePicturePath?: string | null;
  stateId?: number | null;
  state?: { id?: number; name?: string; code?: string } | null;
  registration?: RegistrationRecordApi | null;
  bookDispatches?: Array<{
    id?: number;
    enrollmentId?: number;
    packageId?: number;
    packageTitle?: string;
    bookType?: string;
    isRepeater?: boolean;
    status?: string;
    trackingId?: string | null;
    dispatchedAt?: string | null;
    isBookSentConfirmed?: boolean;
    books?: Array<{ id?: number; name?: string }>;
  }>;
  stats?: {
    activeEnrollments?: number;
    activeCourseEnrollments?: number;
    completedOrders?: number;
  };
};
