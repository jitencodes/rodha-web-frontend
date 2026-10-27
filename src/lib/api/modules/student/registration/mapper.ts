import type {
  BookDispatchViewModel,
  EducationLevelApi,
  EducationLevelViewModel,
  MasterIdOption,
  MasterItemApi,
  PurchasedCourseApi,
  PurchasedCourseViewModel,
  RegistrationFormApi,
  RegistrationRecordApi,
  StudentProfileDetailApi,
  StudentRegistrationFormViewModel,
  StudentRegistrationRecord,
  TargetCollegeOption,
  TargetExamOption,
} from "./types";

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  return false;
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asNumber(item))
    .filter((n): n is number => n !== null);
}

function mapMasterOption(item: MasterItemApi): MasterIdOption | null {
  const id = asNumber(item.id);
  if (id === null) return null;
  const label =
    (typeof item.title === "string" && item.title.trim()) ||
    (typeof item.name === "string" && item.name.trim()) ||
    String(id);
  return { id, value: String(id), label };
}

function mapMasterList(items: MasterItemApi[] | undefined): MasterIdOption[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(mapMasterOption)
    .filter((o): o is MasterIdOption => o !== null);
}

function mapTargetExams(
  items: MasterItemApi[] | undefined
): TargetExamOption[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const base = mapMasterOption(item);
      if (!base) return null;
      const websiteCategoryId =
        asNumber(item.websiteCategoryId) ??
        asNumber(item.category?.id) ??
        0;
      return { ...base, websiteCategoryId };
    })
    .filter((o): o is TargetExamOption => o !== null);
}

function mapTargetColleges(
  items: MasterItemApi[] | undefined
): TargetCollegeOption[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const base = mapMasterOption(item);
      if (!base) return null;
      const websiteCategoryId =
        asNumber(item.websiteCategoryId) ??
        asNumber(item.category?.id) ??
        0;
      return { ...base, websiteCategoryId };
    })
    .filter((o): o is TargetCollegeOption => o !== null);
}

function mapEducation(
  levels: EducationLevelApi[] | undefined
): EducationLevelViewModel[] {
  if (!Array.isArray(levels)) return [];
  return levels
    .map((level) => {
      const id = asNumber(level.id);
      if (id === null) return null;
      return {
        id,
        code: typeof level.code === "string" ? level.code : "",
        name: typeof level.name === "string" ? level.name : "",
        boards: mapMasterList(level.boards),
        streams: (level.streams ?? [])
          .map((stream) => {
            const streamId = asNumber(stream.id);
            if (streamId === null) return null;
            return {
              id: streamId,
              value: String(streamId),
              label:
                typeof stream.name === "string" && stream.name.trim()
                  ? stream.name
                  : String(streamId),
              degrees: mapMasterList(stream.degrees),
            };
          })
          .filter(
            (
              s
            ): s is EducationLevelViewModel["streams"][number] => s !== null
          ),
      };
    })
    .filter((l): l is EducationLevelViewModel => l !== null);
}

function mapPurchasedCourses(
  courses: PurchasedCourseApi[] | undefined
): PurchasedCourseViewModel[] {
  if (!Array.isArray(courses)) return [];
  return courses
    .map((course) => {
      const enrollmentId = asNumber(course.enrollmentId);
      const packageId = asNumber(course.packageId);
      if (enrollmentId === null || packageId === null) return null;
      const batches = Array.isArray(course.batchEnrolled)
        ? course.batchEnrolled.filter(
            (b): b is string => typeof b === "string" && b.trim() !== ""
          )
        : Array.isArray(course.batchStarts)
          ? course.batchStarts.filter(
              (b): b is string => typeof b === "string" && b.trim() !== ""
            )
          : [];
      return {
        enrollmentId,
        packageId,
        courseTitle:
          (typeof course.courseTitle === "string" && course.courseTitle) ||
          (typeof course.packageTitle === "string" && course.packageTitle) ||
          "",
        packageTitle:
          (typeof course.packageTitle === "string" && course.packageTitle) ||
          (typeof course.courseTitle === "string" && course.courseTitle) ||
          "",
        batchEnrolled: batches,
        bookType:
          typeof course.bookType === "string" ? course.bookType : "WITHOUT_BOOK",
        isRepeater: Boolean(course.bookDispatch?.isRepeater),
        books: mapMasterList(course.books),
      };
    })
    .filter((c): c is PurchasedCourseViewModel => c !== null);
}

