import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import type { HtmlSitemapGroup } from "@/lib/seo/sitemap-entries";

interface HtmlSitemapPageProps {
  groups: HtmlSitemapGroup[];
}

export function HtmlSitemapPage({ groups }: HtmlSitemapPageProps) {
  return (
    <section className="home-section-spacing relative bg-section-beige home-on-light">
      <Container>
        <SectionHeaderV2
          badge="Sitemap"
          title={
            <>
              Explore the{" "}
              <span className="text-orange-500">Rodha website</span>
            </>
          }
          subtitle="Browse every public section — categories, courses, faculty, content, and legal pages."
          align="center"
          className="mx-auto lg:!mb-12"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="min-w-0">
              <h2 className="home-light-heading mb-4 text-h4 font-semibold tracking-tight">
                {group.title}
              </h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-neutral-600 transition-colors hover:text-orange-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
