import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import {
  ACCOUNT_PROFILE,
  ACCOUNT_PROFILE_PAGE_COPY,
} from "@/data/account/profile";
import { AccountProfilePanel } from "@/components/account/AccountProfilePanel";

export const metadata: Metadata = buildPageMetadata({
  title: "My Profile — Rodha",
  description: "Manage your Rodha profile.",
  path: "/account/profile",
});

export default function AccountProfilePage() {
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

      <AccountProfilePanel initialProfile={ACCOUNT_PROFILE} />
    </div>
  );
}
