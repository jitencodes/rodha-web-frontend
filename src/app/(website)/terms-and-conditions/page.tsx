import {
  LegalCmsPage,
  legalPageMetadata,
} from "@/components/sections/LegalCmsPage";

export async function generateMetadata() {
  return legalPageMetadata("TERMS_OF_USE");
}

export default async function TermsPage() {
  return <LegalCmsPage pageType="TERMS_OF_USE" />;
}
