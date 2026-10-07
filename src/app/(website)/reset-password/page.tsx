import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPasswordScreen } from "@/components/auth/AuthPasswordScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Reset Password — Rodha",
  description: "Set a new password for your Rodha account.",
  path: "/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthPasswordScreen mode="reset" />
    </Suspense>
  );
}
