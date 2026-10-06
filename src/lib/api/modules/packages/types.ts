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
  name?: string;
  title?: string;
  designation?: string;
  imageUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
}

export interface PackageFaqApi {
  id?: number | string;
  question?: string;
  answer?: string;
}

export interface PackageTestimonialApi {
  id?: number | string;
  name?: string;
  quote?: string;
  text?: string;
  role?: string;
  imageUrl?: string | null;
  rating?: number | null;
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
  batchStarts?: string | null;
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
  /** Maps to API `graphyCategory` */
  graphyCategory?: string;
  /** Maps to API `subCategory1` */
  subCategory1?: string;
  language?: string;
  sortBy?: string;
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
