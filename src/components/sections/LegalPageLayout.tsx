import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LEGAL_CONTACT } from "@/data/legal";
import type { LegalPageViewModel } from "@/lib/api/modules/legal/types";

interface LegalPageLayoutProps {
  page: LegalPageViewModel;
}

export function LegalPageLayout({ page }: LegalPageLayoutProps) {
  const showToc = page.toc.length > 0;

  return (
    <section className="home-section-spacing-lg bg-section-white home-on-light pt-8 md:pt-10">
      <Container>
        <header className="border-b border-section-beige pb-6 mb-8 md:mb-10">
          <h1 className="home-light-heading text-h1 font-bold tracking-tight">
            {page.title}
          </h1>
          {page.lastUpdated ? (
            <p className="home-light-muted mt-3 text-body-lg">
              Last updated: {page.lastUpdated}
            </p>
          ) : null}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {showToc ? (
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <nav
                className="rounded-[6px] border border-section-beige bg-section-beige p-4 lg:sticky lg:top-24"
                aria-label="Table of contents"
              >
                <p className="text-body-sm font-semibold text-neutral-900 mb-3">
                  On this page
                </p>
                <ul className="space-y-2">
                  {page.toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-body-sm text-neutral-500 hover:text-orange-500 transition-colors leading-snug"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}

          <div
            className={
              showToc
                ? "lg:col-span-9 order-1 lg:order-2 space-y-6"
                : "lg:col-span-12 space-y-6"
            }
          >
            <article className="rounded-[6px] border border-section-beige bg-white p-5 md:p-8 shadow-sm">
              <div
                className="blog-prose legal-prose text-body min-w-0 max-w-full break-words overflow-wrap-anywhere"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            </article>

            <div className="rounded-[6px] border border-section-beige border-l-4 border-l-orange-500 bg-section-beige p-5 md:p-6">
              <h2 className="text-h4 font-semibold text-neutral-900">
                Contact for Grievances
              </h2>
              <p className="mt-2 text-body text-neutral-600 leading-relaxed">
                For questions or grievances related to this page, reach out to:
              </p>
              <div className="mt-4 space-y-1.5 text-body text-neutral-700">
                <p className="font-medium text-neutral-900">
                  {LEGAL_CONTACT.grievanceOfficer}
                </p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${LEGAL_CONTACT.email}`}
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {LEGAL_CONTACT.email}
                  </a>
                </p>
                <p>Phone: {LEGAL_CONTACT.phone}</p>
                <p>Address: {LEGAL_CONTACT.address}</p>
              </div>
              <p className="mt-4 text-body-sm text-neutral-500">
                Related:{" "}
                <Link
                  href="/privacy-policy"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Privacy
                </Link>
                {" · "}
                <Link
                  href="/terms-and-conditions"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Terms
                </Link>
                {" · "}
                <Link
                  href="/refund-policy"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Refund
                </Link>
                {" · "}
                <Link
                  href="/disclaimer"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Disclaimer
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
