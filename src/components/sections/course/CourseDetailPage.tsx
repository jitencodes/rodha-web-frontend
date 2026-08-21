import { Container } from "@/components/layout/Container";
import { CoursePurchaseCard } from "@/components/cards/CoursePurchaseCard";
import { CourseHeroSection } from "@/components/sections/course/CourseHeroSection";
import { CourseDetailsCurriculumSection } from "@/components/sections/course/CourseDetailsCurriculumSection";
import { CourseFacultySection } from "@/components/sections/course/CourseFacultySection";
import { CourseIncludedScheduleSection } from "@/components/sections/course/CourseIncludedScheduleSection";
import { CoursePricingSection } from "@/components/sections/course/CoursePricingSection";
import { CourseTestimonialsSection } from "@/components/sections/course/CourseTestimonialsSection";
import { CourseRelatedSection } from "@/components/sections/course/CourseRelatedSection";
import { CourseFaqSection } from "@/components/sections/course/CourseFaqSection";
import { CourseEnquireStickyBar } from "@/components/sections/course/CourseEnquireStickyBar";
import {
  getCourseCategoryHref,
  getCourseEnrollmentHref,
  getCourseFaqs,
  getCoursePath,
  getCourseTestimonials,
  getFacultyForCourse,
  getRelatedCourses,
  withCourseDetailDefaults,
} from "@/data/course-details";
import {
  breadcrumbJsonLd,
  courseJsonLd,
  faqPageJsonLd,
} from "@/lib/structured-data";
import type { CategoryLandingConfig, Course } from "@/lib/types";

interface CourseDetailPageProps {
  course: Course;
  landing: CategoryLandingConfig;
}

export function CourseDetailPageView({
  course: rawCourse,
  landing,
}: CourseDetailPageProps) {
  const course = withCourseDetailDefaults(rawCourse);
  const faculty = getFacultyForCourse(course);
  const relatedCourses = getRelatedCourses(course, 8);
  const testimonials = getCourseTestimonials(course, landing);
  const faqs = getCourseFaqs(course, landing);
  const categoryHref = getCourseCategoryHref(course.category);
  const categoryLabel = landing.menuLabel || landing.name;
  const coursePath = getCoursePath(course.slug);
  const enrollmentHref = getCourseEnrollmentHref(course);

  const plans = (course.pricingPlans ?? []).map((plan) => ({
    ...plan,
    href: plan.href || enrollmentHref,
  }));

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryLabel, href: categoryHref },
    { label: course.title },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              title: course.title,
              description: course.shortDescription || course.description,
              url: coursePath,
              image: course.thumbnail || course.image,
              price: course.price,
            })
          ),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageJsonLd(faqs)),
          }}
        />
      )}

      {/* Sticky purchase card scope: hero → testimonials (stops before Related) */}
      <div className="relative course-sticky-scope [&_.container-rodha]:lg:pr-[380px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 hidden lg:block">
          <div className="container-rodha relative h-full !pr-4 xl:!pr-6">
            <div className="pointer-events-auto absolute top-0 right-4 xl:right-6 h-full w-[340px]">
              <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto py-8">
                <CoursePurchaseCard
                  course={course}
                  categoryLabel={landing.name}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative py-6 md:py-8 lg:py-10">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-bg-primary"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 80% 20%, rgba(249,115,22,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(249,115,22,0.08) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <Container>
            <CourseHeroSection
              course={course}
              categoryLabel={landing.name}
              categoryHref={categoryHref}
              faculty={faculty}
            />
            <div className="mt-8 lg:hidden">
              <CoursePurchaseCard
                course={course}
                categoryLabel={landing.name}
              />
            </div>
          </Container>
        </div>

        <div className="relative home-section-spacing home-on-light">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-section-white"
            aria-hidden
          />
          <Container>
            <CourseDetailsCurriculumSection course={course} />
          </Container>
        </div>

        <CourseFacultySection faculty={faculty} />
        <CourseIncludedScheduleSection course={course} />
        <CoursePricingSection plans={plans} />
        <CourseTestimonialsSection testimonials={testimonials} />
      </div>

      <CourseRelatedSection relatedCourses={relatedCourses} />
      <CourseFaqSection faqs={faqs} />
      <CourseEnquireStickyBar defaultExam={course.category} />
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
}
