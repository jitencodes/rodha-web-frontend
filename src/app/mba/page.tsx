import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ResultsStatsPanel } from "@/components/sections/ResultsStatsPanel";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { TopperCardV2 } from "@/components/cards/TopperCardV2";
import { TestSeriesCardV2 } from "@/components/cards/TestSeriesCardV2";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { mbaCourses } from "@/data/courses";
import { getMbaStarFaculty } from "@/data/faculty";
import { getResultsByCategory } from "@/data/results";
import { getTestimonialsByCategory } from "@/data/testimonials";
import {
  MBA_HERO_FEATURES,
  MBA_QUICK_STATS,
  MBA_RESULT_STATS,
  MBA_TEST_SERIES,
} from "@/data/mba-landing";
import { EXTERNAL_URLS } from "@/lib/constants";
import { categoryBreadcrumbJsonLd } from "@/lib/structured-data";
import { CategoryHeroSectionV2 } from "@/components/sections/home/HeroSections/CategoryHeroSectionV2";
import Typewritter from "@/components/Typewriter";
import TestimonialColumn from "@/components/sections/home/Testimonials/TestimonialColumn";
import { YoutubeStoryCard } from "@/components/cards/YoutubeStoryCard";
import { mbaStudentStories } from "@/data/youttube-stories";
import { StoriesModal } from "@/components/layout/VideoModal";
import { TestimonialCardV2 } from "@/components/sections/home/Testimonials/TestimonialCardV2";
import { HomeAppPromotionSection } from "@/components/sections/home/HomeAppPromotionSection";
import { HomeFAQSection } from "@/components/sections/home/HomeFaqSection";

export const metadata: Metadata = {
  title: "MBA Preparation (CAT + GDPI) — Rodha",
  description:
    "Comprehensive MBA preparation covering CAT and GDPI. Live classes, mock tests, and personalized study plans for IIM admissions.",
};

