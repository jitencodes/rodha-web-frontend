import { LegalPageLayout } from "@/components/sections/LegalPageLayout";
import { REFUND_POLICY } from "@/data/legal";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: `${REFUND_POLICY.title} — Rodha`,
  description: REFUND_POLICY.description,
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return <LegalPageLayout content={REFUND_POLICY} />;
}
