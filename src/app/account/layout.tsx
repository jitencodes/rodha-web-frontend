import type { ReactNode } from "react";
import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import "@/components/account/account-theme.css";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AccountShell>{children}</AccountShell>
    </Suspense>
  );
}
