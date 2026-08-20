export type CategoryId =
  | "cat"
  | "ipmat"
  | "clat"
  | "ssc"
  | "skillhouse";

export interface Category {
  id: CategoryId;
  /** Short label for the header switcher trigger */
  name: string;
  /** Full label shown in the switcher dropdown menu */
  menuLabel: string;
  fullName: string;
  slug: string;
  subHeading?: string;
  description: string;
  color?: string;
  accentColor?: string;
  icon?: string;
  image?: string;
  /** Large 3D illustration for exam category cards */
  illustrationImage?: string;
  courseCount?: string;
  selectionCount?: string;
}

export type CourseFilterType = "comprehensive" | "individual" | "crash" | "other";

export interface Course {
  id: string;
  title: string;
  slug: string;
  language?: string;
  caourseCount?: number;
  category: CategoryId;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  duration: string;
  mode?: string;
  classCount?: string;
  studentsEnrolled?: string;
  features: string[];
  highlights: string[];
  enrollmentUrl: string;
  externalLink?: string;
  image?: string;
  thumbnail?: string;
  /** Faculty portrait shown on the right of featured course cards */
  facultyImage?: string;
  badge?: string;
  isPopular?: boolean;
  startDate?: string;
  /** Filter group on category course carousels */
  courseType?: CourseFilterType;
  faculty?: string;

  badgeType?: "audience";

  detailsLabel?: string;

  details?: string[];

  showFaculty?: boolean;

  totalHours?: string;
}

export interface FacultyHeroStat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface FacultyCourseTaught {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lectures: string;
  enrolled: string;
  href: string;
}

export interface FacultyPublication {
  id: string;
  title: string;
  /** Display fallback when type/category/date are omitted */
  meta: string;
  thumbnail: string;
  href?: string;
  type?: string;
  date?: string;
  category?: string;
}

export interface FacultyReview {
  id: string;
  name: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface FacultyVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  href?: string;
}

export interface FacultyResultStat {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface Faculty {
  id: string;
  name: string;
  slug: string;
  title: string;
  qualification: string;
  specialization: string[];
  experience: string;
  bio: string;
  image: string;
  rating?: number;
  studentsMentored?: string;
  achievements?: string[];
  categories: CategoryId[];
  featured?: boolean;
  /** Detail page — optional; omit to hide related sections */
  designation?: string;
  badgeLabel?: string;
  about?: string;
  philosophy?: string;
  expertiseTags?: string[];
  heroStats?: FacultyHeroStat[];
  coursesTaught?: FacultyCourseTaught[];
  publications?: FacultyPublication[];
  reviews?: FacultyReview[];
  videos?: FacultyVideo[];
  resultStats?: FacultyResultStat[];
  reviewCountLabel?: string;
  honorificSuffix?: "Sir" | "Ma'am";
  cta?: {
    title: string;
    description: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  thumbnail: string;
  shortDescription: string;
  content: string;
  publishedDate: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  tags?: string[];
  featured?: boolean;
  /** @deprecated kept for legacy homepage compat */
  excerpt?: string;
  /** @deprecated kept for legacy homepage compat */
  image?: string;
  /** @deprecated kept for legacy homepage compat */
  publishedAt?: string;
  /** @deprecated kept for legacy homepage compat */
  author?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  exam: string;
  score: string;
  college: string;
  quote: string;
  image?: string;
  productCategory?: string;
  reviewNote?: string;
  year: number;
  category: CategoryId;
}

export interface TopperResult {
  id: string;
  name: string;
  batch: string[];
  exam: string;
  rank?: number;
  percentile?: number;
  score?: string;
  college: string;
  year: number;
  image?: string;
  category: CategoryId;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  exam: CategoryId | "";
  message: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  exam: CategoryId | "";
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface ResultStat {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
}

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HeroFeature {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface TrustMetric {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface CategoryHeroFeature {
  id: string;
  label: string;
  icon: string;
}

export interface CategoryQuickStat {
  id: string;
  value: string;
  label: string;
  icon: string;
  prefix?: string;
}

export interface TestSeriesItem {
  id: string;
  title: string;
  description: string;
  features?: string[];
  href: string;
  icon: string;
  image?: string;
  value: string;
  price: string;
  offerPrice: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: string;
  highlighted?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type CategorySectionTheme = "dark" | "beige" | "white";

export interface CategoryCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface CategoryLandingMetadata {
  title: string;
  description: string;
}

export interface CategoryLandingHero {
  eyebrow: string;
  title: string;
  accent: string | string[];
  subtitle: string;
  primaryCta: CategoryCta;
}

export interface CategoryLandingSectionCopy {
  facultyBadge: string | undefined;
  coursesBadge: string;
  coursesTitle: string;
  coursesSubtitle: string;
  testSeriesBadge: string;
  testSeriesTitle: string;
  testSeriesSubtitle: string;
  facultyTitle: string;
  facultySubtitle: string;
  testimonialSubtitle: string;
  storiesSubtitle: string;
}

export interface CategoryLandingCta {
  title: string;
  subtitle: string;
  primaryAction: CategoryCta;
  secondaryAction: CategoryCta;
}

export interface StudentStory {
  id: string;
  youtubeId: string;
  student: string;
  subtitle: string;
}

export interface CategoryLandingConfig extends Category {
  metadata: CategoryLandingMetadata;
  hero: CategoryLandingHero;
  sectionCopy: CategoryLandingSectionCopy;
  cta: CategoryLandingCta;
  sectionThemes: Record<string, CategorySectionTheme>;
  quickStats: CategoryQuickStat[];
  resultStats: ResultStat[];
  testSeries: TestSeriesItem[];
  faqs: FaqItem[];
  courses: Course[];
  facultyIds: string[];
  results: TopperResult[];
  testimonials: Testimonial[];
  stories: StudentStory[];
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
}

export interface Advisor {
  id: string;
  name: string;
  /** Current designation — shown in orange */
  role: string;
  formerRole: string;
  formerOrganization: string;
  image: string;
}

export interface CultureValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamHeroStat {
  id: string;
  value: string;
  label: string;
  icon: string;
}
