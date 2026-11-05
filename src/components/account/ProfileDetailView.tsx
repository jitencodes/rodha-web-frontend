"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarCheck, Mail, MapPin, Phone, Users } from "lucide-react";
import type { StudentProfileViewModel } from "@/lib/api/modules/student/profile/types";
import type { StudentRegistrationRecord } from "@/lib/api/modules/student/registration/types";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";

type ProfileDetailViewProps = {
  profile: StudentProfileViewModel;
  /** Individual enrolled course titles (not a comma-joined string). */
  courseEnrolledLabels?: string[];
  batch?: string;
  batchCourse?: string;
};

type DetailTab = "academics" | "work" | "books";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "academics", label: "Academics" },
  { id: "work", label: "Work experience" },
  { id: "books", label: "Books & others" },
];

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatGender(value: string | null): string {
  if (!value) return "—";
  const map: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Prefer not to say",
  };
  return map[value] || value;
}

function formatScheme(value: string | null): string {
  if (!value) return "—";
  if (value === "PERCENTAGE") return "Percentage";
  if (value === "CGPA") return "CGPA";
  return value;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-caption font-medium text-[var(--account-text-muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-body text-[var(--account-text)]">
        {value || "—"}
      </dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
      <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
        {title}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function EmptyTab({ message }: { message: string }) {
  return (
    <p className="rounded-[var(--account-radius)] border border-dashed border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-8 text-center text-body-sm text-[var(--account-text-muted)]">
      {message}
    </p>
  );
}

function AcademicsTab({ reg }: { reg: StudentRegistrationRecord }) {
  return (
    <div className="space-y-4">
      <DetailSection title="Class 10">
        <DetailRow label="Board" value={reg.class10BoardName} />
        <DetailRow
          label="Scoring scheme"
          value={formatScheme(reg.class10ScoringScheme)}
        />
        <DetailRow label="Score" value={reg.class10Score} />
        <DetailRow label="Year of passing" value={reg.class10YearOfPassing} />
      </DetailSection>
      <DetailSection title="Class 12">
        <DetailRow label="Status" value={reg.class12Status} />
        {reg.class12Status === "PASSED" ? (
          <>
            <DetailRow label="Board" value={reg.class12BoardName} />
            <DetailRow label="Stream" value={reg.class12Stream} />
            <DetailRow
              label="Scoring scheme"
              value={formatScheme(reg.class12ScoringScheme)}
            />
            <DetailRow label="Score" value={reg.class12Score} />
            <DetailRow
              label="Year of passing"
              value={reg.class12YearOfPassing}
            />
          </>
        ) : null}
      </DetailSection>
      {reg.graduationCollege || reg.graduationDegree ? (
        <DetailSection title="Graduation">
          <DetailRow label="Stream" value={reg.graduationStream} />
          <DetailRow label="Degree" value={reg.graduationDegree} />
          <DetailRow
            label="Specialisation"
            value={reg.graduationSpecialisation}
          />
          <DetailRow label="College / University" value={reg.graduationCollege} />
          <DetailRow label="Status" value={reg.graduationStatus} />
          <DetailRow label="Year" value={reg.graduationYear} />
          <DetailRow
            label="Scoring scheme"
            value={formatScheme(reg.graduationScoringScheme)}
          />
          <DetailRow label="Score" value={reg.graduationScore} />
        </DetailSection>
      ) : null}
      {reg.postGraduationStatus && reg.postGraduationStatus !== "NO" ? (
        <DetailSection title="Post Graduation">
          <DetailRow label="Status" value={reg.postGraduationStatus} />
          <DetailRow
            label="Degree & specialization"
            value={reg.pgDegreeSpecialization}
          />
          <DetailRow label="College / University" value={reg.pgCollege} />
          <DetailRow
            label="Scoring scheme"
            value={formatScheme(reg.pgScoringScheme)}
          />
          <DetailRow label="Score" value={reg.pgScore} />
        </DetailSection>
      ) : null}
    </div>
  );
}

function WorkTab({ reg }: { reg: StudentRegistrationRecord }) {
  if (!reg.hasWorkExperience) {
    return <EmptyTab message="No work experience recorded." />;
  }
  return (
    <DetailSection title="Work experience">
      <DetailRow
        label="Total experience (months)"
        value={reg.workExperienceMonths}
      />
      <DetailRow label="Organization" value={reg.workOrganization} />
      <DetailRow label="Designation / Role" value={reg.workDesignation} />
      <DetailRow label="Industry" value={reg.industryName} />
    </DetailSection>
  );
}

function BooksOthersTab({
  profile,
  reg,
}: {
  profile: StudentProfileViewModel;
  reg: StudentRegistrationRecord;
}) {
  const hasBooks =
    reg.bookNames.length > 0 || profile.bookDispatches.length > 0;
  return (
    <div className="space-y-4">
      <DetailSection title="Exam goals">
        <DetailRow label="Target vertical" value={reg.targetVerticalName} />
        <DetailRow
          label="Target exams"
          value={reg.targetExamNames.join(", ") || "—"}
        />
        <DetailRow label="Target year" value={reg.targetYear} />
        <DetailRow
          label="Target colleges"
          value={reg.targetCollegeNames.join(", ") || "—"}
        />
        {reg.previousCatAttempts != null ? (
          <>
            <DetailRow
              label="Previous CAT attempts"
              value={reg.previousCatAttempts}
            />
            <DetailRow label="Previous CAT year" value={reg.previousCatYear} />
            <DetailRow
              label="Overall percentile"
              value={reg.previousCatOverallPercentile}
            />
            <DetailRow
              label="Sectionals (VARC / DILR / QA)"
              value={[
                reg.previousCatVarcPercentile,
                reg.previousCatDilrPercentile,
                reg.previousCatQaPercentile,
              ]
                .filter((v) => v != null)
                .join(" / ") || "—"}
            />
          </>
        ) : null}
      </DetailSection>

      {hasBooks ? (
        <DetailSection title="Books">
          <DetailRow
            label="Selected books"
            value={reg.bookNames.join(", ") || "—"}
          />
          {profile.bookDispatches.map((dispatch) => (
            <div key={dispatch.id} className="sm:col-span-2">
              <DetailRow
                label={dispatch.packageTitle || `Dispatch #${dispatch.id}`}
                value={`${dispatch.status}${
                  dispatch.trackingId ? ` · ${dispatch.trackingId}` : ""
                } · ${dispatch.books.map((b) => b.name).join(", ") || "—"}`}
              />
            </div>
          ))}
        </DetailSection>
      ) : null}

      <DetailSection title="Source & consent">
        <DetailRow label="How did you hear about Rodha?" value={reg.source} />
        <DetailRow
          label="Declaration accepted"
          value={reg.declarationAccepted ? "Yes" : "No"}
        />
        <DetailRow
          label="Privacy consent"
          value={reg.privacyConsentAccepted ? "Yes" : "No"}
        />
        <DetailRow
          label="WhatsApp consent"
          value={reg.whatsappConsent ? "Yes" : "No"}
        />
      </DetailSection>
    </div>
  );
}

export function ProfileDetailView({
  profile,
  courseEnrolledLabels = [],
  batch,
  batchCourse,
}: ProfileDetailViewProps) {
  const [tab, setTab] = useState<DetailTab>("academics");
  const reg = profile.registration;
  const fullName = profile.fullName || "Student";
  const avatar = profile.profilePicturePath || reg?.passportPhotoPath || "";
  const enrolledCourses = courseEnrolledLabels.filter((title) => title.trim());

  if (!reg) {
    return (
      <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-6 text-center">
        <p className="text-body text-[var(--account-text-muted)]">
          Registration details are not available yet.
        </p>
        <Link
          href="/account/profile"
          className="mt-4 inline-flex text-body-sm font-semibold text-[var(--account-accent)]"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-5">
      <Link
        href="/account/profile"
        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-[var(--account-text-muted)] hover:text-[var(--account-accent)]"
      >
        <ArrowLeft className="size-4" />
        Back to profile
      </Link>

      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

          {/* Student Information */}
          <div className="min-w-0 flex-1">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-[var(--account-accent-soft)] sm:size-24">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-montserrat text-xl font-bold text-[var(--account-accent)]">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>
              <div className="block">
                <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
                  {fullName}
                </h1>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-body-sm text-[var(--account-text-muted)]">
                  {profile.email ? (
                    <span className="inline-flex min-w-0 items-center gap-1.5 break-all">
                      <Mail className="size-3.5 shrink-0" />
                      {profile.email}
                    </span>
                  ) : null}

                  {profile.mobile ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5 shrink-0" />
                      {profile.mobile}
                    </span>
                  ) : null}

                  {reg.stateName ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      {reg.stateName}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Enrollment Summary */}
            <dl className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {enrolledCourses.length > 0 ? (
                <div className="col-span-2 flex min-w-0 items-start gap-3 rounded-lg border border-[var(--account-border)] bg-[var(--account-accent-soft)]/40 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
                    <BookOpen className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <dt className="text-caption text-[var(--account-text-muted)]">
                      Courses enrolled
                    </dt>
                    <dd className="mt-1">
                      <ul className="list-disc space-y-1 pl-4 text-body-sm font-semibold text-[var(--account-text)]">
                        {enrolledCourses.map((title, index) => (
                          <li key={`${title}-${index}`} className="break-words">
                            {title}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </div>
              ) : null}

              
                <div className="flex min-w-0 items-start gap-3 rounded-lg border border-[var(--account-border)] bg-[var(--account-accent-soft)]/40 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
                    <Users className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <dt className="text-caption text-[var(--account-text-muted)]">
                      Batch
                    </dt>
                    <dd className="mt-1 break-words text-body-sm font-semibold text-[var(--account-text)]">
                      {batch ?? "—"}
                    </dd>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 rounded-lg border border-[var(--account-border)] bg-[var(--account-accent-soft)]/40 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
                    <Users className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <dt className="text-caption text-[var(--account-text-muted)]">
                      Batch Course
                    </dt>
                    <dd className="mt-1 break-words text-body-sm font-semibold text-[var(--account-text)]">
                      {batchCourse ?? "—"}
                    </dd>
                  </div>
                </div>

              <div className="flex min-w-0 items-start gap-3 rounded-lg border border-[var(--account-border)] bg-[var(--account-accent-soft)]/40 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
                  <CalendarCheck className="size-4" />
                </div>

                <div className="min-w-0">
                  <dt className="text-caption text-[var(--account-text-muted)]">
                    Submitted
                  </dt>
                  <dd className="mt-1 text-body-sm font-semibold text-[var(--account-text)]">
                    {formatDate(reg.submittedAt)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <DetailSection title="Personal">
        <DetailRow label="Date of birth" value={formatDate(reg.dateOfBirth)} />
        <DetailRow label="Gender" value={formatGender(reg.gender)} />
        <DetailRow label="Category" value={reg.studentCategoryName} />
        <DetailRow
          label="Person with Disability (PwD)"
          value={reg.isPwd ? "Yes" : "No"}
        />
        <DetailRow label="Govt ID (last 4)" value={reg.govtIdLast4} />
        <DetailRow label="Primary language" value={reg.primaryLanguage} />
        <DetailRow label="Current status" value={reg.currentStatusName} />
      </DetailSection>

      <DetailSection title="Contact">
        <DetailRow label="WhatsApp" value={reg.whatsappNumber} />
        <DetailRow label="Alternate phone" value={reg.alternatePhone} />
        <DetailRow label="Alternate email" value={reg.alternateEmail} />
        <DetailRow
          label="LinkedIn"
          value={
            reg.linkedinUrl ? (
              <a
                href={reg.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--account-accent)] underline"
              >
                {reg.linkedinUrl}
              </a>
            ) : (
              "—"
            )
          }
        />
      </DetailSection>

      <DetailSection title="Address">
        <DetailRow label="Address line 1" value={reg.addressLine1} />
        <DetailRow label="Address line 2" value={reg.addressLine2} />
        <DetailRow label="City" value={reg.city} />
        <DetailRow label="State/UT" value={reg.stateName} />
        <DetailRow label="PIN code" value={reg.pinCode} />
      </DetailSection>

      {reg.parentName ? (
        <DetailSection title="Parent / guardian">
          <DetailRow label="Name" value={reg.parentName} />
          <DetailRow label="Relation" value={reg.parentRelation} />
          <DetailRow label="Mobile" value={reg.parentMobile} />
        </DetailSection>
      ) : null}

      <div>
        <div
          role="tablist"
          aria-label="Profile detail sections"
          className="flex gap-2 overflow-x-auto border-b border-[var(--account-border)] pb-px"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={cn(
                  "shrink-0 rounded-t-[var(--account-radius)] px-3 py-2.5 text-body-sm font-semibold transition-colors",
                  active
                    ? "border-b-2 border-[var(--account-accent)] text-[var(--account-accent)]"
                    : "text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" className="mt-4">
          {tab === "academics" ? <AcademicsTab reg={reg} /> : null}
          {tab === "work" ? <WorkTab reg={reg} /> : null}
          {tab === "books" ? (
            <BooksOthersTab profile={profile} reg={reg} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
