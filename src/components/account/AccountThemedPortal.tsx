"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { AccountTheme } from "@/components/account/AccountThemeProvider";
import "@/components/account/account-theme.css";

/**
 * Portals account-styled overlays (dialogs, drawers) to `document.body` so
 * sticky / stacked parents can't clip them, wrapped in `.account-shell` so the
 * `--account-*` tokens resolve. Inside the account area it follows the
 * current account theme; on website pages it uses the light theme.
 */
export function AccountThemedPortal({ children }: { children: ReactNode }) {
  const probeRef = useRef<HTMLSpanElement>(null);
  const [theme, setTheme] = useState<AccountTheme | null>(null);

  useEffect(() => {
    const shell = probeRef.current?.closest<HTMLElement>(".account-shell");
    setTheme(shell?.dataset.accountTheme === "dark" ? "dark" : "light");
  }, []);

  return (
    <>
      <span ref={probeRef} hidden />
      {theme
        ? createPortal(
            <div className="account-shell" data-account-theme={theme}>
              {children}
            </div>,
            document.body
          )
        : null}
    </>
  );
}
