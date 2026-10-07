"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import {
  AccountThemeProvider,
  useAccountTheme,
} from "@/components/account/AccountThemeProvider";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import {
  AccountHeader,
  type AccountHeaderUser,
} from "@/components/account/AccountHeader";
import { RequireStateGate } from "@/components/account/RequireStateGate";
import { AccountUserProvider } from "@/components/providers/AccountUserProvider";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { useEnrollmentRefresh } from "@/hooks/useEnrollmentRefresh";

function AccountShellFrame({
  children,
  user,
}: {
  children: ReactNode;
  user: AccountHeaderUser;
}) {
  const { theme } = useAccountTheme();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEnrollmentRefresh();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div
      className="account-shell flex h-dvh overflow-hidden"
      data-account-theme={theme}
    >
      <AccountSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[var(--account-overlay)] lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-[var(--account-sidebar-width)]">
        <AccountHeader
          onMenuClick={() => setMobileNavOpen(true)}
          user={user}
        />
        <main className="min-h-0 flex-1 overflow-y-auto bg-[var(--account-bg)] px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <RequireStateGate />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export function AccountShell({
  children,
  user,
  authUser,
}: {
  children: ReactNode;
  user: AccountHeaderUser;
  authUser: AuthUserViewModel | null;
}) {
  return (
    <AccountUserProvider user={authUser}>
      <AccountThemeProvider>
        <AccountShellFrame user={user}>{children}</AccountShellFrame>
      </AccountThemeProvider>
    </AccountUserProvider>
  );
}
