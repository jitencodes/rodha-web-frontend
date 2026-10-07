import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPasswordScreen } from "@/components/auth/AuthPasswordScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Forgot Password — Rodha",
  description: "Request a Rodha password reset link by email.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthPasswordScreen mode="forgot" />
    </Suspense>
  );
}
