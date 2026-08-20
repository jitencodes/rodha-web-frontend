import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { TeamHeroSection } from "@/components/sections/TeamHeroSection";
import { Container } from "@/components/layout/Container";
// import { AdvisorsSection } from "@/components/sections/AdvisorsSection";
import { CultureSection } from "@/components/sections/CultureSection";
import { LovedTeamSection } from "@/components/sections/LovedTeamSection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
// import { LeadershipCard } from "@/components/cards/LeadershipCard";
// import { leadership, LEADERSHIP_INTRO } from "@/data/team";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { getFeaturedFaculty } from "@/data/faculty";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Meet the Team — Rodha",
  description:
    "Meet the passionate educators, leaders, and advisors behind Rodha — dedicated to helping aspirants achieve their dream B-school and law school admissions.",
  path: "/team",
});


export default function TeamPage() {
  const featuredFaculty = getFeaturedFaculty();

  return (
    <>
      <TeamHeroSection />

      {/* <section className="home-section-spacing bg-section-beige home-on-light">
        <Container>
          <SectionHeaderV2
            badge="Leadership Team"
            title="Guided by Vision. Driven by Purpose."
            subtitle={LEADERSHIP_INTRO}
            align="center"
          />
          <Carousel>
            {leadership.map((member) => (
              <div key={member.id} className="snap-start shrink-0">
                <LeadershipCard member={member} />
              </div>
            ))}
          </Carousel>
        </Container>
      </section> */}

      {/* Our Faculty Experts — temporarily removed from page render
      */}
      <section className="home-section-spacing bg-section-beige home-on-light">
        <Container>
          <SectionHeaderV2
            badge="Featured Faculty"
            title={
              <>
                Learn from India&apos;s{" "}
                <span className="text-orange-500">Top Educators</span>
              </>
            }
            align="left"
          />
        </Container>
        <RevealGroup>
          <InfiniteMarquee speed={35} direction="left" gap={20}>
            {featuredFaculty.map((m, index) => (
              <div
                key={m.id}
                className={`reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <FacultyCardV2 faculty={m} />
              </div>
            ))}
          </InfiniteMarquee>
        </RevealGroup>
      </section>

      {/* Our Advisors — temporarily removed from page render
      <AdvisorsSection />
      */}

      <LovedTeamSection />

      <CultureSection />

      <CTABandV2Decorative
        title="Be a Part of Our Mission"
        subtitle="Join thousands of successful students who trusted Rodha for their exam preparation journey."
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/about us/award-to-boy.png"
        primaryAction={{ label: "Explore Programs", href: "/category/cat" }}
        secondaryAction={{ label: "Book Free Counselling", href: "/contact" }}
      />
    </>
  );
}
