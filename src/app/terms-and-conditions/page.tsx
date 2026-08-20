import { LegalPageLayout } from "@/components/sections/LegalPageLayout";
import { TERMS_AND_CONDITIONS } from "@/data/legal";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: `${TERMS_AND_CONDITIONS.title} — Rodha`,
  description: TERMS_AND_CONDITIONS.description,
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return <LegalPageLayout content={TERMS_AND_CONDITIONS} />;
}
