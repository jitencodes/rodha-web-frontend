import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account — Rodha",
  description:
    "Create your Rodha account to access courses, mocks, and mentorship.",
  path: "/signup",
});

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
