import { HomePageBackground } from "@/components/sections/home/HomePageBackground";
import { HomeHeroSection } from "@/components/sections/home/HomeHeroSection";
import { HomeCategoriesSection } from "@/components/sections/home/HomeCategoriesSection";
import { HomeResultsSection } from "@/components/sections/home/HomeResultsSection";
import { CTABandV2 } from "../sections/CTABandV2";
import { HomeFAQSection } from "../sections/home/HomeFaqSection";
import type { HomePageViewModel } from "@/lib/api/modules/home/types";

interface HomePageProps {
  home?: HomePageViewModel | null;
}

export function HomePage({ home = null }: HomePageProps) {
  return (
    <HomePageBackground>
      <HomeHeroSection banner={home?.banner ?? null} />

      <HomeCategoriesSection categories={home?.categories ?? []} />

      <HomeResultsSection resultBanners={home?.resultBanners ?? []} />

      <CTABandV2
        title="Still confused? Talk to our mentors or our team for free."
        subtitle="Take the first step towards your success. We'll be with you, all the way."
        backgroundImage="/assets/images/background/cta background image.JPG"
        decorativeImage="/assets/images/about us/award-to-boy.png"
        primaryAction={{ label: "Book Free Counselling", href: "/contact" }}
        secondaryAction={{ label: "Explore Courses", href: "/category/cat" }}
        className="reveal-child reveal-delay-1"
      />

      <HomeFAQSection faqs={home?.faqs ?? []} />
    </HomePageBackground>
  );
}
