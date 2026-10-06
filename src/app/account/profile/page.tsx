import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { ACCOUNT_PROFILE_PAGE_COPY } from "@/data/account/profile";
import { AccountProfilePanel } from "@/components/account/AccountProfilePanel";
import { getCurrentUser } from "@/lib/api/modules/auth/service";
import { getStudentProfile } from "@/lib/api/modules/student/profile/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";

export const metadata: Metadata = buildPageMetadata({
  title: "My Profile — Rodha",
  description: "Manage your Rodha profile.",
  path: "/account/profile",
});

export default async function AccountProfilePage() {
  const profile = await withStudentAuth(async (accessToken) => {
    let next = {
      fullName: "",
      email: "",
      phone: "",
      avatarUrl: "",
      stateId: null as number | null,
      stateName: "",
      stateCode: "",
    };

    try {
      const me = await getCurrentUser(accessToken);
      if (me) {
        next = {
          fullName: me.fullName,
          email: me.email,
          phone: me.mobile,
          avatarUrl: me.profilePicturePath || "",
          stateId: me.stateId,
          stateName: me.state?.name || "",
          stateCode: me.state?.code || "",
        };
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/profile");
      }
    }

    if (!next.email) {
      try {
        const data = await getStudentProfile(accessToken);
        if (data) {
          next = {
            ...next,
            fullName: data.fullName || next.fullName,
            email: data.email,
            phone: data.mobile || next.phone,
            avatarUrl: data.profilePicturePath || next.avatarUrl,
          };
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectSessionExpired("/account/profile");
        }
      }
    }

    return next;
  }, "/account/profile");

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