function namedList(
  items: unknown,
  fallbackIds: number[]
): { names: string[]; ids: number[] } {
  if (Array.isArray(items) && items.length > 0) {
    const names: string[] = [];
    const ids: number[] = [];
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const row = item as { id?: unknown; name?: unknown };
      const id = asNumber(row.id);
      const name = asString(row.name);
      if (id !== null) ids.push(id);
      if (name) names.push(name);
    }
    return { names, ids: ids.length ? ids : fallbackIds };
  }
  return { names: [], ids: fallbackIds };
}

export function mapRegistrationRecord(
  raw: RegistrationRecordApi | null | undefined
): StudentRegistrationRecord | null {
  if (!raw || typeof raw !== "object") return null;

  const targetExamIds = asNumberArray(raw.targetExamIds);
  const targetCollegeIds = asNumberArray(raw.targetCollegeIds);
  const bookIds = asNumberArray(raw.bookIds);

  const exams = namedList(raw.targetExams, targetExamIds);
  const colleges = namedList(raw.targetColleges, targetCollegeIds);
  const books = namedList(raw.books, bookIds);

  const targetVertical =
    raw.targetVertical && typeof raw.targetVertical === "object"
      ? (raw.targetVertical as { name?: unknown; title?: unknown })
      : null;
  const currentStatus =
    raw.currentStatus && typeof raw.currentStatus === "object"
      ? (raw.currentStatus as { name?: unknown })
      : null;
  const studentCategory =
    raw.studentCategory && typeof raw.studentCategory === "object"
      ? (raw.studentCategory as { name?: unknown })
      : null;
  const industry =
    raw.industry && typeof raw.industry === "object"
      ? (raw.industry as { name?: unknown })
      : null;
  const state =
    raw.state && typeof raw.state === "object"
      ? (raw.state as { name?: unknown; code?: unknown })
      : null;

  return {
    id: asNumber(raw.id) ?? 0,
    targetVerticalId: asNumber(raw.targetVerticalId),
    currentStatusId: asNumber(raw.currentStatusId),
    studentCategoryId: asNumber(raw.studentCategoryId),
    industryId: asNumber(raw.industryId),
    stateId: asNumber(raw.stateId),
    targetYear: asNumber(raw.targetYear),
    primaryLanguage: asString(raw.primaryLanguage),
    dateOfBirth: asString(raw.dateOfBirth),
    gender: asString(raw.gender),
    isPwd: asBoolean(raw.isPwd),
    passportPhotoPath: asString(raw.passportPhotoPath),
    govtIdLast4: asString(raw.govtIdLast4),
    whatsappNumber: asString(raw.whatsappNumber),
    whatsappSameAsMobile: asBoolean(raw.whatsappSameAsMobile),
    alternatePhone: asString(raw.alternatePhone),
    alternateEmail: asString(raw.alternateEmail),
    linkedinUrl: asString(raw.linkedinUrl),
    addressLine1: asString(raw.addressLine1),
    addressLine2: asString(raw.addressLine2),
    city: asString(raw.city),
    pinCode: asString(raw.pinCode),
    parentName: asString(raw.parentName),
    parentRelation: asString(raw.parentRelation),
    parentMobile: asString(raw.parentMobile),
    class10BoardName: asString(raw.class10BoardName),
    class10BoardOtherText: asString(raw.class10BoardOtherText),
    class10ScoringScheme: asString(raw.class10ScoringScheme),
    class10Score: asNumber(raw.class10Score),
    class10YearOfPassing: asNumber(raw.class10YearOfPassing),
    class12Status: asString(raw.class12Status),
    class12BoardName: asString(raw.class12BoardName),
    class12BoardOtherText: asString(raw.class12BoardOtherText),
    class12Stream: asString(raw.class12Stream),
    class12ScoringScheme: asString(raw.class12ScoringScheme),
    class12Score: asNumber(raw.class12Score),
    class12YearOfPassing: asNumber(raw.class12YearOfPassing),
    graduationStream: asString(raw.graduationStream),
    graduationDegree: asString(raw.graduationDegree),
    graduationDegreeOtherText: asString(raw.graduationDegreeOtherText),
    graduationSpecialisation: asString(raw.graduationSpecialisation),
    graduationCollege: asString(raw.graduationCollege),
    graduationStatus: asString(raw.graduationStatus),
    graduationYear: asNumber(raw.graduationYear),
    graduationScoringScheme: asString(raw.graduationScoringScheme),
    graduationScore: asNumber(raw.graduationScore),
    postGraduationStatus: asString(raw.postGraduationStatus),
    pgStream: asString(raw.pgStream),
    pgDegreeSpecialization: asString(raw.pgDegreeSpecialization),
    pgCollege: asString(raw.pgCollege),
    pgScoringScheme: asString(raw.pgScoringScheme),
    pgScore: asNumber(raw.pgScore),
    hasWorkExperience: asBoolean(raw.hasWorkExperience),
    workExperienceMonths: asNumber(raw.workExperienceMonths),
    workOrganization: asString(raw.workOrganization),
    workDesignation: asString(raw.workDesignation),
    previousCatAttempts: asNumber(raw.previousCatAttempts),
    previousCatYear: asNumber(raw.previousCatYear),
    previousCatOverallPercentile: asNumber(raw.previousCatOverallPercentile),
    previousCatVarcPercentile: asNumber(raw.previousCatVarcPercentile),
    previousCatDilrPercentile: asNumber(raw.previousCatDilrPercentile),
    previousCatQaPercentile: asNumber(raw.previousCatQaPercentile),
    source: asString(raw.source),
    sourceOtherText: asString(raw.sourceOtherText),
    declarationAccepted: asBoolean(raw.declarationAccepted),
    privacyConsentAccepted: asBoolean(raw.privacyConsentAccepted),
    whatsappConsent: asBoolean(raw.whatsappConsent),
    submittedAt: asString(raw.submittedAt),
    targetVerticalName:
      asString(targetVertical?.title) || asString(targetVertical?.name),
    currentStatusName: asString(currentStatus?.name),
    studentCategoryName: asString(studentCategory?.name),
    industryName: asString(industry?.name),
    stateName: asString(state?.name),
    stateCode: asString(state?.code),
    targetExamNames: exams.names,
    targetExamIds: exams.ids,
    targetCollegeNames: colleges.names,
    targetCollegeIds: colleges.ids,
    bookNames: books.names,
    bookIds: books.ids,
  };
}

