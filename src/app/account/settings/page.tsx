import type { Metadata } from "next";
import { Settings2 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Settings — Rodha",
  description: "Manage your Rodha account settings.",
  path: "/account/settings",
});

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl">
      <header className="mb-5 sm:mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Settings
        </h1>
        <p className="mt-1.5 text-body text-[var(--account-text-muted)]">
          Preferences and account controls will live here.
        </p>
      </header>

      <section className="rounded-[var(--account-radius)] border border-dashed border-[var(--account-border-strong)] bg-[var(--account-surface)] px-5 py-10 text-center shadow-[var(--account-shadow)] sm:px-8 sm:py-12">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
          <Settings2 className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
        <h2 className="mt-4 font-montserrat text-lg font-bold text-[var(--account-text)]">
          Coming soon
        </h2>
        <p className="mx-auto mt-2 max-w-md text-body-sm text-[var(--account-text-muted)]">
          Notification preferences, privacy options, and other account settings
          are not available in this release. Check back later.
        </p>
      </section>
    </div>
  );
}
