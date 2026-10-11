import type { Metadata } from "next";
import { FacultyHeroSection } from "@/components/sections/FacultyHeroSection";
import { FacultyWhySection } from "@/components/sections/FacultyWhySection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { FacultyListingClient } from "./FacultyListingClient";
import { getFacultyPage } from "@/lib/api/modules/faculty/service";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import { getActiveSubjects } from "@/lib/api/modules/subjects/service";
import {
  FACULTY_ITEMS_PER_PAGE,
  type FacultySortKey,
} from "@/data/faculty";
import type { FacultyFiltersState } from "@/components/sections/FacultyFiltersBar";

export const metadata: Metadata = buildPageMetadata({
  title: "CAT Faculty - Learn from Ravi Sir, KD Sir & Experts | Rodha",
  description:
    "Meet Rodha's CAT faculty: Ravi Prakash, Krishnendu Dutta (KD) and 10 more experts in Quant, LRDI and VARC with up to 23 years of teaching experience.",
  path: "/faculty",
  keywords: ["CAT 2027", "CAT Online Coaching", "CAT Faculty", "CAT Courses", "CAT Preparation", "CAT 2027 Preparation", "CAT 2027 Online Coaching", "CAT 2027 Faculty", "CAT 2027 Courses"],
});

const SORT_TO_API: Record<FacultySortKey, string> = {
  "experience-desc": "experience_desc",
  "experience-asc": "experience_asc",
  "name-asc": "name_asc",
  "name-desc": "name_desc",
  "rating-desc": "experience_desc",
};

const SORT_KEYS = Object.keys(SORT_TO_API) as FacultySortKey[];

interface FacultyPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subject?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function FacultyPage({ searchParams }: FacultyPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const category = params.category?.trim() || "";
  const subject = params.subject?.trim() || "";
  const sort = SORT_KEYS.includes(params.sort as FacultySortKey)
    ? (params.sort as FacultySortKey)
    : "experience-desc";
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [facultyPage, categories, subjects] = await Promise.all([
    getFacultyPage({
      page: currentPage,
      limit: FACULTY_ITEMS_PER_PAGE,
      search: query,
      categoryIds: category || undefined,
      subjectIds: subject || undefined,
      sortBy: SORT_TO_API[sort],
    }),
    getActiveCategories(),
    getActiveSubjects(),
  ]);

  const filters: FacultyFiltersState = {
    query,
    category,
    subject,
    sort,
  };

  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const subjectOptions = subjects
    .filter((item) => !category || item.categoryIds.includes(category))
    .map((item) => ({
      value: item.id,
      label: item.name,
    }));

  const pagination = facultyPage?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const safePage = Math.min(currentPage, totalPages);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Faculty" },
            ])
          ),
        }}
      />

      <FacultyHeroSection banner={facultyPage?.banner ?? null} />

      <FacultyListingClient
        featured={facultyPage?.featuredFaculty ?? []}
        items={facultyPage?.items ?? []}
        total={pagination?.total ?? 0}
        totalPages={totalPages}
        currentPage={safePage}
        filters={filters}
        categoryOptions={categoryOptions}
        subjectOptions={subjectOptions}
      />

      <FacultyWhySection />

      <RevealGroup>
        <CTABandV2Decorative
          title="Ready to Begin Your Journey?"
          subtitle="Book a Demo Class or Explore our Courses."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/footer-cta-award 4.png"
          primaryAction={{ label: "Book a Demo Class", href: "/contact" }}
          secondaryAction={{ label: "Explore Courses", href: "/category/cat" }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
