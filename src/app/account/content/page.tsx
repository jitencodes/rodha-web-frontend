import type { Metadata } from "next";
import { Suspense } from "react";

import { AccountContentClient } from "@/components/account/AccountContentClient";
import { AccountContentListingSkeleton } from "@/components/account/AccountContentListingSkeleton";
import { getStudentCourseFilterOptions } from "@/lib/api/modules/student/courses/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Quick Content — Rodha",
  description: "Browse videos, quizzes, PDFs, live classes, and assignments.",
  path: "/account/content",
});

export default async function AccountContentPage() {
  const { courseOptions, packageOptions } = await withStudentAuth(
    async (accessToken) => {
      try {
        const options = await getStudentCourseFilterOptions(accessToken);
        return {
          courseOptions: options.courses,
          packageOptions: options.packages,
        };
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectSessionExpired("/account/content");
        }
        return { courseOptions: [], packageOptions: [] };
      }
    },
    "/account/content"
  );

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-6">
            <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
              Quick Content
            </h1>
            <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
              Browse videos, quizzes, PDFs, live classes, and assignments.
            </p>
          </header>
          <AccountContentListingSkeleton />
        </div>
      }
    >
      <AccountContentClient
        courseOptions={courseOptions}
        packageOptions={packageOptions}
      />
    </Suspense>
  );
}
