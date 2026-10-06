import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Login — Rodha",
  description: "Log in to Rodha to continue your exam preparation.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen mode="login" />
    </Suspense>
  );
}
