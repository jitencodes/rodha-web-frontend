import {
  LegalCmsPage,
  legalPageMetadata,
} from "@/components/sections/LegalCmsPage";

export async function generateMetadata() {
  return legalPageMetadata("DISCLAIMER");
}

export default async function DisclaimerPage() {
  return <LegalCmsPage pageType="DISCLAIMER" />;
}
