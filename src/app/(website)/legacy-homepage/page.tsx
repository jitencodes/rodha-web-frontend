import type { Metadata } from "next";
import { LegacyHomePage } from "@/components/pages/LegacyHomePage";

export const metadata: Metadata = {
  title: "Homepage backup — Rodha",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LegacyHomepagePage() {
  return <LegacyHomePage />;
}
