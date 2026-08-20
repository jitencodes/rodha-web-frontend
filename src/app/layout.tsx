import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { PromotionalBanner } from "@/components/layout/PromotionalBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCounsellingCta } from "@/components/layout/FloatingCounsellingCta";
import { CounsellingModalProvider } from "@/components/layout/CounsellingModalProvider";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/constants";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const defaultTitle = "Rodha — Expert Mentorship. Proven Strategies. Real Results.";
const defaultDescription =
  "India's trusted platform for MBA (CAT + GDPI), Integrated Programs, Law, Banking & Government Exams, and Skill House. Expert mentorship, proven strategies, and real results.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: defaultDescription,
  keywords: [
    "MBA preparation",
    "CAT preparation",
    "GDPI training",
    "IPMAT coaching",
    "CLAT preparation",
    "Banking exam coaching",
    "SSC preparation",
    "Skill House",
    "competitive exam coaching",
  ],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultTitle,
    description:
      "India's trusted platform for MBA, Integrated Programs, Law, Banking & Government, and Skill House.",
    type: "website",
    url: SITE_URL,
    siteName: "Rodha",
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description:
      "India's trusted platform for MBA, Integrated Programs, Law, Banking & Government, and Skill House.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} dark`}>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd()) }}
        />
        <PromotionalBanner />
        <Header />
        <CounsellingModalProvider>
          <main>{children}</main>
          <FloatingCounsellingCta />
        </CounsellingModalProvider>
        <Footer />
      </body>
    </html>
  );
}
