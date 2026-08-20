import { LegalPageLayout } from "@/components/sections/LegalPageLayout";
import { PRIVACY_POLICY } from "@/data/legal";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: `${PRIVACY_POLICY.title} — Rodha`,
  description: PRIVACY_POLICY.description,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <LegalPageLayout content={PRIVACY_POLICY} />;
}
