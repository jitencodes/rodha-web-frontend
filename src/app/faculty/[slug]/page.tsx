import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacultyDetailHeroSection } from "@/components/sections/FacultyDetailHeroSection";
import { FacultyInfoCardsSection } from "@/components/sections/FacultyInfoCardsSection";
import { FacultyCoursesSection } from "@/components/sections/FacultyCoursesSection";
import { FacultyAchievementsPublicationsSection } from "@/components/sections/FacultyAchievementsPublicationsSection";
import { FacultyReviewsVideosSection } from "@/components/sections/FacultyReviewsVideosSection";
import { FacultyResultsSection } from "@/components/sections/FacultyResultsSection";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { faculty, getFacultyBySlug } from "@/data/faculty";
import { getCategoryPath } from "@/lib/constants";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/structured-data";

interface FacultyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return faculty.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: FacultyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getFacultyBySlug(slug);

  if (!member) {
    return { title: "Faculty — Rodha" };
  }

  return {
    title: `${member.name} — Faculty — Rodha`,
    description: member.about ?? member.bio,
  };
}

export default async function FacultyDetailPage({ params }: FacultyDetailPageProps) {
  const { slug } = await params;
  const member = getFacultyBySlug(slug);

  if (!member) {
    notFound();
  }

  const categoryHref = getCategoryPath(member.categories[0] ?? "mba");
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Faculty", href: "/faculty" },
    { label: member.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personJsonLd({
              name: member.name,
              description: member.about ?? member.bio,
              image: member.image,
              url: `/faculty/${member.slug}`,
              jobTitle: member.designation ?? member.title,
            })
          ),
        }}
      />

      <FacultyDetailHeroSection faculty={member} />

      <FacultyInfoCardsSection faculty={member} />

      <FacultyCoursesSection faculty={member} />

      <FacultyAchievementsPublicationsSection faculty={member} />

      <FacultyReviewsVideosSection faculty={member} />

      <FacultyResultsSection faculty={member} />

      <RevealGroup>
        <CTABandV2Decorative
          title="Take the Next Step Towards Success"
          subtitle="Explore courses, book a free demo, or ask Rodha Buddy — your AI study companion."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/award.png"
          primaryAction={{ label: "Explore Courses →", href: categoryHref }}
          secondaryAction={{ label: "Book a Demo →", href: "/contact" }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
