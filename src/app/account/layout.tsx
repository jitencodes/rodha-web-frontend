import type { ReactNode } from "react";
import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { getCurrentUser } from "@/lib/api/modules/auth/service";
import { getStudentProfile } from "@/lib/api/modules/student/profile/service";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { getAccessToken, getSessionUser } from "@/lib/auth/server-session";
import { isUnauthorizedError } from "@/lib/auth/require-student";
import "@/components/account/account-theme.css";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await getSessionUser();
  const accessToken = await getAccessToken();

  let authUser: AuthUserViewModel | null = sessionUser;
  let fullName = sessionUser?.fullName?.trim() || "Student";
  let avatarUrl = sessionUser?.profilePicturePath?.trim() || "";

  if (accessToken) {
    try {
      const me = await getCurrentUser(accessToken);
      if (me) {
        authUser = me;
        fullName = me.fullName?.trim() || fullName;
        avatarUrl = me.profilePicturePath?.trim() || avatarUrl;
      }
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        // keep cookie user
      }
    }

    if (!avatarUrl || !fullName) {
      try {
        const profile = await getStudentProfile(accessToken);
        if (profile?.fullName) fullName = profile.fullName;
        if (profile?.profilePicturePath) {
          avatarUrl = profile.profilePicturePath;
        }
      } catch {
        // keep session user
      }
    }
  }

  return (
    <Suspense fallback={null}>
      <AccountShell
        user={{ fullName, avatarUrl }}
        authUser={authUser}
      >
        {children}
      </AccountShell>
    </Suspense>
  );
}
