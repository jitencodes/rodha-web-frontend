import { notFound } from "next/navigation";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";
import { getLegalPage } from "@/lib/api/modules/legal/service";
import type { LegalPageType } from "@/lib/api/modules/legal/types";
import { buildPageMetadata } from "@/lib/seo";

const LEGAL_META: Record<
  LegalPageType,
  { path: string; fallbackTitle: string; fallbackDescription: string }
> = {
  PRIVACY_POLICY: {
    path: "/privacy-policy",
    fallbackTitle: "Privacy Policy",
    fallbackDescription:
      "How Rodha Educational Services Private Limited collects, uses, stores, and protects learner information on the Rodha platform.",
  },
  TERMS_OF_USE: {
    path: "/terms-and-conditions",
    fallbackTitle: "Terms & Conditions",
    fallbackDescription:
      "Terms of use for the Rodha platform, courses, and related services.",
  },
  REFUND_POLICY: {
    path: "/refund-policy",
    fallbackTitle: "Refund Policy",
    fallbackDescription:
      "Rodha refund, cancellation, and fee-related terms for enrolled learners.",
  },
  DISCLAIMER: {
    path: "/disclaimer",
    fallbackTitle: "Disclaimer",
    fallbackDescription:
      "Important disclaimers about Rodha courses, results, and platform information.",
  },
};

export async function legalPageMetadata(pageType: LegalPageType) {
  const page = await getLegalPage(pageType);
  const meta = LEGAL_META[pageType];

  return buildPageMetadata({
    title: `${page?.title ?? meta.fallbackTitle} — Rodha`,
    description: page?.description || meta.fallbackDescription,
    path: meta.path,
  });
}

export async function LegalCmsPage({ pageType }: { pageType: LegalPageType }) {
  const page = await getLegalPage(pageType);
  if (!page) notFound();
  return <LegalPageLayout page={page} />;
}
