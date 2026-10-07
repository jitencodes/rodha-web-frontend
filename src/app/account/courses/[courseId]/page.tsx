import type { Metadata } from "next";
import { Suspense } from "react";

import { AccountCourseDetailClient } from "@/components/account/course-detail/AccountCourseDetailClient";
import { buildPageMetadata } from "@/lib/seo";

interface AccountCourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({
  params,
}: AccountCourseDetailPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return buildPageMetadata({
    title: "Course Details — Rodha",
    description: "Your assigned course content.",
    path: `/account/courses/${courseId}`,
  });
}

export default async function AccountCourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl py-16 text-center text-body-sm text-[var(--account-text-muted)]">
          Loading course…
        </div>
      }
    >
      <AccountCourseDetailClient />
    </Suspense>
  );
}
