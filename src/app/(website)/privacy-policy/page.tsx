import {
  LegalCmsPage,
  legalPageMetadata,
} from "@/components/sections/LegalCmsPage";

export async function generateMetadata() {
  return legalPageMetadata("PRIVACY_POLICY");
}

export default async function PrivacyPolicyPage() {
  return <LegalCmsPage pageType="PRIVACY_POLICY" />;
}
