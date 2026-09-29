import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Login — Rodha",
  description: "Log in to Rodha to continue your exam preparation.",
  path: "/login",
});

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
