import { HomePage } from "@/components/pages/HomePage";
import { FAQ_DATA_HOME } from "@/data/faq";
import { faqPageJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Rodha — Expert Mentorship. Proven Strategies. Real Results.",
  description:
    "India's trusted platform for MBA (CAT + GDPI), Integrated Programs, Law, Banking & Government Exams, and Skill House. Expert mentorship, proven strategies, and real results.",
  path: "/",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(FAQ_DATA_HOME)),
        }}
      />
      <HomePage />
    </>
  );
}
