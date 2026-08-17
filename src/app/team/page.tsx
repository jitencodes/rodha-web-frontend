import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { TeamHeroSection } from "@/components/sections/TeamHeroSection";
import { AdvisorsSection } from "@/components/sections/AdvisorsSection";
import { CultureSection } from "@/components/sections/CultureSection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { LeadershipCard } from "@/components/cards/LeadershipCard";
import { FacultyExpertCard } from "@/components/cards/FacultyExpertCard";
import { leadership, LEADERSHIP_INTRO } from "@/data/team";
import { faculty } from "@/data/faculty";

export const metadata: Metadata = {
  title: "Meet the Team — Rodha",
  description:
    "Meet the passionate educators, leaders, and advisors behind Rodha — dedicated to helping aspirants achieve their dream B-school and law school admissions.",
};

export default function TeamPage() {
  return (
    <>
      <div className="bg-section-white home-on-light">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Meet the Team" },
            ]}
          />
        </Container>
      </div>

      <TeamHeroSection />

      <section className="home-section-spacing bg-section-beige home-on-light">
        <Container>
          <SectionHeaderV2
            badge="Leadership Team"
            title="Guided by Vision. Driven by Purpose."
            subtitle={LEADERSHIP_INTRO}
          />
          <Carousel>
            {leadership.map((member) => (
              <div key={member.id} className="snap-start shrink-0">
                <LeadershipCard member={member} />
              </div>
            ))}
          </Carousel>
        </Container>
      </section>

      <section className="home-section-spacing bg-section-white home-on-light">
        <Container>
          <SectionHeaderV2
            badge="Our Faculty Experts"
            title="Learn from India's Top Educators"
            viewAllHref="/faculty"
            viewAllLabel="View All Faculty"
            align="left"
          />
          <Carousel>
            {faculty.map((member) => (
              <div
                key={member.id}
                className="snap-start shrink-0 w-[210px] sm:w-[220px] md:w-[230px]"
              >
                <FacultyExpertCard faculty={member} className="w-full" />
              </div>
            ))}
          </Carousel>
          <div className="mt-5 flex justify-center md:hidden">
            <Link
              href="/faculty"
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline"
            >
              View All Faculty
            </Link>
          </div>
        </Container>
      </section>

      <AdvisorsSection />

      <CultureSection />

      <CTABandV2Decorative
        title="Be a Part of Our Mission"
        subtitle="Join thousands of successful students who trusted Rodha for their exam preparation journey."
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/meet the team/Cta-left.png"
        primaryAction={{ label: "Explore Programs", href: "/category/cat" }}
        secondaryAction={{ label: "Book Free Counselling", href: "/contact" }}
      />
    </>
  );
}
