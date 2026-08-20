import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { EXTERNAL_URLS } from "@/lib/constants";
import { faqPageJsonLd } from "@/lib/structured-data";
import { FAQ_DATA } from "@/data/faq";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ — Rodha",
  description:
    "Frequently asked questions about Rodha's courses, pricing, mentorship programs, test series, and exam preparation approach.",
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQ_DATA)) }}
      />
      <section className="home-section-spacing-lg bg-section-white home-on-light pt-8 md:pt-10">
        <Container>
          <SectionHeaderV2
            badge="GOOD TO KNOW"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our programs, payments, mentorship, and test series."
            align="center"
            className="mx-auto max-w-3xl"
          />

          <div className="mt-8 md:mt-10">
            <FAQClient />
          </div>
        </Container>
      </section>

      <CTABandV2Decorative
        title="Still Have Questions?"
        subtitle="Our team is here to help you find the right program for your goals."
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/about us/award-to-boy.png"
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "Ask Rodha Buddy", href: EXTERNAL_URLS.rodhaBuddy }}
      />
    </>
  );
}
