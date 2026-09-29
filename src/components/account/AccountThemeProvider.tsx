"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AccountTheme = "light" | "dark";

const STORAGE_KEY = "rodha-account-theme";
const TRANSITION_MS = 400;

type ThemeCoords = { x: number; y: number };

type AccountThemeContextValue = {
  theme: AccountTheme;
  setTheme: (theme: AccountTheme, coords?: ThemeCoords) => void;
  toggleTheme: (coords?: ThemeCoords) => void;
};

const AccountThemeContext = createContext<AccountThemeContextValue | null>(
  null
);

function endRadius(x: number, y: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
}

function runCircleFallback(
  next: AccountTheme,
  coords: ThemeCoords,
  apply: (theme: AccountTheme) => void
) {
  const radius = endRadius(coords.x, coords.y);
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9999",
    "pointer-events:none",
    `background:${next === "dark" ? "#0A0A0A" : "#FDFBF7"}`,
    `clip-path:circle(0px at ${coords.x}px ${coords.y}px)`,
    `transition:clip-path ${TRANSITION_MS}ms ease-out`,
  ].join(";");

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(${radius}px at ${coords.x}px ${coords.y}px)`;
    });
  });

  const finish = () => {
    apply(next);
    overlay.remove();
  };

  overlay.addEventListener("transitionend", finish, { once: true });
  window.setTimeout(finish, TRANSITION_MS + 50);
}

function applyWithTransition(
  next: AccountTheme,
  coords: ThemeCoords | undefined,
  apply: (theme: AccountTheme) => void
) {
  const point: ThemeCoords = coords ?? {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    apply(next);
    return;
  }

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };

  if (typeof doc.startViewTransition !== "function") {
    runCircleFallback(next, point, apply);
    return;
  }

  const radius = endRadius(point.x, point.y);
  const transition = doc.startViewTransition(() => {
    apply(next);
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${point.x}px ${point.y}px)`,
            `circle(${radius}px at ${point.x}px ${point.y}px)`,
          ],
        },
        {
          duration: TRANSITION_MS,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      /* transition aborted */
    });
}

export function AccountThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AccountTheme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: AccountTheme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback(
    (next: AccountTheme, coords?: ThemeCoords) => {
      if (next === theme) return;
      applyWithTransition(next, coords, persist);
    },
    [persist, theme]
  );

  const toggleTheme = useCallback(
    (coords?: ThemeCoords) => {
      setTheme(theme === "light" ? "dark" : "light", coords);
    },
    [setTheme, theme]
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <AccountThemeContext.Provider value={value}>
      {children}
    </AccountThemeContext.Provider>
  );
}

export function useAccountTheme() {
  const ctx = useContext(AccountThemeContext);
  if (!ctx) {
    throw new Error("useAccountTheme must be used within AccountThemeProvider");
  }
  return ctx;
}
