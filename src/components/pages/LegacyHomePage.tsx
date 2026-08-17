import { HeroSection } from "@/components/sections/HeroSection";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/layout/Container";
import { ExamCard } from "@/components/cards/ExamCard";
import { ValuePropCard } from "@/components/cards/ValuePropCard";
import { CourseCard } from "@/components/cards/CourseCard";
import { FacultyCard } from "@/components/cards/FacultyCard";
import { TopperCard } from "@/components/cards/TopperCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { Carousel } from "@/components/ui/Carousel";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ResultsStatsPanel } from "@/components/sections/ResultsStatsPanel";
import { CATEGORIES, VALUE_PROPS, RESULT_STATS } from "@/lib/constants";
import { getFeaturedCourses } from "@/data/courses";
import { faculty } from "@/data/faculty";
import { topResults } from "@/data/results";
import { blogPosts } from "@/data/blog";

export function LegacyHomePage() {
  const featuredCourses = getFeaturedCourses();
  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const sidePosts = blogPosts.filter((p) => p.id !== featuredPost.id).slice(0, 4);
  const midPosts = sidePosts.slice(0, 2);
  const rightPosts = sidePosts.slice(2, 4);

  return (
    <>
      <HeroSection />

      <section className="section-spacing section-gradient-why">
        <Container>
          <SectionHeader
            title={
              <>
                Choose Your Exam,{" "}
                <span className="text-orange-500">Start Your Journey</span>
              </>
            }
            align="center"
          />
          <RevealGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {CATEGORIES.map((cat, index) => (
                <ExamCard
                  key={cat.id}
                  category={cat}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                />
              ))}
            </div>
          </RevealGroup>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeader
            title={
              <>
                Why Thousands Choose{" "}
                <span className="text-orange-500">Rodha</span>
              </>
            }
            align="center"
          />
          <RevealGroup>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {VALUE_PROPS.map((prop, index) => (
                <div
                  key={prop.id}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <ValuePropCard
                    icon={prop.icon}
                    title={prop.title}
                    description={prop.description}
                  />
                </div>
              ))}
            </div>
          </RevealGroup>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeader
            title="Featured Courses"
            subtitle="Handpicked for your success"
            viewAllHref="/category/cat"
            viewAllLabel="View All Courses"
            align="left"
          />
          <RevealGroup>
            <Carousel>
              {featuredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className={`snap-start shrink-0 w-[280px] sm:w-[300px] md:w-[calc(25%-12px)] min-w-[260px] reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <CourseCard course={course} className="h-full" />
                </div>
              ))}
            </Carousel>
          </RevealGroup>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeader
            title="Learn from India's Top Faculty"
            subtitle="Experienced. Dedicated. Result-Oriented."
            viewAllHref="/faculty"
            viewAllLabel="View All Faculty"
            align="left"
          />
          <RevealGroup>
            <Carousel>
              {faculty.map((member, index) => (
                <div
                  key={member.id}
                  className={`snap-start shrink-0 reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <FacultyCard faculty={member} className="h-full" />
                </div>
              ))}
            </Carousel>
          </RevealGroup>
        </Container>
      </section>

      <section id="results" className="section-spacing relative overflow-hidden">
        <AmbientBackground variant="grid" />
        <Container>
          <SectionHeader
            title="Our Results Speak for Themselves"
            subtitle="Real students. Real success."
            viewAllHref="/cat#results"
            viewAllLabel="View All Results"
            align="left"
          />
          <RevealGroup>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch">
              <ResultsStatsPanel
                stats={[...RESULT_STATS]}
                className="reveal-child reveal-delay-1"
              />
              <div className="flex-1 min-w-0">
                <Carousel>
                  {topResults.map((topper, index) => (
                    <div
                      key={topper.id}
                      className={`snap-start shrink-0 reveal-child reveal-delay-${(index % 4) + 1}`}
                    >
                      <TopperCard topper={topper} />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </RevealGroup>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeader
            title="Insights, Tips & Exam Updates"
            subtitle="Stay Informed and Inspired"
            viewAllHref="/blog"
            viewAllLabel="View All Blogs"
            align="left"
          />
          <RevealGroup>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-stretch min-h-[360px] md:min-h-[420px]">
              <div className="lg:col-span-3 h-full min-h-[320px]">
                <BlogCard
                  post={featuredPost}
                  featured
                  className="h-full reveal-child reveal-delay-1"
                />
              </div>
              <div className="lg:col-span-4 grid grid-cols-1 gap-4 h-full">
                {midPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    className={`h-full min-h-[190px] reveal-child reveal-delay-${index + 2}`}
                  />
                ))}
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 gap-4 h-full">
                {rightPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    className={`h-full min-h-[190px] reveal-child reveal-delay-${index + 3}`}
                  />
                ))}
              </div>
            </div>
          </RevealGroup>
        </Container>
      </section>

      <RevealGroup>
        <CTABand
          title="Ready to Achieve Your Dream?"
          subtitle="Join thousands of successful students on their journey to top colleges."
          primaryAction={{ label: "Book Free Counselling", href: "/contact" }}
          secondaryAction={{ label: "Explore Courses", href: "/category/cat" }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
