import { HomePageBackground } from "@/components/sections/home/HomePageBackground";

import { HomePageBodyTheme } from "@/components/sections/home/HomePageBodyTheme";

import { HomePageGradientAnchors } from "@/components/sections/home/HomePageGradientAnchors";

import { HomeHeroSection } from "@/components/sections/home/HomeHeroSection";

import { HomeCategoriesSection } from "@/components/sections/home/HomeCategoriesSection";

import { HomeImpactSection } from "@/components/sections/home/HomeImpactSection";

import { HomeResultsSection } from "@/components/sections/home/HomeResultsSection";

import { HomeAppPromotionSection } from "@/components/sections/home/HomeAppPromotionSection";

import { CTABand } from "@/components/sections/CTABand";

import { RevealGroup } from "@/components/ui/RevealGroup";
import { DynamicBackground } from "../layout/DynamicBackground";
import { CTABandV2 } from "../sections/CTABandV2";
import { HomeFAQSection } from "../sections/home/HomeFaqSection";



export function HomePage() {

  return (

    <HomePageBackground>
      {/* <DynamicBackground/> */}
      <HomePageBodyTheme />

      {/* <HomePageGradientAnchors /> */}

      <HomeHeroSection />

      <HomeCategoriesSection />

      {/* <HomeImpactSection /> */}

      <HomeResultsSection />

      {/* <HomeAppPromotionSection /> */}


        <CTABandV2

          title="Still confused? Talk to our mentors or our team for free."

          // titleAccent="Unstoppable You."

          subtitle="Take the first step towards your success. We'll be with you, all the way."

          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/award.png"
          primaryAction={{ label: "Book Free Counselling", href: "/contact" }}

          secondaryAction={{ label: "Explore Courses", href: "/mba" }}

          className="reveal-child reveal-delay-1"

        />

      <HomeFAQSection/>

    </HomePageBackground>

  );

}