export default function MBAPage() {
  const mbaFaculty = getMbaStarFaculty();
  const mbaResults = getResultsByCategory("mba");
  const mbaTestimonials = getTestimonialsByCategory("mba");
  const resultsRow1 = mbaResults;
  const resultsRow2 = [...mbaResults].reverse();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryBreadcrumbJsonLd("mba")),
        }}
      />

      <CategoryHeroSectionV2
        categoryName="MBA"
        headline={
          <>
            MBA Prep That Transforms Aspirants into{" "}
            <span className="text-orange-500 glow-text-orange">
              <Typewritter
                words={[
                  "Top B school converts.",
                  "99 percentiers.",
                  "The Top 1%.",
                  "IIM Converts.",
                ]}
              />
            </span>
          </>
        }
        subtitle="Crack CAT with expert guidance, exam-level mock tests, and a structured preparation plan designed to help you secure your dream B-school."
        heroImageSrc="/assets/images/hero/cat-hero.jpg"
        heroImageAlt="MBA aspirant preparing for CAT and top B-school admissions"
        features={MBA_HERO_FEATURES}
        quickStats={MBA_QUICK_STATS}
        primaryCta={{ label: "Explore Courses", href: "#courses" }}
        secondaryCta={{
          label: "Explore Test Series",
          href: EXTERNAL_URLS.thinkExam,
          external: true,
        }}
      />

      {/* Results — white */}
      <section
        id="results"
        className="home-section-spacing home-on-light relative overflow-hidden bg-white"
      >
        <Container>
          <SectionHeaderV2
            title="Results That Inspire"
            badge="Real students. Real success."
            align="center"
            className="mx-auto lg:!mb-10"
          />
          <RevealGroup>
            <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:gap-5">
              <ResultsStatsPanel
                stats={MBA_RESULT_STATS}
                variant="light"
                className="reveal-child reveal-delay-1"
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <InfiniteMarquee speed={32} direction="right" gap={20}>
                  {resultsRow1.map((topper, index) => (
                    <div
                      key={`row1-${topper.id}`}
                      className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                    >
                      <TopperCardV2 topper={topper} />
                    </div>
                  ))}
                </InfiniteMarquee>
              </div>
            </div>
          </RevealGroup>

          <div className="mt-5 overflow-hidden">
            <InfiniteMarquee speed={32} direction="left" gap={20}>
              {resultsRow2.map((topper) => (
                <TopperCardV2 key={`row2-${topper.id}`} topper={topper} />
              ))}
            </InfiniteMarquee>
          </div>
        </Container>
      </section>

      {/* Courses — white */}
      <section
        id="courses"
        data-home-zone="courses"
        className="home-section-spacing home-on-light relative bg-[#FFF3E8]"
      >
        <Container>
          <SectionHeaderV2
            badge="MBA Programs"
            title="Flagship CAT 2026 Programs"
            subtitle="Pick the track that fits you. Explore what's included in every course."
            align="center"
            className="mx-auto lg:!mb-10"
          />
          <RevealGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-5">
              {mbaCourses?.map((course, index) => (
                <div
                  key={course.id}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <CourseCardV2 course={course} className="h-full bg-white" />
                </div>
              ))}
            </div>
          </RevealGroup>
        </Container>
      </section>

      {/* Test Series — white + peach cards */}
      <section
        id="test-series"
        data-home-zone="test-series"
        className="home-section-spacing home-on-light relative bg-white"
      >
        <Container>
          <SectionHeaderV2
            badge="MBA Test Series"
            title={
              <>
                Practice like it&apos;s{" "}
                <span className="text-orange-500">the real exam.</span>
              </>
            }
            subtitle="Identify your strengths, fix your weak areas, and walk into CAT with confidence."
            align="center"
            className="mx-auto lg:!mb-10"
          />
          <RevealGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {MBA_TEST_SERIES.map((item, index) => (
                <TestSeriesCardV2
                  key={item.id}
                  item={item}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                />
              ))}
            </div>
          </RevealGroup>
        </Container>
      </section>

      {/* Faculty — peach + white cards */}
      <section
        id="faculty"
        className="home-section-spacing home-on-light relative bg-[#FFF3E8]"
      >
        <Container>
          <SectionHeaderV2
            badge="Star Faculty"
            title="Star Faculty for MBA"
            subtitle="Learn from mentors who have guided thousands to top B-schools."
            align="center"
            className="mx-auto lg:!mb-10"
          />
        </Container>
        <RevealGroup>
          <InfiniteMarquee speed={35} direction="left" gap={20}>
            {mbaFaculty.map((member, index) => (
              <div
                key={member.id}
                className={`reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <FacultyCardV2 faculty={member} />
              </div>
            ))}
          </InfiniteMarquee>
        </RevealGroup>
        <Container>
          <div className="mt-8 flex justify-center md:mt-10">
            <Link
              href="/faculty"
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
            >
              View All Faculty
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials — dark (old black theme) */}
      <section id="testimonials" className="home-section-spacing relative">
        <Container>
          <SectionHeader
            title="What Our Students Say"
            subtitle="Real stories from Rodha MBA aspirants"
            align="center"
            className="mx-auto lg:!mb-10"
          />

          <RevealGroup>
            <div className="testimonial-marquee relative mt-4 overflow-hidden lg:h-[580px]">
              <div className="hidden h-full grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                <TestimonialColumn
                  testimonials={mbaTestimonials.filter((_, i) => i % 3 === 0)}
                  direction="down"
                  fadeFrom="#0A0A0A"
                />
                <TestimonialColumn
                  testimonials={mbaTestimonials.filter((_, i) => i % 3 === 1)}
                  direction="up"
                  fadeFrom="#0A0A0A"
                />
                <TestimonialColumn
                  testimonials={mbaTestimonials.filter((_, i) => i % 3 === 2)}
                  direction="down"
                  className="hidden lg:block"
                  fadeFrom="#0A0A0A"
                />
              </div>
              <div className="block md:hidden">
                <InfiniteMarquee speed={35}>
                  {mbaTestimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`snap-start shrink-0 reveal-child reveal-delay-${(index % 4) + 1}`}
                    >
                      <TestimonialCardV2 testimonial={testimonial} />
                    </div>
                  ))}
                </InfiniteMarquee>
              </div>
            </div>
          </RevealGroup>
        </Container>
      </section>

      <CTABandV2Decorative
        title="Ready to Crack CAT & Convert GDPI?"
        subtitle="Join thousands of serious aspirants and start your MBA journey today."
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/about us/award.png"
        primaryAction={{ label: "Book Free Counselling", href: "/contact" }}
        secondaryAction={{ label: "Explore Courses", href: "/mba#courses" }}
      />

      {/* Stories — white */}
      <section
        data-home-zone="stories"
        className="home-section-spacing home-on-light relative bg-white"
      >
        <Container>
          <SectionHeaderV2
            badge="Still not convinced?"
            title={
              <>
                Watch how they{" "}
                <span className="text-orange-500">Did it.</span>
              </>
            }
            subtitle="They were exactly where you are today — hear their stories, in their own words."
            align="center"
            className="mx-auto lg:!mb-10"
          />
        </Container>
        <RevealGroup>
          <InfiniteMarquee speed={35}>
            {mbaStudentStories.map((story) => (
              <YoutubeStoryCard
                key={story.id}
                youtubeId={story.youtubeId}
                student={story.student}
                subtitle={story.subtitle}
              />
            ))}
          </InfiniteMarquee>
        </RevealGroup>
      </section>

      <HomeAppPromotionSection />
      <HomeFAQSection/>
      <StoriesModal />
    </>
  );
}
