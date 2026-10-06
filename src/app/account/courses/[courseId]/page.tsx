import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getStudentCourseDetail } from "@/lib/api/modules/student/courses/service";
import {
  getAccessToken,
  getSessionGraphy,
  withSsoToken,
} from "@/lib/auth/server-session";
import { getGraphySso } from "@/lib/api/modules/student/profile/service";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface AccountCourseDetailPageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({
  params,
}: AccountCourseDetailPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return buildPageMetadata({
    title: `Course ${courseId} — Rodha`,
    description: "Your assigned course content.",
    path: `/account/courses/${courseId}`,
  });
}

const CONTENT_TYPES = [
  { id: "", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "quizzes", label: "Quizzes" },
  { id: "pdfs", label: "PDFs" },
  { id: "live-classes", label: "Live Classes" },
] as const;

export default async function AccountCourseDetailPage({
  params,
  searchParams,
}: AccountCourseDetailPageProps) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?next=/account/courses");
  }

  const { courseId } = await params;
  const { type } = await searchParams;
  const contentType = type?.trim() || undefined;

  let detail = null;
  try {
    detail = await getStudentCourseDetail(accessToken, courseId, {
      type: contentType,
      page: 1,
      limit: 50,
    });
  } catch {
    detail = null;
  }

  if (!detail) {
    notFound();
  }

  let ssoToken = (await getSessionGraphy())?.ssoToken || "";
  if (!ssoToken) {
    try {
      const fresh = await getGraphySso(accessToken);
      ssoToken = fresh?.ssoToken || "";
    } catch {
      ssoToken = "";
    }
  }

  const openCourseHref = detail.courseTakeUrl
    ? withSsoToken(detail.courseTakeUrl, ssoToken)
    : "";

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4">
        <Link
          href="/account/courses?tab=continue"
          className="text-[13px] font-medium text-[var(--account-accent)]"
        >
          ← Back to Continue Watching
        </Link>
      </div>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
            {detail.title}
          </h1>
          <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
            {[detail.instructor, detail.language, `${Math.round(detail.progressPercent)}% complete`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        {openCourseHref ? (
          <a
            href={openCourseHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white"
          >
            Open in Graphy
          </a>
        ) : null}
      </header>

      <div
        role="tablist"
        className="mb-5 flex flex-wrap gap-2"
        aria-label="Content type"
      >
        {CONTENT_TYPES.map((tab) => {
          const active = (contentType || "") === tab.id;
          const href = tab.id
            ? `/account/courses/${courseId}?type=${tab.id}`
            : `/account/courses/${courseId}`;
          return (
            <Link
              key={tab.id || "all"}
              href={href}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-[var(--account-accent)] bg-[var(--account-nav-active-bg)] text-[var(--account-accent)]"
                  : "border-[var(--account-border)] text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {detail.items.length === 0 ? (
        <p className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-10 text-center text-body-sm text-[var(--account-text-muted)]">
          No content items for this filter.
        </p>
      ) : (
        <ul className="space-y-2">
          {detail.items.map((item) => {
            const href = item.takeUrl
              ? withSsoToken(item.takeUrl, ssoToken)
              : "";
            const Wrapper = href ? "a" : "div";
            return (
              <li key={item.id}>
                <Wrapper
                  {...(href
                    ? {
                        href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="flex items-center justify-between gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-3 transition-colors hover:border-[var(--account-accent)]/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[var(--account-text)]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[12px] capitalize text-[var(--account-text-muted)]">
                      {item.type}
                      {item.durationLabel ? ` · ${item.durationLabel}` : ""}
                      {item.completed ? " · Completed" : ""}
                    </p>
                  </div>
                  {href ? (
                    <span className="shrink-0 text-[12px] font-semibold text-[var(--account-accent)]">
                      Open →
                    </span>
                  ) : null}
                </Wrapper>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
