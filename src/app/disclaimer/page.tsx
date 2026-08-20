import { LegalPageLayout } from "@/components/sections/LegalPageLayout";
import { DISCLAIMER } from "@/data/legal";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: `${DISCLAIMER.title} — Rodha`,
  description: DISCLAIMER.description,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return <LegalPageLayout content={DISCLAIMER} />;
}
