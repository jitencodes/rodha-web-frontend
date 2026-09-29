import {
  LegalCmsPage,
  legalPageMetadata,
} from "@/components/sections/LegalCmsPage";

export async function generateMetadata() {
  return legalPageMetadata("REFUND_POLICY");
}

export default async function RefundPolicyPage() {
  return <LegalCmsPage pageType="REFUND_POLICY" />;
}
