import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { cn } from "@/lib/utils";
import { SectionHeaderV2 } from "../SectionHeaderV2";

const BUDDY_APP_MOCKUP_SRC = "/assets/app promotion/app mockup.png";
const MOCK_APP_MOCKUP_SRC = "/assets/app promotion/mock_app_mockup.png";

const storeButtonClassName =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[6px] border border-neutral-300 bg-white text-body-sm font-semibold text-neutral-900 transition-colors hover:border-orange-500 hover:bg-neutral-50 active:bg-neutral-100";

interface HomeAppPromotionSectionProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  className?: string;
  buddyMockupSrc?: string;
  mockMockupSrc?: string;
}

const APP_DATA = [
  {
    id: "buddy",
    name: "Rodha Buddy",
    title: "Clear Your Doubts with Rodha Buddy",
    description:
      "Get instant help with your preparation through Rodha Buddy — your dedicated doubt-resolution companion whenever you need it.",
    mockupSrc: BUDDY_APP_MOCKUP_SRC,
    alt: "Rodha Buddy app showing doubt resolution screens",
    features: [
      "Resolve your doubts anytime, anywhere",
      "Get help while you practice and learn",
      "Stay on track with your preparation",
    ],
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.rodha.rodhabuddy",
    appStoreUrl: "https://apps.apple.com/in/app/rodha-buddy/id6764226160",
  },
  {
    id: "app",
    name: "RODHA APP",
    title: "Study on the Go with the Rodha App",
    description:
      "Carry your whole preparation in your pocket. Watch live classes, catch up on recordings, take tests and revise — on the commute, between lectures, or whenever you find a free hour.",
    mockupSrc: MOCK_APP_MOCKUP_SRC,
    alt: "Rodha App showing live classes, recordings and tests on a phone",
    features: [
      "Join live classes and replay recordings anytime",
      "Practice with tests and revision capsules between classes",
      "Pick up exactly where you left off across phone and laptop",
    ],
    playStoreUrl: "https://play.google.com/store/apps/details?id=co.diy14.qmbbw",
    appStoreUrl: "https://apps.apple.com/in/app/rodha-cat/id6469145034",
  },
];

export function HomeAppPromotionSection({
  eyebrow = "Access. Learn. Succeed.",
  title,
  description,
  className,
  buddyMockupSrc = BUDDY_APP_MOCKUP_SRC,
  mockMockupSrc = MOCK_APP_MOCKUP_SRC,
}: HomeAppPromotionSectionProps) {
  const heading =
    title ?? (
      <>
        Your Preparation{" "}<br />
        <span className="text-orange-500">Always Within Reach</span>
      </>
    );

  const apps = APP_DATA.map((app) => ({
    ...app,
    mockupSrc:
      app.id === "buddy" ? buddyMockupSrc : mockMockupSrc,
  }));

  return (
    <section
      data-home-zone="app-promo"
      className={cn(
        "home-section-spacing home-on-light relative bg-[#FFF3E8]",
        className
      )}
    >
      <Container>
        <RevealGroup>
          {/* Section heading */}
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeaderV2
              badge={eyebrow}
              title={heading}
              subtitle={description}
              align="center"
              className="mx-auto lg:!mb-10"
            />
          </div>

          {/* App cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {apps.map((app, index) => (
              <article
                key={app.id}
                className={cn(
                  "reveal-child relative overflow-hidden rounded-xl border border-[#f6dccb] bg-white/70 p-5 sm:p-6 lg:p-7",
                  "shadow-sm shadow-[#fbdfd1]/50"
                )}
              >
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-1 sm:gap-7">
                  {/* App mockup — always on top from lg+ (stacked cards) */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      index === 1 && "sm:order-2 lg:order-none"
                    )}
                  >
                    <div className="relative w-full max-w-[280px]">
                      <Image
                        src={app.mockupSrc}
                        alt={app.alt}
                        width={800}
                        height={600}
                        className="h-auto w-full object-contain"
                        sizes="(max-width: 640px) 80vw, 280px"
                        priority={false}
                      />
                    </div>
                  </div>

                  {/* App content — always below mockup from lg+ */}
                  <div
                    className={cn(
                      "flex flex-col",
                      index === 1 && "sm:order-1 lg:order-none"
                    )}
                  >
                    <p className="text-body-sm font-semibold uppercase tracking-wider text-orange-500">
                      {app.name}
                    </p>

                    <h3 className="mt-2 text-h3 font-montserrat font-semibold leading-tight text-black">
                      {app.title}
                    </h3>

                    <p className="mt-3 text-body leading-relaxed text-neutral-600">
                      {app.description}
                    </p>

                    <ul className="mt-5 space-y-2.5 text-body-sm text-neutral-600">
                      {app.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2"
                        >
                          <span
                            className="mt-1 text-orange-500"
                            aria-hidden
                          >
                            ✓
                          </span>

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <a
                        href={app.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={storeButtonClassName}
                        aria-label={`Get ${app.name} on Google Play`}
                      >
                        <Image
                          src="/assets/icons/playstore-svgrepo-com.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                        Google Play
                      </a>

                      <a
                        href={app.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={storeButtonClassName}
                        aria-label={`Get ${app.name} on App Store`}
                      >
                        <Image
                          src="/assets/icons/apple-logo-svgrepo-com.svg"
                          alt=""
                          width={25}
                          height={25}
                        />
                        App Store
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}