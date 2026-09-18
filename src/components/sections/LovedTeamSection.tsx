import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { cn } from "@/lib/utils";
import { InfiniteCarousel } from "../ui/InfiniteCaraousel";

interface LovedTeamSectionProps {
  className?: string;
  images?: Array<{ src: string; alt: string }>;
}

export function LovedTeamSection({
  className,
  images,
}: LovedTeamSectionProps) {
  const items = images ?? [];
  if (items.length === 0) return null;
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
          {items.map((image) => (
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
