import { ContactHeroSection } from "@/components/sections/contact/ContactHeroSection";
import { ContactInfoStrip } from "@/components/sections/contact/ContactInfoStrip";
import { ContactOfficeSupportSection } from "@/components/sections/contact/ContactOfficeSupportSection";
import { ContactCtaSection } from "@/components/sections/contact/ContactCtaSection";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact Us — Rodha",
  description:
    "Get in touch with Rodha for course inquiries, counselling sessions, or any questions about our exam preparation programs.",
  path: "/contact",
});

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
      <ContactHeroSection />
      <ContactInfoStrip />
      <ContactOfficeSupportSection />
      <ContactCtaSection />
      {/* <ContactBuddyCtaSection /> */}
      {/* <ContactFaqSection /> */}
    </>
  );
}
