import type { Metadata } from "next";
import { FacultyHeroSection } from "@/components/sections/FacultyHeroSection";
import { FacultyWhySection } from "@/components/sections/FacultyWhySection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { faculty } from "@/data/faculty";
import { FacultyListingClient } from "./FacultyListingClient";

export const metadata: Metadata = {
  title: "Our Faculty — Rodha",
  description:
    "Meet Rodha's expert faculty — IIM and NLU alumni mentors across MBA, Law, Banking, IPMAT, and Skill House programs.",
};

export default function FacultyPage() {
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

      <FacultyHeroSection />

      <FacultyListingClient faculty={faculty} />

      <FacultyWhySection />

      <RevealGroup>
        <CTABandV2Decorative
          title="Ready to Begin Your Journey?"
          subtitle="Book a Demo Class or Explore our Courses."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/award.png"
          primaryAction={{ label: "Book a Demo Class", href: "/contact" }}
          secondaryAction={{ label: "Explore Courses", href: "/category/cat" }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
