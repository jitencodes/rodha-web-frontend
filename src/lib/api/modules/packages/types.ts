/** Package list item from `GET /website/packages`. */
export interface PackageListItemApi {
  id: number | string;
  slug: string;
  bannerImageUrl?: string | null;
  title: string;
  subtitle?: string | null;
  tags?: string[] | null;
  language?: string | null;
  price?: number | null;
  discountedPrice?: number | null;
  averageRating?: number | null;
  ratingCount?: number | null;
  courseCount?: number | null;
  isSelfEnrolled?: boolean | null;
  graphyCategories?: string[] | null;
  /** Live list/detail field from packages + category embedded packages */
  subCategory1?: string[] | string | null;
  /** Legacy alias kept for older payloads */
  graphySubCategory1?: string[] | string | null;
}

export interface PackageListDataApi {
  items?: PackageListItemApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PackageFacultyApi {
  id?: number | string;
  slug?: string;
  /** Postman field */
  fullName?: string | null;
  /** Legacy fallback */
  name?: string | null;
  title?: string | null;
  designation?: string | null;
  profileImageUrl?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  about?: string | null;
  experienceYears?: number | null;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  subjects?: {
    id: number;
    name?: string | null;
    isActive?: boolean;
  }[] | null;
}

export interface PackageFaqApi {
  id?: number | string;
  question?: string;
  answer?: string;
}

export interface PackageTestimonialApi {
  id?: number | string;
  /** Postman field */
  fullName?: string | null;
  /** Legacy fallback */
  name?: string | null;
  collegeName?: string | null;
  batch?: string | null;
  reviewText?: string | null;
  quote?: string | null;
  text?: string | null;
  role?: string | null;
  profileImageUrl?: string | null;
  imageUrl?: string | null;
  rating?: number | null;
  createdAt?: string | null;
  isActive?: boolean | null;
}

export interface PackageCourseNodeApi {
  id?: number | string;
  slug?: string;
  title?: string;
  type?: string;
  items?: PackageCourseNodeApi[];
}

export interface PackageDetailApi extends PackageListItemApi {
  description?: string | null;
  duration?: string | null;
  mode?: string | null;
  level?: string | null;
  highlights?: string[] | null;
  benefits?: string[] | null;
  batchStarts?: string | string[] | null;
  days?: string | null;
  classTiming?: string | null;
  graphyTitle?: string | null;
  graphyProductId?: string | null;
  instructor?: string | null;
  pricingPlans?: unknown;
  courses?: PackageCourseNodeApi[] | null;
  faculty?: PackageFacultyApi[] | null;
  testimonials?: PackageTestimonialApi[] | null;
  faqs?: PackageFaqApi[] | null;
  similarPackages?: PackageListItemApi[] | null;
}

export interface PackageMasterItemApi {
  id?: number | string;
  name?: string;
  label?: string;
  value?: string;
  slug?: string;
}

export interface PackageMastersDataApi {
  items?: PackageMasterItemApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PackageFilterOption {
  value: string;
  label: string;
}

export interface PackageListQuery {
  page?: number;
  limit?: number;
  search?: string;
  /** CMS website category id */
  categoryId?: number | string;
  /** Maps to API `graphyCategory` (UI: Type) */
  graphyCategory?: string;
  /** Maps to API `subCategory1` */
  subCategory1?: string;
  facultyId?: number | string;
  subjectId?: number | string;
  /** createdAt | price | title | rating */
  sortBy?: string;
  /** asc | desc */
  sortOrder?: string;
}

export interface PackageMasterQuery {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: number | string;
  graphyCategory?: string;
}

export interface PackageCardViewModel {
  id: string;
  packageId: number | null;
  slug: string;
  title: string;
  subtitle: string;
  language?: string;
  price: number;
  originalPrice?: number;
  /** Derived from price vs discountedPrice */
  discountPercent?: number;
  thumbnail?: string;
  tags: string[];
  courseCount: number;
  isSelfEnrolled: boolean;
  averageRating: number | null;
  ratingCount: number;
  href: string;
  /** Kept for CourseCardV2 compatibility */
  courseTypeLabel?: string;
}
