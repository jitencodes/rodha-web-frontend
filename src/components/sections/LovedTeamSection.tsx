import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { cn } from "@/lib/utils";
import { InfiniteCarousel } from "../ui/InfiniteCaraousel";

const LOVED_TEAM_IMAGES = [
  {
    src: "/assets/images/meet the team/team/team-1.jpg",
    alt: "Rodha team culture",
  },
  {
    src: "/assets/images/meet the team/team/team-2.jpg",
    alt: "Rodha team culture",
  },
  {
    src: "/assets/images/meet the team/team/team-3.png",
    alt: "Rodha team culture",
  },
  {
    src: "/assets/images/meet the team/team/team-4.png",
    alt: "Rodha team culture",
  },
  {
    src: "/assets/images/meet the team/team/team-5.jpg",
    alt: "Rodha team culture",
  },
] as const;

interface LovedTeamSectionProps {
  className?: string;
}

export function LovedTeamSection({ className }: LovedTeamSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="Our Loved Team"
          title="The Faces Behind Every Success"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <InfiniteCarousel
          showArrows
          autoPlay
          autoPlayInterval={3000}
          variableWidth
          fixedHeight={420}
          infinite
          className="w-full"
        >
          {LOVED_TEAM_IMAGES.map((image) => (
            <div
              key={image.src}
              className="relative h-full w-auto shrink-0 overflow-hidden rounded-xl bg-section-beige"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={900}
                className="h-full w-auto object-contain"
                sizes="(max-width: 768px) 80vw, 45vw"
              />
            </div>
          ))}
        </InfiniteCarousel>
      </Container>
    </section>
  );
}
