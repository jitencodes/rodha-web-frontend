import type { Metadata } from "next";
import { ContactHeroSection } from "@/components/sections/contact/ContactHeroSection";
import { ContactInfoStrip } from "@/components/sections/contact/ContactInfoStrip";
import { ContactOfficeSupportSection } from "@/components/sections/contact/ContactOfficeSupportSection";
import { ContactCtaSection } from "@/components/sections/contact/ContactCtaSection";
import { ContactFaqSection } from "@/components/sections/contact/ContactFaqSection";
import { ContactBuddyCtaSection } from "@/components/sections/contact/ContactBuddyCtaSection";
import { CONTACT_FAQS } from "@/data/contact";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact Us — Rodha",
  description:
    "Get in touch with Rodha for course inquiries, counselling sessions, or any questions about our exam preparation programs.",
};

const contactBreadcrumb = [
  { label: "Home", href: "/" },
  { label: "Contact Us", href: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(contactBreadcrumb)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(CONTACT_FAQS)) }}
      />
      <ContactHeroSection />
      <ContactInfoStrip />
      <ContactOfficeSupportSection />
      <ContactCtaSection />
      <ContactFaqSection />
      <ContactBuddyCtaSection />
    </>
  );
}
