import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils";

interface BlogHeroSectionProps {
  className?: string;
}

export function BlogHeroSection({ className }: BlogHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary min-h-[380px] lg:min-h-[530px]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl"
        aria-hidden
      />

      <div className="pointer-events-none absolute bottom-0 right-0 hidden w-[68%] lg:block xl:w-[62%] h-[90%]">
        <Image
          src="/assets/images/blog/Blogs.png"
          alt="Blog & Insights"
          fill
          className="object-contain object-right-bottom"
          sizes="42vw"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.7) 20%, transparent 50%)",
          }}
        />
      </div>

      <Container className="relative z-10 py-6 md:py-8 lg:py-10 lg:min-h-[460px] flex flex-col justify-center">
        <Breadcrumb
          className="py-0 pb-4 md:pb-5"
          items={[
            { label: "Home", href: "/" },
            { label: "Blogs" },
          ]}
        />

        <div className="max-w-xl lg:max-w-lg">
          <p className="text-body-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
            Blogs &amp; Insights
          </p>
          <h1 className="text-[26px] sm:text-[38px] md:text-[42px] font-montserrat font-bold leading-[1.15] tracking-tight text-text-primary">
          Everything You Need to Navigate Your {" "}
            <span className="text-orange-500">CAT Journey</span>
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-text-secondary leading-relaxed">
          From CAT preparation strategies and score-versus-percentile analysis to college applications, form-filling guides, and admission insights, get the guidance you need at every step towards your dream B-school.
          </p>
        </div>
      </Container>
    </section>
  );
}
