import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { ACCOUNT_PROFILE_PAGE_COPY } from "@/data/account/profile";
import { AccountProfilePanel } from "@/components/account/AccountProfilePanel";
import { getStudentProfile } from "@/lib/api/modules/student/profile/service";
import { getAccessToken } from "@/lib/auth/server-session";

export const metadata: Metadata = buildPageMetadata({
  title: "My Profile — Rodha",
  description: "Manage your Rodha profile.",
  path: "/account/profile",
});

export default async function AccountProfilePage() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?next=/account/profile");
  }

  let profile = {
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  };

  try {
    const data = await getStudentProfile(accessToken);
    if (data) {
      profile = {
        fullName: data.fullName,
        email: data.email,
        phone: data.mobile,
        avatarUrl: data.profilePicturePath || "",
      };
    }
  } catch {
    // keep empty profile shell
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl">
      <header className="mb-5 sm:mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          {ACCOUNT_PROFILE_PAGE_COPY.title}
        </h1>
        <p className="mt-1.5 text-body text-[var(--account-text-muted)]">
          {ACCOUNT_PROFILE_PAGE_COPY.subtitle}
        </p>
      </header>

      <AccountProfilePanel initialProfile={profile} />
    </div>
  );
}
