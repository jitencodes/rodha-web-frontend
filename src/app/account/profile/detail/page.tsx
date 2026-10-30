import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { ProfileDetailView } from "@/components/account/ProfileDetailView";
import { getStudentProfile } from "@/lib/api/modules/student/profile/service";
import { getStudentRegistration } from "@/lib/api/modules/student/registration/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";

export const metadata: Metadata = buildPageMetadata({
  title: "Profile Details — Rodha",
  description: "View your submitted Rodha registration details.",
  path: "/account/profile/detail",
});

export default async function AccountProfileDetailPage() {
  const data = await withStudentAuth(async (accessToken) => {
    let profile = null;
    try {
      profile = await getStudentProfile(accessToken);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/profile/detail");
      }
    }

    let courseEnrolledLabels: string[] = [];
    let batch = "";
    let batchCourse = "";
    try {
      const registration = await getStudentRegistration(accessToken);
      if (registration) {
        courseEnrolledLabels = registration.purchasedCourses
          .map((course) => course.courseTitle.trim())
          .filter(Boolean);

        batch = registration.batch ?? "";
        batchCourse = registration.batchCourse ?? "";
        if (!profile?.registration && registration.registration) {
          profile = {
            id: profile?.id || "",
            email: profile?.email || registration.account.email,
            mobile: profile?.mobile || registration.account.mobile,
            fullName: profile?.fullName || registration.account.fullName,
            profilePicturePath: profile?.profilePicturePath ?? null,
            stateId: profile?.stateId ?? null,
            stateName: profile?.stateName || "",
            stateCode: profile?.stateCode || "",
            registration: registration.registration,
            bookDispatches: profile?.bookDispatches ?? [],
          };
        }
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/profile/detail");
      }
    }

    return { profile, courseEnrolledLabels, batch, batchCourse };
  }, "/account/profile/detail");

  if (!data.profile?.registration) {
    redirect("/account/profile");
  }

  return (
    <ProfileDetailView
      profile={data.profile}
      courseEnrolledLabels={data.courseEnrolledLabels}
      batchCourse={data.batchCourse}
      batch={data.batch}
    />
  );
}
