import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ResultsStatsPanel } from "@/components/sections/ResultsStatsPanel";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { CategoryCoursesSlider } from "@/components/sections/CategoryCoursesSlider";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { TopperCardV2 } from "@/components/cards/TopperCardV2";
import { TestSeriesCardV2 } from "@/components/cards/TestSeriesCardV2";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { AccordionV2 } from "@/components/ui/AccordionV2";
import { CategoryHeroSectionV2 } from "@/components/sections/home/HeroSections/CategoryHeroSectionV2";
import Typewritter from "@/components/Typewriter";
import TestimonialColumn from "@/components/sections/home/Testimonials/TestimonialColumn";
import { YoutubeStoryCard } from "@/components/cards/YoutubeStoryCard";
import { StoriesModal } from "@/components/layout/VideoModal";
import { TestimonialCardV2 } from "@/components/sections/home/Testimonials/TestimonialCardV2";
import { HomeAppPromotionSection } from "@/components/sections/home/HomeAppPromotionSection";
import {
  getCategoryFaculty,
} from "@/data/category-landings";
import { categoryBreadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import type { CategoryLandingConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Carousel } from "../ui/Carousel";

interface CategoryLandingPageProps {
  category: CategoryLandingConfig;
}

function sectionSurface(theme: string | undefined) {
  switch (theme) {
    case "beige":
      return "bg-section-beige home-on-light";
    case "white":
      return "bg-section-white home-on-light";
    default:
      return "";
  }
}

export function CategoryLandingPage({ category }: CategoryLandingPageProps) {
  const facultyMembers = getCategoryFaculty(category);
  const courses = category.courses;
  const results = category.results;
  const testimonials = category.testimonials;
  const showResults =
    (category.id === "cat" || category.id === "ipmat") && results.length > 0;
  const resultsMidpoint = Math.ceil(results.length / 2);
  const resultsRow1 = results.slice(0, resultsMidpoint);
  const resultsRow2 = results.slice(resultsMidpoint);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryBreadcrumbJsonLd(category.slug)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(category.faqs)),
        }}
      />

      <CategoryHeroSectionV2
        categoryName={category.name}
        eyebrow={category.hero.eyebrow}
        headline={
          <>
            {category.hero.title}{" "}
            <span className="text-orange-500 glow-text-orange"> <br />
              <Typewritter
                words={
                  Array.isArray(category.hero.accent)
                    ? category.hero.accent
                    : [category.hero.accent]
                }
              />
            </span>
          </>
        }
        subtitle={category.hero.subtitle}
        quickStats={category.quickStats}
        primaryCta={category.hero.primaryCta}
        videoId={category.hero.videoId}
      />

      {showResults && <section
        id="results"
        className={cn(
          "home-section-spacing relative overflow-hidden",
          sectionSurface(category.sectionThemes.results)
        )}
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
                stats={category.resultStats}
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

          {resultsRow2.length > 0 && (
            <div className="mt-5 overflow-hidden">
              <InfiniteMarquee speed={32} direction="left" gap={20}>
                {resultsRow2.map((topper) => (
                  <TopperCardV2 key={`row2-${topper.id}`} topper={topper} />
                ))}
              </InfiniteMarquee>
            </div>
          )}
        </Container>
      </section>}

      <section
        id="courses"
        data-home-zone="courses"
        className={cn(
          "home-section-spacing relative",
          sectionSurface(category.sectionThemes.courses)
        )}
      >
        <Container>
          <SectionHeaderV2
            badge={category.sectionCopy.coursesBadge}
            title={category.sectionCopy.coursesTitle}
            subtitle={category.sectionCopy.coursesSubtitle}
            align="center"
            className="mx-auto lg:!mb-10"
          />
          <CategoryCoursesSlider courses={courses} />
        </Container>
      </section>

      {(category.id == "cat" || category.id == "ipmat") && <section
        id="test-series"
        data-home-zone="test-series"
        className={cn(
          "home-section-spacing relative",
          sectionSurface(category.sectionThemes["test-series"])
        )}
      >
        <Container>
          <SectionHeaderV2
            badge={category.sectionCopy.testSeriesBadge}
            title={
              <>
                {category.sectionCopy.testSeriesTitle.includes("real exam") ? (
                  <>
                    Practice like it&apos;s{" "}
                    <span className="text-orange-500">the real exam.</span>
                  </>
                ) : (
                  category.sectionCopy.testSeriesTitle
                )}
              </>
            }
            subtitle={category.sectionCopy.testSeriesSubtitle}
            align="center"
            className="mx-auto lg:!mb-10"
          />
          <Carousel showArrows>
            {category.testSeries.map((item, index) => (
              <div
                key={item.id}
                className={`h-full min-w-0 shrink-0 snap-start basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)] reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <TestSeriesCardV2
                  key={item.id}
                  item={item}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </Container>
      </section>}

      {category.id !== "skillhouse" && <section
        id="faculty"
        className={cn(
          "home-section-spacing relative",
          sectionSurface(category.sectionThemes.faculty)
        )}
      >
        <Container>
          <SectionHeaderV2
            badge={category.sectionCopy.facultyBadge}
            title={category.sectionCopy.facultyTitle}
            subtitle={category.sectionCopy.facultySubtitle}
            align="center"
            className="mx-auto lg:!mb-10"
          />
        </Container>
        <RevealGroup>
          <InfiniteMarquee speed={35} direction="left" gap={20}>
            {facultyMembers.map((member, index) => (
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
      </section>}

      <section id="testimonials" className="home-section-spacing relative">
        <Container>
          <SectionHeader
            title="What Our Students Say"
            subtitle={category.sectionCopy.testimonialSubtitle}
            align="center"
            className="mx-auto lg:!mb-10"
          />

          <RevealGroup>
            <div className="testimonial-marquee relative mt-4 overflow-hidden lg:h-[580px]">
              <div className="hidden h-full grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                <TestimonialColumn
                  testimonials={testimonials.filter((_, i) => i % 3 === 0)}
                  direction="down"
                  fadeFrom="#0A0A0A"
                />
                <TestimonialColumn
                  testimonials={testimonials.filter((_, i) => i % 3 === 1)}
                  direction="up"
                  fadeFrom="#0A0A0A"
                />
                <TestimonialColumn
                  testimonials={testimonials.filter((_, i) => i % 3 === 2)}
                  direction="down"
                  className="hidden lg:block"
                  fadeFrom="#0A0A0A"
                />
              </div>
              <div className="block md:hidden">
                <InfiniteMarquee speed={35}>
                  {testimonials.map((testimonial, index) => (
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
        title={category.cta.title}
        subtitle={category.cta.subtitle}
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/about us/award-to-boy.png"
        primaryAction={category.cta.primaryAction}
        secondaryAction={category.cta.secondaryAction}
      />

      {category.stories.length > 0 && (
        <section
          data-home-zone="stories"
          className={cn(
            "home-section-spacing relative",
            sectionSurface(category.sectionThemes.stories)
          )}
        >
          <Container>
            <SectionHeaderV2
              badge="Rodha Success Stories"
              title={
                <>
                  Watch how they{" "}
                  <span className="text-orange-500">Did it.</span>
                </>
              }
              subtitle={category.sectionCopy.storiesSubtitle}
              align="center"
              className="mx-auto lg:!mb-10"
            />
          </Container>
          <RevealGroup>
            <InfiniteMarquee speed={35}>
              {category.stories.map((story) => (
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
      )}

      <HomeAppPromotionSection />

      <section
        id="faqs"
        className={cn(
          "home-section-spacing relative overflow-hidden",
          sectionSurface(category.sectionThemes.faqs)
        )}
      >
        <Container>
          <SectionHeaderV2
            title="Frequently Asked Questions"
            className="mx-auto lg:!mb-10"
            align="center"
            badge="GOOD TO KNOW"
          />
          <AccordionV2
            items={category.faqs.map(({ id, question, answer }) => ({
              id,
              question,
              answer,
            }))}
            iconVariant="plus"
            className="mx-auto max-w-4xl"
          />
          <div className="mt-8 flex justify-center">
            <Link
              href="/faq"
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
            >
              View All FAQs
            </Link>
          </div>
        </Container>
      </section>

      <StoriesModal />
    </>
  );
}
