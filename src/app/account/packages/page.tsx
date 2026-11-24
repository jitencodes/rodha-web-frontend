import type { Metadata } from "next";
import Link from "next/link";

import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { PackageAddonsButton } from "@/components/checkout/PackageAddonsButton";
import {
  enrolledPackageToCourse,
} from "@/lib/api/modules/student/package-upgrades/mapper";
import { getStudentEnrolledPackages } from "@/lib/api/modules/student/package-upgrades/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Manage Packages — Rodha",
  description: "View your enrolled packages and available upgrades.",
  path: "/account/packages",
});

export default async function AccountPackagesPage() {
  const packages = await withStudentAuth(async (accessToken) => {
    try {
      return await getStudentEnrolledPackages(accessToken);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/packages");
      }
      return [];
    }
  }, "/account/packages");

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Manage Packages
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Review enrolled packages and upgrade when a better plan is available.
        </p>
      </header>

      {packages.length === 0 ? (
        <div className="rounded-[var(--account-radius)] border border-dashed border-[var(--account-border-strong)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-[15px] font-semibold text-[var(--account-text)]">
            No enrolled packages yet
          </p>
          <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
            Browse courses to enrol, then manage upgrades here.
          </p>
          <Link
            href="/account/courses?tab=buy"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white"
          >
            Buy Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {packages.map((pkg) => {
            const course = enrolledPackageToCourse(pkg);
            const hasUpgrades = pkg.availableUpgrades.length > 0;
            return (
              <div key={pkg.enrollmentId} className="flex h-full flex-col gap-2.5">
                <CourseCardV2
                  className="flex-1"
                  course={course}
                  href={pkg.slug ? `/courses/${pkg.slug}` : undefined}
                  ctaHref={
                    hasUpgrades
                      ? `/account/packages/upgrade?enrollmentId=${pkg.enrollmentId}`
                      : pkg.slug
                        ? `/courses/${pkg.slug}`
                        : undefined
                  }
                  ctaLabel={hasUpgrades ? "Available upgrades" : "View package"}
                />
                {pkg.availableAddons.length > 0 ? (
                  <PackageAddonsButton
                    count={pkg.availableAddons.length}
                    product={{
                      packageId: pkg.packageId,
                      slug: pkg.slug,
                      title: pkg.title,
                      thumbnail: pkg.bannerImageUrl,
                      detailsHref: pkg.slug ? `/courses/${pkg.slug}` : "/courses",
                      price: pkg.price,
                      originalPrice: pkg.originalPrice,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
