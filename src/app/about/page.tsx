import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About Us — Rodha",
  description: "Learn about Rodha's mission to democratize competitive exam preparation through expert mentorship and proven strategies.",
};

export default function AboutPage() {
  return (
    <section className="home-section-spacing-lg bg-section-white home-on-light">
      <Container>
        <h1 className="home-light-heading text-h1 md:text-hero font-bold">About <span className="text-gradient-orange">Rodha</span></h1>
        <p className="home-light-body mt-4 text-body-lg max-w-2xl">
          Our mission is to make quality competitive exam preparation accessible to every aspirant across India.
        </p>
        <p className="home-light-muted mt-8">Full content coming soon...</p>
      </Container>
    </section>
  );
}
