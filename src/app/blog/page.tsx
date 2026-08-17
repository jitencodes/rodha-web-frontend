import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";

export const metadata: Metadata = {
  title: "Blog — Rodha",
  description: "Insights, tips, and strategies for MBA, Integrated Programs, Law, Banking & Government, and Skill House from Rodha's expert faculty.",
};

export default function BlogPage() {
  return (
    <section className="home-section-spacing-lg bg-section-white home-on-light">
      <Container>
        <SectionHeaderV2
          title="Blog & Insights"
          subtitle="Tips, strategies, and exam insights from our expert faculty."
        />
        <p className="home-light-muted text-center">Blog posts coming soon...</p>
      </Container>
    </section>
  );
}
