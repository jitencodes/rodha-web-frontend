import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { TeamHeroSection } from "@/components/sections/TeamHeroSection";
import { Container } from "@/components/layout/Container";
import { CultureSection } from "@/components/sections/CultureSection";
import { LovedTeamSection } from "@/components/sections/LovedTeamSection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { buildPageMetadata } from "@/lib/seo";
import { getTeam } from "@/lib/api/modules/team/service";

export const metadata = buildPageMetadata({
  title: "Meet the Team — Rodha",
  description:
    "Meet the passionate educators, leaders, and advisors behind Rodha — dedicated to helping aspirants achieve their dream B-school and law school admissions.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeam();
  const featuredFaculty = team?.featuredFaculty ?? [];

  return (
    <>
      <TeamHeroSection banner={team?.banner ?? null} />

      {featuredFaculty.length > 0 ? (
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
              {featuredFaculty.map((member, index) => (
                <div
                  key={member.id}
                  className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <FacultyCardV2 faculty={member} />
                </div>
              ))}
            </InfiniteMarquee>
          </RevealGroup>
        </section>
      ) : null}

      <LovedTeamSection
        images={(team?.galleries ?? []).map((item) => ({
          src: item.src,
          alt: item.alt,
        }))}
      />

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