export function mapBookDispatches(
  raw: StudentProfileDetailApi["bookDispatches"]
): BookDispatchViewModel[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const id = asNumber(item.id);
      if (id === null) return null;
      return {
        id,
        enrollmentId: asNumber(item.enrollmentId) ?? 0,
        packageId: asNumber(item.packageId) ?? 0,
        packageTitle:
          typeof item.packageTitle === "string" ? item.packageTitle : "",
        bookType: typeof item.bookType === "string" ? item.bookType : "",
        isRepeater: Boolean(item.isRepeater),
        status: typeof item.status === "string" ? item.status : "",
        trackingId:
          typeof item.trackingId === "string" ? item.trackingId : null,
        dispatchedAt:
          typeof item.dispatchedAt === "string" ? item.dispatchedAt : null,
        isBookSentConfirmed: Boolean(item.isBookSentConfirmed),
        books: Array.isArray(item.books)
          ? item.books
              .map((b) => {
                const bookId = asNumber(b.id);
                if (bookId === null) return null;
                return {
                  id: bookId,
                  name: typeof b.name === "string" ? b.name : "",
                };
              })
              .filter((b): b is { id: number; name: string } => b !== null)
          : [],
      };
    })
    .filter((d): d is BookDispatchViewModel => d !== null);
}

