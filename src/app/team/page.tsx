import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TeamHeroSection } from "@/components/sections/TeamHeroSection";
import { AdvisorsSection } from "@/components/sections/AdvisorsSection";
import { CultureSection } from "@/components/sections/CultureSection";
import { CTABand } from "@/components/sections/CTABand";
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
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Meet the Team" },
          ]}
        />
      </Container>

      <TeamHeroSection />

      <section className="section-spacing bg-bg-secondary">
        <Container>
          <SectionHeader
            label="Leadership Team"
            title="Guided by Vision. Driven by Purpose."
            description={LEADERSHIP_INTRO}
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

      <section className="section-spacing bg-bg-secondary">
        <Container>
          <SectionHeader
            label="Our Faculty Experts"
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
            <Link href="/faculty" className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline">
              View All Faculty
            </Link>
          </div>
        </Container>
      </section>

      <AdvisorsSection />

      <CultureSection />

      <section className="bg-bg-secondary">
        <CTABand
          title="Be a Part of Our Mission"
          subtitle="Join thousands of successful students who trusted Rodha for their exam preparation journey."
          primaryAction={{ label: "Explore Programs", href: "/cat" }}
          secondaryAction={{ label: "Book Free Counselling", href: "/contact" }}
          decorativeImage="/assets/images/meet the team/Cta-left.png"
        />
      </section>
    </>
  );
}
