import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CategoryHeroFeature, CategoryQuickStat } from "@/lib/types";
import { CounsellingCtaAction } from "../../CounsellingCtaAction";
import { HeroVideoEmbed } from "../HeroVideoEmbed";
import { HomeHeroShell } from "../HomeHeroShell";
import { Container } from "@/components/layout/Container";
import Typewritter from "@/components/Typewriter";

interface CategoryHeroCta {
  label: string;
  href: string;
  external?: boolean;
}

interface CategoryHeroSectionV2Props {
  categoryName: string;
  headline: ReactNode;
  subtitle: string;
  heroImageSrc: string;
  heroImageAlt: string;
  features: CategoryHeroFeature[];
  quickStats: CategoryQuickStat[];
  primaryCta: CategoryHeroCta;
  secondaryCta: CategoryHeroCta;
  className?: string;
}

function HeroCtaLink({
  cta,
  variant,
}: {
  cta: CategoryHeroCta;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body px-7 py-3.5"
      : "btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline text-body px-7 py-3.5";

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export function CategoryHeroSectionV2({
  categoryName,
  headline,
  subtitle,
  heroImageSrc,
  heroImageAlt,
  features,
  quickStats,
  primaryCta,
  secondaryCta,
  className,
}: CategoryHeroSectionV2Props) {
/** Shared max width for title, form, and supporting copy */
const HERO_CONTENT_MAX = "max-w-[26rem] sm:max-w-[34rem] h-full";
  return (
    <HomeHeroShell>
      <Container data-home-zone="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-center min-h-[426px]">
          <div className={`lg:col-span-6 min-h-0 overflow-visible ${HERO_CONTENT_MAX} lg:max-w-none`}>
            <div className={HERO_CONTENT_MAX}>
            <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">CAT 2026 · MBA Entrance</p>

              <h1 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[3rem] font-bold leading-[1.4] tracking-tight">
              You're one bridge away from your Dream  <br />  {" "}
                <span className="text-orange-500 glow-text-orange h-4">
                  <Typewritter words={["an IIM", "an NLU.", "a Government Job."]} />
                </span>
              </h1>

              <p className="mt-2 lg:mt-5 mb-8 text-body-lg text-white leading-relaxed">
              Join India’s most promising online coaching for MBA entrance, IPMAT, CLAT and SSC exam. 
              </p>
              <div className="mt-3 flex flex-col sm:flex-row items-start gap-3">
              <HeroCtaLink cta={primaryCta} variant="primary" />
              <CounsellingCtaAction
                action={{ label: "Book Free Counselling", href: "/contact" }}
                className="btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline text-body px-7 py-3.5"
              />
            </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center min-h-0">
            <div className="flex w-full flex-col gap-2.5 sm:gap-3">
              <HeroVideoEmbed />
              {/* <HeroFloatingStats /> */}
            </div>
          </div>
        </div>
        <div className="bg-[#F06B23]/80 backdrop-blur-[12px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] flex gap-5 p-2 lg:p-6 rounded-2xl lg:rounded-[22px] sm:absolute -bottom-10 lg:-bottom-17 translate-y-1/2 left-1/2 sm:left-auto w-fit mx-auto">          
          <div className="flex gap-4.5">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_9_2600)">
              <path d="M12.4183 27.2764C15.0277 27.2764 17.1472 25.1527 17.1472 22.5476C17.1472 19.9424 15.0277 17.8187 12.4183 17.8187C9.80901 17.8187 7.68945 19.9382 7.68945 22.5476C7.68945 25.1569 9.81323 27.2764 12.4183 27.2764ZM12.4183 19.8073C13.9299 19.8073 15.1586 21.036 15.1586 22.5476C15.1586 24.0591 13.9299 25.2878 12.4183 25.2878C10.9068 25.2878 9.67812 24.0591 9.67812 22.5476C9.67812 21.036 10.9068 19.8073 12.4183 19.8073Z" fill="#552000"/>
              <path d="M6.98849 34.2347C6.98849 32.2038 8.63938 30.5487 10.6745 30.5487H14.1578C14.2634 30.5487 14.3647 30.5529 14.4661 30.5613C14.7532 30.5867 15.0403 30.4896 15.2514 30.2953C15.4541 30.1096 15.5681 29.852 15.5681 29.5733C15.5681 29.0667 15.1796 28.6318 14.6814 28.5811C14.5083 28.5642 14.3309 28.5558 14.1536 28.5558H10.6703C7.54161 28.5558 4.99561 31.1018 4.99561 34.2305V34.64H6.98427V34.2305L6.98849 34.2347Z" fill="#552000"/>
              <path d="M15.9229 34.6442H17.9115V32.1953C17.9115 29.8984 19.782 28.028 22.0789 28.028H25.9211C28.218 28.028 30.0884 29.8984 30.0884 32.1953V34.6442H32.0771V32.1953C32.0771 30.118 31.0342 28.1926 29.2862 27.0484C28.2813 26.3898 27.116 26.0393 25.9211 26.0393H22.0789C20.1789 26.0393 18.4097 26.9049 17.2317 28.4122C16.3746 29.5058 15.9229 30.8146 15.9229 32.1953V34.6442Z" fill="#552000"/>
              <path d="M37.3254 28.56H33.8421C33.745 28.56 33.6478 28.56 33.5507 28.5684C33.0145 28.598 32.5923 29.0371 32.5923 29.5649C32.5923 29.8393 32.7063 30.1011 32.9047 30.2911C33.1032 30.4769 33.365 30.574 33.6394 30.5571C33.707 30.5529 33.7745 30.5529 33.8421 30.5529H37.3254C39.3563 30.5529 41.0114 32.208 41.0114 34.2389V34.6484H43.0001V34.2389C43.0001 31.1102 40.4541 28.5642 37.3254 28.5642V28.56Z" fill="#552000"/>
              <path d="M35.5814 27.2764C38.1908 27.2764 40.3103 25.1527 40.3103 22.5476C40.3103 19.9424 38.1865 17.8187 35.5814 17.8187C32.9763 17.8187 30.8525 19.9382 30.8525 22.5476C30.8525 25.1569 32.9763 27.2764 35.5814 27.2764ZM35.5814 19.8073C37.093 19.8073 38.3216 21.036 38.3216 22.5476C38.3216 24.0591 37.093 25.2878 35.5814 25.2878C34.0699 25.2878 32.8412 24.0591 32.8412 22.5476C32.8412 21.036 34.0699 19.8073 35.5814 19.8073Z" fill="#552000"/>
              <path d="M23.9999 25.254C27.2806 25.254 29.949 22.5856 29.949 19.3049C29.949 16.0242 27.2806 13.3558 23.9999 13.3558C20.7192 13.3558 18.0508 16.0242 18.0508 19.3049C18.0508 22.5856 20.7192 25.254 23.9999 25.254ZM23.9999 15.3444C26.1828 15.3444 27.9603 17.122 27.9603 19.3049C27.9603 21.4878 26.1828 23.2653 23.9999 23.2653C21.817 23.2653 20.0394 21.4878 20.0394 19.3049C20.0394 17.122 21.817 15.3444 23.9999 15.3444Z" fill="#552000"/>
              </g>
              <defs>
              <clipPath id="clip0_9_2600">
              <rect width="38" height="21.2884" fill="white" transform="translate(5 13.3558)"/>
              </clipPath>
              </defs>
            </svg>
            <div className="">
              <p className="text-lg md:text-2xl font-semibold font-montserrat">10,000+</p>
              <p className="text-sm">Selections</p>
            </div>
          </div>
          <div className="flex gap-4.5 items-center">
          <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2811 21.7463C11.2962 21.7658 11.3076 21.7891 11.3227 21.8085L13.8349 20.3213C14.767 19.766 15.6764 19.964 16.3357 20.5115C17.4951 21.4745 17.7377 23.5054 16.1614 24.4412L14.6192 25.3537C14.5814 25.4042 14.551 25.4547 14.5169 25.5051C15.4945 26.4409 16.5479 27.2875 17.677 28.033C17.9839 28.2349 18.3363 28.231 18.6357 28.0136C19.689 27.2486 20.6742 26.3982 21.5911 25.4624C21.5229 25.3653 21.4509 25.2644 21.379 25.1634L19.8368 24.2509C18.2568 23.3151 18.4993 21.2843 19.6625 20.3213C20.3218 19.7737 21.2274 19.5757 22.1633 20.131L24.7209 21.6454C24.7361 21.6182 24.7512 21.5871 24.7702 21.56C27.2785 17.84 28.976 13.5531 30.0597 9.13807C30.1658 8.70317 29.9536 8.27215 29.5482 8.10906C25.5621 6.4976 22.0004 4.86671 18.7342 1.88453C18.4045 1.58554 17.9423 1.58165 17.6126 1.869C14.5283 4.52112 10.4361 6.41993 6.67355 8.11683C6.30222 8.2838 6.10898 8.66046 6.1734 9.06818C6.53715 11.297 7.16234 13.5686 8.04899 15.7664C8.89774 17.8711 9.9852 19.9058 11.2886 21.7541H11.2849L11.2811 21.7463ZM9.92837 22.6356C9.18571 21.5794 8.51883 20.4766 7.92395 19.3388L3.2255 24.4295C3.17245 24.4917 3.10803 24.546 3.03225 24.5887L1.20592 25.6682C0.819433 25.8973 0.326853 25.7614 0.107087 25.3692C-0.112679 24.977 0.0161491 24.4722 0.398846 24.2431L2.12287 23.2219L7.15098 17.7701C5.90816 15.0597 5.04046 12.1785 4.5782 9.32057C4.38874 8.17119 4.97605 7.06452 6.01425 6.59467C9.59493 4.97932 13.6417 3.10769 16.5668 0.591474C17.5065 -0.216201 18.8782 -0.192902 19.7951 0.638071C22.9022 3.47658 26.3123 5.02204 30.1241 6.55972C31.2798 7.02569 31.9164 8.29157 31.6132 9.52638C30.9236 12.3532 29.9991 15.0558 28.8396 17.5721L33.8677 23.0239L35.5918 24.0451C35.9783 24.2742 36.1071 24.779 35.8835 25.1712C35.66 25.5673 35.1674 25.6993 34.7847 25.4702L32.9584 24.3907C32.8826 24.348 32.8182 24.2936 32.7651 24.2315L28.0705 19.1408C27.468 20.3057 26.8125 21.4124 26.1039 22.4608L26.8314 22.8918C27.2179 23.1209 27.3467 23.6257 27.1232 24.0179C26.8996 24.414 26.4108 24.546 26.0281 24.3169L21.3524 21.5522C20.8485 21.2532 20.4089 21.7269 20.337 22.189C20.3029 22.422 20.3824 22.6705 20.6401 22.8219L22.33 23.8199C22.4323 23.882 22.5157 23.9636 22.5801 24.0568L23.2924 25.0858C23.7092 25.7109 24.0427 26.2546 24.3344 26.7283C24.7512 27.4039 25.2703 28.3087 25.8425 28.6892C26.426 29.0775 27.3733 29.1669 28.1841 29.2096C28.6312 29.2329 29.1276 29.2406 29.6808 29.2406C29.8286 29.2406 29.965 29.2795 30.0862 29.3494L35.0272 32.2733C35.4137 32.5024 35.5425 33.0072 35.319 33.3994C35.0954 33.7954 34.6028 33.9275 34.2201 33.6984L29.4648 30.8832C28.9495 30.8832 28.5024 30.8715 28.1084 30.8521C26.9375 30.7939 25.8501 30.6541 24.9672 30.0677C24.1033 29.493 23.5615 28.5572 22.9704 27.602C22.8264 27.369 22.6672 27.1166 22.4967 26.8409C21.5798 27.7495 20.5946 28.596 19.5564 29.3494C18.7228 29.9512 17.6505 29.9784 16.7942 29.4115C15.6574 28.6582 14.5814 27.8039 13.5848 26.8681C13.1567 27.536 12.6754 28.3553 12.2852 28.9183C11.444 30.1376 10.6369 30.6929 9.11751 30.922C8.76133 30.9764 8.35211 31.0113 7.86711 31.0385C7.47684 31.0579 7.02594 31.0657 6.51062 31.0695L1.75533 33.8848C1.36885 34.1139 0.876269 33.978 0.656503 33.5858C0.436736 33.1936 0.565565 32.6888 0.948262 32.4597L5.88922 29.5396C6.00668 29.4697 6.14687 29.427 6.29086 29.427C7.15098 29.427 8.12477 29.4076 8.88258 29.295C9.9511 29.1319 10.3717 28.8329 10.9666 27.9748C11.1788 27.6641 11.3947 27.3185 11.641 26.9186C12.0844 26.2041 12.6262 25.3226 13.3992 24.247C13.4598 24.1538 13.5469 24.0723 13.6492 24.0102L15.3392 23.0122C15.8469 22.7132 15.6574 22.0764 15.3089 21.7852C15.1346 21.6376 14.8845 21.5871 14.6268 21.7425L9.9511 24.5072C9.56462 24.7363 9.07583 24.6004 8.85227 24.2082C8.62872 23.816 8.76512 23.3112 9.14782 23.0821L9.917 22.6278L9.92837 22.6356ZM21.3373 10.901C21.6556 10.5787 22.1633 10.5787 22.4778 10.901C22.7923 11.2233 22.7923 11.7475 22.4778 12.0698L17.5406 17.1294C17.2148 17.4633 16.6957 17.4556 16.3584 17.0828L13.7553 14.3918C13.4446 14.0695 13.4446 13.5492 13.7591 13.2269C14.0736 12.9085 14.5851 12.9085 14.8958 13.2269L16.9723 15.3743L21.3373 10.8971V10.901Z" fill="#552000"/>
          </svg>
            <div className="">
              <p className="text-lg md:text-2xl font-semibold font-montserrat">5,00,000+</p>
              <p className="text-sm">Students Trusted</p>
            </div>
          </div>
      </div>
      <div className="h-8 sm:h-0"></div>
      </Container>
    </HomeHeroShell>
  )
  return (
    
    <section id="site-hero" className={cn("relative", className)}>
      {/* <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 78% 40%, rgba(249,115,22,0.16) 0%, transparent 70%)",
        }}
      /> */}
      <div className="bg-[#F06B23]/80 backdrop-blur-[12px] z-10 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] flex gap-5 p-2 lg:p-6 rounded-2xl lg:rounded-[22px] sm:absolute -bottom-10 lg:-bottom-17 translate-y-1/2 left-1/2 sm:left-auto w-fit mx-auto">          
            <div className="flex gap-4.5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_9_2600)">
                <path d="M12.4183 27.2764C15.0277 27.2764 17.1472 25.1527 17.1472 22.5476C17.1472 19.9424 15.0277 17.8187 12.4183 17.8187C9.80901 17.8187 7.68945 19.9382 7.68945 22.5476C7.68945 25.1569 9.81323 27.2764 12.4183 27.2764ZM12.4183 19.8073C13.9299 19.8073 15.1586 21.036 15.1586 22.5476C15.1586 24.0591 13.9299 25.2878 12.4183 25.2878C10.9068 25.2878 9.67812 24.0591 9.67812 22.5476C9.67812 21.036 10.9068 19.8073 12.4183 19.8073Z" fill="#552000"/>
                <path d="M6.98849 34.2347C6.98849 32.2038 8.63938 30.5487 10.6745 30.5487H14.1578C14.2634 30.5487 14.3647 30.5529 14.4661 30.5613C14.7532 30.5867 15.0403 30.4896 15.2514 30.2953C15.4541 30.1096 15.5681 29.852 15.5681 29.5733C15.5681 29.0667 15.1796 28.6318 14.6814 28.5811C14.5083 28.5642 14.3309 28.5558 14.1536 28.5558H10.6703C7.54161 28.5558 4.99561 31.1018 4.99561 34.2305V34.64H6.98427V34.2305L6.98849 34.2347Z" fill="#552000"/>
                <path d="M15.9229 34.6442H17.9115V32.1953C17.9115 29.8984 19.782 28.028 22.0789 28.028H25.9211C28.218 28.028 30.0884 29.8984 30.0884 32.1953V34.6442H32.0771V32.1953C32.0771 30.118 31.0342 28.1926 29.2862 27.0484C28.2813 26.3898 27.116 26.0393 25.9211 26.0393H22.0789C20.1789 26.0393 18.4097 26.9049 17.2317 28.4122C16.3746 29.5058 15.9229 30.8146 15.9229 32.1953V34.6442Z" fill="#552000"/>
                <path d="M37.3254 28.56H33.8421C33.745 28.56 33.6478 28.56 33.5507 28.5684C33.0145 28.598 32.5923 29.0371 32.5923 29.5649C32.5923 29.8393 32.7063 30.1011 32.9047 30.2911C33.1032 30.4769 33.365 30.574 33.6394 30.5571C33.707 30.5529 33.7745 30.5529 33.8421 30.5529H37.3254C39.3563 30.5529 41.0114 32.208 41.0114 34.2389V34.6484H43.0001V34.2389C43.0001 31.1102 40.4541 28.5642 37.3254 28.5642V28.56Z" fill="#552000"/>
                <path d="M35.5814 27.2764C38.1908 27.2764 40.3103 25.1527 40.3103 22.5476C40.3103 19.9424 38.1865 17.8187 35.5814 17.8187C32.9763 17.8187 30.8525 19.9382 30.8525 22.5476C30.8525 25.1569 32.9763 27.2764 35.5814 27.2764ZM35.5814 19.8073C37.093 19.8073 38.3216 21.036 38.3216 22.5476C38.3216 24.0591 37.093 25.2878 35.5814 25.2878C34.0699 25.2878 32.8412 24.0591 32.8412 22.5476C32.8412 21.036 34.0699 19.8073 35.5814 19.8073Z" fill="#552000"/>
                <path d="M23.9999 25.254C27.2806 25.254 29.949 22.5856 29.949 19.3049C29.949 16.0242 27.2806 13.3558 23.9999 13.3558C20.7192 13.3558 18.0508 16.0242 18.0508 19.3049C18.0508 22.5856 20.7192 25.254 23.9999 25.254ZM23.9999 15.3444C26.1828 15.3444 27.9603 17.122 27.9603 19.3049C27.9603 21.4878 26.1828 23.2653 23.9999 23.2653C21.817 23.2653 20.0394 21.4878 20.0394 19.3049C20.0394 17.122 21.817 15.3444 23.9999 15.3444Z" fill="#552000"/>
                </g>
                <defs>
                <clipPath id="clip0_9_2600">
                <rect width="38" height="21.2884" fill="white" transform="translate(5 13.3558)"/>
                </clipPath>
                </defs>
              </svg>
              <div className="">
                <p className="text-lg md:text-2xl font-semibold font-montserrat">10,000+</p>
                <p className="text-sm">Selections</p>
              </div>
            </div>
            <div className="flex gap-4.5 items-center">
            <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2811 21.7463C11.2962 21.7658 11.3076 21.7891 11.3227 21.8085L13.8349 20.3213C14.767 19.766 15.6764 19.964 16.3357 20.5115C17.4951 21.4745 17.7377 23.5054 16.1614 24.4412L14.6192 25.3537C14.5814 25.4042 14.551 25.4547 14.5169 25.5051C15.4945 26.4409 16.5479 27.2875 17.677 28.033C17.9839 28.2349 18.3363 28.231 18.6357 28.0136C19.689 27.2486 20.6742 26.3982 21.5911 25.4624C21.5229 25.3653 21.4509 25.2644 21.379 25.1634L19.8368 24.2509C18.2568 23.3151 18.4993 21.2843 19.6625 20.3213C20.3218 19.7737 21.2274 19.5757 22.1633 20.131L24.7209 21.6454C24.7361 21.6182 24.7512 21.5871 24.7702 21.56C27.2785 17.84 28.976 13.5531 30.0597 9.13807C30.1658 8.70317 29.9536 8.27215 29.5482 8.10906C25.5621 6.4976 22.0004 4.86671 18.7342 1.88453C18.4045 1.58554 17.9423 1.58165 17.6126 1.869C14.5283 4.52112 10.4361 6.41993 6.67355 8.11683C6.30222 8.2838 6.10898 8.66046 6.1734 9.06818C6.53715 11.297 7.16234 13.5686 8.04899 15.7664C8.89774 17.8711 9.9852 19.9058 11.2886 21.7541H11.2849L11.2811 21.7463ZM9.92837 22.6356C9.18571 21.5794 8.51883 20.4766 7.92395 19.3388L3.2255 24.4295C3.17245 24.4917 3.10803 24.546 3.03225 24.5887L1.20592 25.6682C0.819433 25.8973 0.326853 25.7614 0.107087 25.3692C-0.112679 24.977 0.0161491 24.4722 0.398846 24.2431L2.12287 23.2219L7.15098 17.7701C5.90816 15.0597 5.04046 12.1785 4.5782 9.32057C4.38874 8.17119 4.97605 7.06452 6.01425 6.59467C9.59493 4.97932 13.6417 3.10769 16.5668 0.591474C17.5065 -0.216201 18.8782 -0.192902 19.7951 0.638071C22.9022 3.47658 26.3123 5.02204 30.1241 6.55972C31.2798 7.02569 31.9164 8.29157 31.6132 9.52638C30.9236 12.3532 29.9991 15.0558 28.8396 17.5721L33.8677 23.0239L35.5918 24.0451C35.9783 24.2742 36.1071 24.779 35.8835 25.1712C35.66 25.5673 35.1674 25.6993 34.7847 25.4702L32.9584 24.3907C32.8826 24.348 32.8182 24.2936 32.7651 24.2315L28.0705 19.1408C27.468 20.3057 26.8125 21.4124 26.1039 22.4608L26.8314 22.8918C27.2179 23.1209 27.3467 23.6257 27.1232 24.0179C26.8996 24.414 26.4108 24.546 26.0281 24.3169L21.3524 21.5522C20.8485 21.2532 20.4089 21.7269 20.337 22.189C20.3029 22.422 20.3824 22.6705 20.6401 22.8219L22.33 23.8199C22.4323 23.882 22.5157 23.9636 22.5801 24.0568L23.2924 25.0858C23.7092 25.7109 24.0427 26.2546 24.3344 26.7283C24.7512 27.4039 25.2703 28.3087 25.8425 28.6892C26.426 29.0775 27.3733 29.1669 28.1841 29.2096C28.6312 29.2329 29.1276 29.2406 29.6808 29.2406C29.8286 29.2406 29.965 29.2795 30.0862 29.3494L35.0272 32.2733C35.4137 32.5024 35.5425 33.0072 35.319 33.3994C35.0954 33.7954 34.6028 33.9275 34.2201 33.6984L29.4648 30.8832C28.9495 30.8832 28.5024 30.8715 28.1084 30.8521C26.9375 30.7939 25.8501 30.6541 24.9672 30.0677C24.1033 29.493 23.5615 28.5572 22.9704 27.602C22.8264 27.369 22.6672 27.1166 22.4967 26.8409C21.5798 27.7495 20.5946 28.596 19.5564 29.3494C18.7228 29.9512 17.6505 29.9784 16.7942 29.4115C15.6574 28.6582 14.5814 27.8039 13.5848 26.8681C13.1567 27.536 12.6754 28.3553 12.2852 28.9183C11.444 30.1376 10.6369 30.6929 9.11751 30.922C8.76133 30.9764 8.35211 31.0113 7.86711 31.0385C7.47684 31.0579 7.02594 31.0657 6.51062 31.0695L1.75533 33.8848C1.36885 34.1139 0.876269 33.978 0.656503 33.5858C0.436736 33.1936 0.565565 32.6888 0.948262 32.4597L5.88922 29.5396C6.00668 29.4697 6.14687 29.427 6.29086 29.427C7.15098 29.427 8.12477 29.4076 8.88258 29.295C9.9511 29.1319 10.3717 28.8329 10.9666 27.9748C11.1788 27.6641 11.3947 27.3185 11.641 26.9186C12.0844 26.2041 12.6262 25.3226 13.3992 24.247C13.4598 24.1538 13.5469 24.0723 13.6492 24.0102L15.3392 23.0122C15.8469 22.7132 15.6574 22.0764 15.3089 21.7852C15.1346 21.6376 14.8845 21.5871 14.6268 21.7425L9.9511 24.5072C9.56462 24.7363 9.07583 24.6004 8.85227 24.2082C8.62872 23.816 8.76512 23.3112 9.14782 23.0821L9.917 22.6278L9.92837 22.6356ZM21.3373 10.901C21.6556 10.5787 22.1633 10.5787 22.4778 10.901C22.7923 11.2233 22.7923 11.7475 22.4778 12.0698L17.5406 17.1294C17.2148 17.4633 16.6957 17.4556 16.3584 17.0828L13.7553 14.3918C13.4446 14.0695 13.4446 13.5492 13.7591 13.2269C14.0736 12.9085 14.5851 12.9085 14.8958 13.2269L16.9723 15.3743L21.3373 10.8971V10.901Z" fill="#552000"/>
            </svg>
              <div className="">
                <p className="text-lg md:text-2xl font-semibold font-montserrat">5,00,000+</p>
                <p className="text-sm">Students Trusted</p>
              </div>
            </div>
        </div>

      <div className="container-rodha relative z-10 pt-2 md:pt-4 lg:pt-6 pb-10 md:pb-12 lg:pb-14 min-h-[426px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">CAT 2026 · MBA Entrance</p>
            <h1 className="text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              {headline}
            </h1>

            <p className="mt-5 text-body-lg text-text-secondary max-w-xl leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
              <HeroCtaLink cta={primaryCta} variant="primary" />
              <CounsellingCtaAction
                action={{ label: "Book Free Counselling", href: "/contact" }}
                className="btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline text-body px-7 py-3.5"
              />
            </div>

            {/* <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-2.5">
                  <div className="relative w-9 h-9 shrink-0">
                    <Image
                      src={feature.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="36px"
                    />
                  </div>
                  <p className="text-caption sm:text-body-sm text-text-secondary leading-snug font-medium pt-0.5">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div> */}
          </div>

          <div className="lg:col-span-6 xl:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-lg">
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-bg-primary/30" />
              <div className="absolute inset-0 bg-linear-to-r from-bg-primary/40 via-transparent to-transparent" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 55% at 55% 45%, rgba(249,115,22,0.22) 0%, transparent 70%)",
                }}
              />
                <HeroVideoEmbed />
            </div>
          </div>
        </div>

        {/* <div className="mt-10 md:mt-12 lg:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 items-center justify-center">
          {quickStats.map((stat) => (
            <div
              key={stat.id}
              className="card-base card-hover px-3.5 py-4 md:px-4 md:py-5 flex items-center gap-3"
            >
              <div className="relative w-11 h-11 shrink-0">
                <Image
                  src={stat.icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0">
                <div className="text-body md:text-h4 font-bold text-text-primary leading-none truncate">
                  {stat.value}
                </div>
                <p className="mt-1.5 text-caption text-text-dimmed leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div> */}
        
      </div>
      
    </section>
  );
}
