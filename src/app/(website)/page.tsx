import { HomePage } from "@/components/pages/HomePage";
import { faqPageJsonLd } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { getHome } from "@/lib/api/modules/home/service";

export const metadata = buildPageMetadata({
  title: "Rodha — Expert Mentorship. Proven Strategies. Real Results.",
  description:
    "India's trusted platform for MBA (CAT + GDPI), Integrated Programs, Law, Banking & Government Exams, and Skill House. Expert mentorship, proven strategies, and real results.",
  path: "/",
});

export default async function Page() {
  const home = await getHome();
  const faqs = home?.faqs ?? [];

  return (
    <>
      {faqs.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageJsonLd(faqs)),
          }}
        />
      ) : null}
      <HomePage home={home} />
    </>
  );
}