export function mapStudentRegistrationForm(
  data: RegistrationFormApi
): StudentRegistrationFormViewModel {
  const purchasedCourses = mapPurchasedCourses(data.purchasedCourses);
  const bookCourses = purchasedCourses.filter(
    (c) => c.bookType === "WITH_BOOK" && !c.isRepeater
  );
  const bookMap = new Map<number, MasterIdOption>();
  for (const course of bookCourses) {
    for (const book of course.books) {
      bookMap.set(book.id, book);
    }
  }
  const availableBooks = Array.from(bookMap.values());

  const courseTitles = purchasedCourses
    .map((c) => c.courseTitle)
    .filter(Boolean);
  const batchLabels = purchasedCourses
    .flatMap((c) => c.batchEnrolled)
    .filter(Boolean);

  const masters = data.masters ?? {};

  return {
    account: {
      fullName:
        typeof data.account?.fullName === "string"
          ? data.account.fullName
          : "",
      email: typeof data.account?.email === "string" ? data.account.email : "",
      mobile:
        typeof data.account?.mobile === "string" ? data.account.mobile : "",
    },
    alreadySubmitted: Boolean(data.alreadySubmitted),
    registration: mapRegistrationRecord(data.registration),
    gate: {
      required: Boolean(data.gate?.required),
      submitted: Boolean(data.gate?.submitted ?? data.alreadySubmitted),
      overdue: Boolean(data.gate?.overdue),
      deadlineAt:
        typeof data.gate?.deadlineAt === "string"
          ? data.gate.deadlineAt
          : null,
      firstEnrollmentAt:
        typeof data.gate?.firstEnrollmentAt === "string"
          ? data.gate.firstEnrollmentAt
          : null,
    },
    purchasedCourses,
    preselectedTargetVerticalId: asNumber(data.preselectedTargetVerticalId),
    masters: {
      targetVerticals: mapMasterList(masters.targetVerticals),
      books: mapMasterList(masters.books),
      targetExams: mapTargetExams(masters.targetExams),
      currentStatuses: mapMasterList(masters.currentStatuses),
      categories: mapMasterList(masters.categories),
      education: mapEducation(masters.education),
      industries: mapMasterList(masters.industries),
      targetColleges: mapTargetColleges(masters.targetColleges),
      states: mapMasterList(masters.states),
    },
    availableBooks,
    requiresBooks: availableBooks.length > 0,
    courseEnrolledLabel: courseTitles.join(", ") || "—",
    batchEnrolledLabel: [...new Set(batchLabels)].join(", ") || "—",
  };
}

export function filterExamsByVertical(
  exams: TargetExamOption[],
  verticalId: string
): TargetExamOption[] {
  if (!verticalId) return exams;
  const id = Number(verticalId);
  if (!Number.isFinite(id)) return exams;
  return exams.filter((e) => e.websiteCategoryId === id);
}

export function filterCollegesByVertical(
  colleges: TargetCollegeOption[],
  verticalId: string
): TargetCollegeOption[] {
  if (!verticalId) return colleges;
  const id = Number(verticalId);
  if (!Number.isFinite(id)) return colleges;
  return colleges.filter((c) => c.websiteCategoryId === id);
}

export function getEducationLevel(
  education: EducationLevelViewModel[],
  code: string
): EducationLevelViewModel | null {
  return education.find((e) => e.code === code) ?? null;
}

/** Board/stream/degree options use name as value (API stores names). */
export function nameOptionsFromMasters(
  items: MasterIdOption[]
): { value: string; label: string }[] {
  return items.map((item) => ({ value: item.label, label: item.label }));
}
